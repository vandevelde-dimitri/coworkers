import {
  ContactMessage,
  ContactMessageResponse,
} from "@/src/domain/entities/contact/ContactMessage";
import { IContactRepository } from "@/src/domain/repositories/ContactRepository";

export class SendContactMessageUseCase {
  constructor(private contactRepository: IContactRepository) {}

  async execute(message: ContactMessage): Promise<ContactMessageResponse> {
    this.validate(message);
    return await this.contactRepository.sendContactMessage(message);
  }

  private validate(message: ContactMessage): void {
    if (!message.subject || message.subject.trim().length === 0) {
      throw new Error("subject_required");
    }
    if (message.subject.length > 100) {
      throw new Error("subject_too_long");
    }
    if (!message.message || message.message.trim().length === 0) {
      throw new Error("message_required");
    }
    if (message.message.length > 5000) {
      throw new Error("message_too_long");
    }

    if (!message.name || message.name.trim().length === 0) {
      throw new Error("user_not_authenticated");
    }
    if (!message.email || message.email.trim().length === 0) {
      throw new Error("user_email_missing");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(message.email)) {
      throw new Error("email_address_invalid");
    }
  }
}
