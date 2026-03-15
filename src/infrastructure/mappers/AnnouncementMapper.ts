import { Announcement } from "../../domain/entities/announcement/Announcement";
import { RequestParticipant } from "../../domain/entities/announcement/ParticipantRequest.enum";
import { UserMapper } from "./UserMapper";

export class AnnouncementMapper {
  static toDomain(raw: any): Announcement {
    const acceptedPassengers = raw.participant_requests
      ? raw.participant_requests
          .filter((req: any) => req.status === RequestParticipant.ACCEPTED)
          .map((req: any) =>
            req.users ? UserMapper.toDomain(req.users) : null,
          )
          .filter(Boolean)
      : [];

    return {
      id: raw.id,
      title: raw.title,
      content: raw.content,
      conversationId: raw.conversation_id,
      places: raw.number_of_places,
      dateStart: new Date(raw.date_start),
      dateEnd: raw.date_end ? new Date(raw.date_end) : undefined,
      createdAt: new Date(raw.created_at),
      owner: UserMapper.toDomain(raw.owner),
      passenger: acceptedPassengers,
    };
  }

  static toPersistence(announcement: Partial<Announcement>) {
    const formatDate = (date: any) => {
      if (!date) return null;
      if (typeof date === "string") return date.split("T")[0];
      return date.toISOString().split("T")[0];
    };

    return {
      title: announcement.title,
      content: announcement.content,
      number_of_places: announcement.places,
      date_start: formatDate(announcement.dateStart),
      date_end: formatDate(announcement.dateEnd),
    };
  }
}
