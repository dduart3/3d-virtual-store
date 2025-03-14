export interface UserProfile {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    address: string | null;
    phone: string | null;
    avatar_url: string | null;
    created_at: string | null;
    updated_at: string | null;
  }
  
  export interface ProfileUpdateData {
    first_name?: string;
    last_name?: string;
    username?: string;
    address?: string;
    phone?: string;
    avatar_url?: string;
  }
  