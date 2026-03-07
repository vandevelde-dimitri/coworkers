export interface Notification {
  id: string;
  annonceId: string;
  annonceTitle: string;
  otherUserId: string;
  status: string; // 'pending', 'accepted', 'refused', etc.
  scope: "owner" | "candidate";
  createdAt: string;
  userName: string;
  profileAvatar: string;
  message: string;
  avatarUpdatedAt: string;
}
