export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  siteName?: string;
}

export interface ContactMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
