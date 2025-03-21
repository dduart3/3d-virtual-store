import { atom } from 'jotai';

export interface OnlineUser {
  userId: string;
  username: string;
  avatarUrl: string;
  // You could add more properties like lastActive, status, etc.
}

export const onlineUsersAtom = atom<OnlineUser[]>([]);
export const showOnlineUsersAtom = atom<boolean>(false);
