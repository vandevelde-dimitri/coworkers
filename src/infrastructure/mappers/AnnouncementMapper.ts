import { Announcement } from "../../domain/entities/announcement/Announcement";
import { RequestParticipant } from "../../domain/entities/announcement/ParticipantRequest.enum";
import { UserMapper } from "./UserMapper";

export class AnnouncementMapper {
    static toDomain(raw: any): Announcement {
        const acceptedPassengers = raw.participant_requests
            ? raw.participant_requests
                  .filter(
                      (req: any) => req.status === RequestParticipant.ACCEPTED,
                  )
                  .map((req: any) => UserMapper.toDomain(req.users))
            : [];

        return {
            id: raw.id,
            title: raw.title,
            content: raw.content,
            places: raw.number_of_places,
            dateStart: new Date(raw.date_start),
            dateEnd: raw.date_end ? new Date(raw.date_end) : undefined,
            createdAt: new Date(raw.created_at),
            owner: UserMapper.toDomain(raw.owner),
            passenger: acceptedPassengers,
        };
    }

    static toPersistence(announcement: Partial<Announcement>) {
        const data: any = {
            title: announcement.title,
            content: announcement.content,
            number_of_places: announcement.places,
            date_start: announcement.dateStart
                ? announcement.dateStart.toISOString()
                : null,
            date_end: announcement.dateEnd
                ? announcement.dateEnd.toISOString()
                : null,
        };

        return data;
    }
}
