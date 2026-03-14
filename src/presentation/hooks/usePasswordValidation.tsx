import { RegisterUseCase } from "@/src/application/use-case/auth/Register";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { useMemo } from "react";

export const usePasswordValidation = (password: string) => {
  const useCase = useMemo(
    () => new RegisterUseCase(SupabaseAuthRepository.getInstance()),
    [],
  );

  return useMemo(() => useCase.getPasswordCriteria(password), [password]);
};
