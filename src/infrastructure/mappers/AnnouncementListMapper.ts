import { Announcement } from "../../domain/entities/announcement/Announcement";

export class AnnouncementListMapper {
    static toDomain(raw: any): Announcement {
        return {
            id: raw.id,
            title: raw.title,
            content: raw.content,
            places: raw.number_of_places,
            dateStart: new Date(raw.date_start),
            dateEnd: raw.date_end ? new Date(raw.date_end) : undefined,
            createdAt: new Date(),

            owner: {
                id: raw.user_id,
                firstName: raw.user_name,
                lastName: "",
                profileAvatar: raw.image_profile,
                avatarUpdatedAt: raw.avatar_updated_at,
                city: raw.city,
                team: raw.team,
                contract: raw.contract,
                fcName: raw.fc_name,
                fcId: "",
                memberSince: new Date(),
                settings: {
                    toConvey: raw.to_convey,
                },
            },
            passenger: [],
        };
    }
}
