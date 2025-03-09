import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

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

// Get the user profile
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
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
      userData,
    }: {
      email: string;
      password: string;
      userData: any;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData },
      });

      if (error) throw error;
      return data;
    },
  });
}

// Sign out mutation
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
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
      const { data, error } = await supabase
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
      profileData: {
        username: string;
        first_name: string;
        last_name: string;
        avatar_url: string;
      };
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

export function updateAvatar() {
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
      // Invalidate profile query to refresh data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// Update the useAuth function to include these new methods
export function useAuth() {
  const sessionQuery = useSession();
  const userId = sessionQuery.data?.user?.id;
  const profileQuery = useProfile(userId);
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const signOutMutation = useSignOut();
  const checkUsernameMutation = useCheckUsername();
  const updateProfileMutation = useUpdateProfile();
  const updateAvatarMutation = updateAvatar();

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
