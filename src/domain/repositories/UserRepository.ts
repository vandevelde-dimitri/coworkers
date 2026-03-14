import { UpdateUserPayload, User, UserPublic } from "../entities/user/User";

export interface IUserRepository {
  getUserById(id: string): Promise<User | null>;
  updateUser(data: UpdateUserPayload): Promise<void>;
  getCurrentSessionId(): Promise<string | null>;
  deleteAvatar(): Promise<void>;
  deleteAccount(): Promise<void>;
  updateImageProfile(avatarUrl: string): Promise<void>;
  uploadAvatar(avatarFile: string): Promise<string>;
  getUserProfilePublic(userId: string): Promise<UserPublic | null>;
  getUserProfileStatus(): Promise<boolean>;
}
