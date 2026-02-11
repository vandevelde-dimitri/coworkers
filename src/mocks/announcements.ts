import { Announcement } from "../domain/entities/announcement/Announcement";

const createMockUser = (
    id: string,
    fName: string,
    lName: string,
    avatar: string,
) => ({
    id,
    firstName: fName,
    lastName: lName,
    profileAvatar: avatar,
    city: "Paris",
    team: "Dev", // Value random for interface
    contract: "CDI", // Value random for interface
    fcName: "FC Test",
    fcId: "123",
    memberSince: new Date(),
    settings: { toConvey: true },
});

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    {
        id: "1",
        title: "Paris ➔ Lyon",
        content: "Départ matinal, j'ai de la place pour deux valises moyennes.",
        createdAt: "2024-06-01T10:00:00Z",
        dateStart: "2024-06-01T10:00:00Z",
        places: 3,
        owner: createMockUser(
            "u1",
            "Marc",
            "Aurèle",
            "https://i.pravatar.cc/150?u=u1",
        ),
        passenger: [
            createMockUser(
                "u2",
                "Sophie",
                "Lefebvre",
                "https://i.pravatar.cc/150?u=u2",
            ),
            createMockUser(
                "u3",
                "Lucas",
                "Gomez",
                "https://i.pravatar.cc/150?u=u3",
            ),
        ],
    },
    {
        id: "2",
        title: "Bordeaux ➔ Nantes",
        content: "Trajet zen, musique calme autorisée !",
        createdAt: "2024-06-01T10:00:00Z",
        dateStart: "2024-06-01T10:00:00Z",
        places: 1,
        owner: createMockUser(
            "u4",
            "Julie",
            "Dubois",
            "https://i.pravatar.cc/150?u=u4",
        ),
        passenger: [],
    },
    {
        id: "3",
        title: "Bordeaux ➔ Nantes",
        content: "Trajet zen, musique calme autorisée !",
        createdAt: "2024-06-01T10:00:00Z",
        dateStart: "2024-06-01T10:00:00Z",
        places: 1,
        owner: createMockUser(
            "u4",
            "Julie",
            "Dubois",
            "https://i.pravatar.cc/150?u=u4",
        ),
        passenger: [],
    },
];
