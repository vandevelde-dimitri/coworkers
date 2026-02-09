import { IUserRepository } from "../../../domain/repositories/UserRepository";
import * as convertUtils from "../../../utils/convertToWebp";
import { logger } from "../../../utils/logger";
import { UpdateAvatarUserUseCase } from "./UploadAvatarUser";

// 1. Mock du Logger
jest.mock("../../../utils/logger", () => ({
    logger: { critical: jest.fn() },
}));

// 2. Mock de l'utilitaire de conversion (pour éviter de manipuler de vraies images)
jest.mock("../../../utils/convertToWebp", () => ({
    convertToWebp: jest.fn(),
}));

describe("UpdateAvatarUserUseCase", () => {
    let useCase: UpdateAvatarUserUseCase;
    let mockRepo: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRepo = {
            uploadAvatar: jest.fn(),
            updateImageProfile: jest.fn(),
            getCurrentSessionId: jest.fn(),
        } as any;
        useCase = new UpdateAvatarUserUseCase(mockRepo);
    });

    it("devrait réussir le cycle complet : conversion, upload et mise à jour DB", async () => {
        // GIVEN
        const fakeFile = "photo.jpg";
        const fakeWebp = "photo.webp";
        const fakeUrl = "https://supabase.com/avatar.webp";

        (convertUtils.convertToWebp as jest.Mock).mockResolvedValue(fakeWebp);
        mockRepo.uploadAvatar.mockResolvedValue(fakeUrl);
        mockRepo.updateImageProfile.mockResolvedValue(undefined);

        // WHEN
        await useCase.execute(fakeFile);

        // THEN
        expect(convertUtils.convertToWebp).toHaveBeenCalledWith(fakeFile);
        expect(mockRepo.uploadAvatar).toHaveBeenCalledWith(fakeWebp);
        expect(mockRepo.updateImageProfile).toHaveBeenCalledWith(fakeUrl);
    });

    it("devrait logger une erreur critique si l'update en base de données échoue après l'upload", async () => {
        // GIVEN
        const errorDb = new Error("Erreur Connexion DB");
        mockRepo.uploadAvatar.mockResolvedValue("https://some-url.com");
        mockRepo.updateImageProfile.mockRejectedValue(errorDb);
        mockRepo.getCurrentSessionId.mockResolvedValue("user-123");

        // WHEN
        await expect(useCase.execute("photo.jpg")).rejects.toThrow(
            "Erreur Connexion DB",
        );

        // THEN
        // On vérifie que le logger a été appelé car le fichier est "orphelin" dans le storage
        expect(logger.critical).toHaveBeenCalledWith(
            "ERR_USR_UPDATE_AVATAR",
            expect.any(String),
            errorDb,
            "user-123",
        );
    });
});
