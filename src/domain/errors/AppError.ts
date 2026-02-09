export class AppError extends Error {
    constructor(
        public message: string,
        public code?: string,
    ) {
        super(message);
        this.name = "AppError";
    }
}

// Erreur quand on n'est pas connecté
export class UnauthorizedError extends AppError {
    constructor(message = "Vous devez être connecté") {
        super(message, "UNAUTHORIZED");
    }
}

// Erreur quand un truc n'existe pas
export class NotFoundError extends AppError {
    constructor(message = "Ressource introuvable") {
        super(message, "NOT_FOUND");
    }
}

// Erreur de logique métier (ex: changer de centre trop souvent)
export class BusinessError extends AppError {
    constructor(message: string) {
        super(message, "BUSINESS_RULE_VIOLATION");
    }
}
