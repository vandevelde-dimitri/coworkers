import { UserContract, UserTeam } from "./User.enum";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  profileAvatar: string;
  city: string;
  team: UserTeam;
  avatarUpdatedAt: string | null;
  contract: UserContract;
  fcName: string;
  fcId: string;
  memberSince: Date;
  settings: {
    toConvey: boolean;
  };
}

export interface UserPublic {
  id: string;
  firstName: string;
  lastName: string;
  profileAvatar: string;
  city: string;
  team: UserTeam;
  avatarUpdatedAt: string | null;
  contract: UserContract;
  fcName: string;
  fcId: string;
  memberSince: Date;
  settings: {
    toConvey: boolean;
    available: boolean;
  };
}

export type UpdateUserPayload = Partial<
  Omit<
    User,
    "id" | "memberSince" | "settings" | "avatarUpdatedAt" | "profileAvatar"
  >
>;

export type CreateUserPayload = Omit<User, "id" | "memberSince">;
