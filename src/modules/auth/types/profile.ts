export interface UserData extends UserProfileData {
    id: string;
    email: string;
    avatar_url: string | null;
    created_at: string | null;
    updated_at: string | null;
  }
  
  export interface UserProfileData {
    first_name?: string;
    last_name?: string;
    username?: string;
    address?: string;
    phone?: string;
  }