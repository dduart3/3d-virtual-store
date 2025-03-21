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
        updated_at: profile?.updated_at || null
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
export function useSignUp() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
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
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    isCheckingUsername: checkUsernameMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingAvatar: updateAvatarMutation.isPending
  };
}
