import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import {UserData, UserProfileData} from "../types/profile";
import { useAtom } from "jotai";
import { currentUserIdAtom } from "../../cart/state/cart";

// Get the current session
export function useSession() {
  return useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<UserData | null> => {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error(`Error fetching user: ${userError.message}`);
      }
      
      if (!user) return null;
      
      // Fetch profile data from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found" which we handle gracefully
        throw new Error(`Error fetching profile: ${profileError.message}`);
      }
      
      // Return combined user and profile data
      return {
        id: user.id,
        email: user.email || '',
        first_name: profile?.first_name || null,
        last_name: profile?.last_name || null,
        username: profile?.username || null,
        address: profile?.address || null,
        phone: profile?.phone || null,
        avatar_url: profile?.avatar_url || null,
        created_at: profile?.created_at || null,
        updated_at: profile?.updated_at || null,
        role_id: profile?.role_id || null
      };
    }
  });
}

// Sign in mutation
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      // Invalidate and refetch queries
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      return queryClient.refetchQueries({ queryKey: ["auth", "session"] });
    },
  });
}


// Sign up mutation
// Update the useSignUp function to include redirectTo
export function useSignUp() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      profileData
    }: {
      email: string;
      password: string;
      profileData: {
        username: string,
        first_name: string,
        last_name: string,
        avatar_url: string
      }
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: profileData
        }
      });

      if (error) throw error;
      return data;
    },
  });
}


// Sign out mutation
export function useSignOut() {
  const queryClient = useQueryClient();
  const [, setCurrentUserId] = useAtom(currentUserIdAtom);

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      setCurrentUserId(null);
      if (error) throw error;
    },
    onSuccess: () => {
      // Clear auth data from query cache
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// Check if username is available
export function useCheckUsername() {
  return useMutation({
    mutationFn: async (username: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single();

      if (data) {
        throw new Error("Username already taken");
      }

      return { available: true };
    },
  });
}

// Update profile with registration data
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      profileData,
    }: {
      userId: string;
      profileData: UserProfileData
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", userId);
        console.log(error)
        

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      avatarUrl,
    }: {
      userId: string;
      avatarUrl: string;
    }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", userId)
        .single();

      if (error) throw error;
      console.log(data)
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { success: true };
    },
  });
}

// Update password with reset token
export function useUpdatePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    },
  });
}


export function useAuth() {
  const sessionQuery = useSession();
  const userId = sessionQuery.data?.user?.id;
  const profileQuery = useProfile();
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const signOutMutation = useSignOut();
  const checkUsernameMutation = useCheckUsername();
  const updateProfileMutation = useUpdateProfile();
  const updateAvatarMutation = useUpdateAvatar();
  const resetPasswordMutation = useResetPassword();
  const updatePasswordMutation = useUpdatePassword();

  return {
    user: sessionQuery.data?.user || null,
    session: sessionQuery.data,
    profile: profileQuery.data,
    loading:
      sessionQuery.isLoading || (userId ? profileQuery.isLoading : false),
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    signOut: signOutMutation.mutate,
    checkUsername: checkUsernameMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    updateAvatar: updateAvatarMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    updatePassword: updatePasswordMutation.mutate,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    isCheckingUsername: checkUsernameMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingAvatar: updateAvatarMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isUpdatingPassword: updatePasswordMutation.isPending,
  };
}
