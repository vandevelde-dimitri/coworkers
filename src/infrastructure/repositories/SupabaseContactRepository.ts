import {
  ContactMessage,
  ContactMessageResponse,
} from "@/src/domain/entities/contact/ContactMessage";
import { IContactRepository } from "@/src/domain/repositories/ContactRepository";
import { supabase } from "../supabase";

export class SupabaseContactRepository implements IContactRepository {
  private static instance: SupabaseContactRepository;

  private constructor() {}

  static getInstance(): SupabaseContactRepository {
    if (!this.instance) {
      this.instance = new SupabaseContactRepository();
    }
    return this.instance;
  }

  async sendContactMessage(
    message: ContactMessage,
  ): Promise<ContactMessageResponse> {
    try {
      const { data, error } = await supabase.functions.invoke("contact-email", {
        body: {
          name: message.name,
          email: message.email,
          subject: message.subject,
          message: message.message,
          siteName: message.siteName || undefined,
        },
      });

      if (error) {
        if (__DEV__) console.error("Contact error:", error);
        throw new Error("failed_to_send_message");
      }

      return {
        success: true,
        messageId: data?.messageId || data?.id,
      };
    } catch (err) {
      if (__DEV__) console.error("Error sending contact message:", err);
      throw new Error("failed_to_send_message");
    }
  }
}
