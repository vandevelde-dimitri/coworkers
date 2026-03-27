import {
  ContactMessage,
  ContactMessageResponse,
} from "../entities/contact/ContactMessage";

export interface IContactRepository {
  sendContactMessage(message: ContactMessage): Promise<ContactMessageResponse>;
}
