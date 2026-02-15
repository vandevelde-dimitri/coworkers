export interface IAuthRepository {
    login(email: string, password: string): Promise<void>;
    register(email: string, password: string): Promise<void>;
    logout(): Promise<void>;
}
