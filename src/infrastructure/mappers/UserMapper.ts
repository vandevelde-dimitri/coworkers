import { User, UserPublic } from "../../domain/entities/user/User";

export class UserMapper {
    static toDomain(raw: any): User {
        return {
            id: raw.id,
            firstName: raw.firstname,
            lastName: raw.lastname,
            profileAvatar: raw.image_profile,
            city: raw.city,
            team: raw.team,
            contract: raw.contract,
            fcId: raw.fc_id,
            fcName: raw.fc?.name,
            memberSince: new Date(raw.created_at),
            settings: {
                toConvey: raw.settings ? raw.settings.to_convey : false,
            },
            avatarUpdatedAt: raw.avatar_updated_at,
        };
    }

    static toDomainPublic(raw: any): UserPublic {
        return {
            id: raw.id,
            firstName: raw.firstname,
            lastName: raw.lastname,
            profileAvatar: raw.image_profile,
            city: raw.city,
            team: raw.team,
            contract: raw.contract,
            fcId: raw.fc_id,
            fcName: raw.fc.name,
            memberSince: new Date(raw.created_at),
        };
    }

    static toPersistence(user: Partial<User>) {
        const data: any = {
            firstname: user.firstName,
            lastname: user.lastName,
            image_profile: user.profileAvatar,
            city: user.city,
            team: user.team,
            contract: user.contract,
        };

        if (user.fcId) data.fc_id = user.fcId;

        return data;
    }
}
