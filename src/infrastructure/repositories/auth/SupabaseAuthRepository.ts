import { IAuthRepository } from "@/src/domain/repositories/auth/AuthRepository";
import { supabase } from "../../supabase";

export class SupabaseAuthRepository implements IAuthRepository {
    async login(email: string, password: string): Promise<void> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (__DEV__) console.error("Login error:", error);
            throw new Error(error.message);
        }
    }

    async register(email: string, password: string): Promise<void> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            if (__DEV__) console.error("Register error:", error);
            throw new Error(error.message);
        }
    }
    async logout(): Promise<void> {
        const { error } = await supabase.auth.signOut();

        if (error) {
            if (__DEV__) console.error("Logout error:", error);
            throw new Error(error.message);
        }
    }
}
