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
  async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      if (__DEV__) console.error("Update password error:", error);
      throw new Error(error.message);
    }
  }

  async updateEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      if (__DEV__) console.error("Update email error:", error);
      throw new Error(error.message);
    }
  }
}
