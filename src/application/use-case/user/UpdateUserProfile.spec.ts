import { IUserRepository } from "../../../domain/repositories/UserRepository";
import { logger } from "../../../utils/logger";
import { UpdateUserProfileUseCase } from "./UpdateUserProfile";

jest.mock("../../../utils/logger", () => ({
    logger: {
        critical: jest.fn(), // <--- C'est ici qu'on crée l'espion (jest.fn())
    },
}));

describe("UpdateUserProfileUseCase", () => {
    // On crée un faux Repository (Mock)
    const mockRepo: jest.Mocked<IUserRepository> = {
        updateUser: jest.fn(),
        getCurrentSessionId: jest.fn(),
        // ajoute les autres méthodes vides si TS râle
    } as any;

    const useCase = new UpdateUserProfileUseCase(mockRepo);

    it("devrait appeler le repository avec les bonnes données", async () => {
        const payload = { firstName: "Jane" };

        // On simule une réussite
        mockRepo.updateUser.mockResolvedValue(undefined);

        await useCase.execute(payload);

        // On vérifie que le repo a bien été appelé
        expect(mockRepo.updateUser).toHaveBeenCalledWith(payload);
    });

    it("devrait échouer si le repository échoue", async () => {
        mockRepo.updateUser.mockRejectedValue(new Error("DB_ERROR"));

        // On vérifie que le Use Case laisse bien passer l'erreur
        await expect(useCase.execute({ firstName: "Jane" })).rejects.toThrow(
            "DB_ERROR",
        );
    });
    it("devrait appeler le logger.critical en cas d'échec du repository", async () => {
        // 1. On force une erreur
        const error = new Error("Erreur fatale");
        mockRepo.updateUser.mockRejectedValue(error);

        try {
            await useCase.execute({ firstName: "Test" });
        } catch (e) {
            // 2. On vérifie que le logger a été appelé avec les bons arguments
            expect(logger.critical).toHaveBeenCalled();
        }
    });
});
