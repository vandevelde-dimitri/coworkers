export class AppError extends Error {
    constructor(
        public message: string,
        public code?: string,
    ) {
        super(message);
        this.name = "AppError";
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Vous devez être connecté") {
        super(message, "UNAUTHORIZED");
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Ressource introuvable") {
        super(message, "NOT_FOUND");
    }
}

export class BusinessError extends AppError {
    constructor(message: string) {
        super(message, "BUSINESS_RULE_VIOLATION");
    }
}
