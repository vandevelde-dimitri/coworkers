export interface Notification {
  id: string;
  annonceId: string;
  annonceTitle: string;
  otherUserId: string;
  status: string;
  scope: "owner" | "candidate";
  createdAt: string;
  userName: string;
  profileAvatar: string;
  message: string;
  avatarUpdatedAt: string;
}
