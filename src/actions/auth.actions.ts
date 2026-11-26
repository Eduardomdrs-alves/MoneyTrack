"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { normalizeError } from "@/lib/errors";
import { getFieldErrors, registerSchema, type RegisterSchema } from "@/lib/validations";
import { User } from "@/models/User";
import { seedDefaultCategories } from "@/services/category.service";
import type { ActionResult } from "@/types";

const SALT_ROUNDS = 12;

/**
 * Server Action de cadastro.
 * A senha NUNCA é salva em texto puro: geramos um hash com bcrypt (salt + 12 rounds).
 */
export async function registerUser(input: RegisterSchema): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Verifique os campos destacados.",
      fieldErrors: getFieldErrors(parsed.error),
    };
  }

  const { name, email, password } = parsed.data;

  try {
    await connectDB();

    const alreadyExists = await User.exists({ email });
    if (alreadyExists) {
      return {
        success: false,
        error: "Este e-mail já está cadastrado.",
        fieldErrors: { email: ["Este e-mail já está em uso"] },
      };
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password: passwordHash });

    // Todo usuário novo já começa com categorias prontas para uso
    await seedDefaultCategories(user._id.toString());

    return { success: true, message: "Conta criada com sucesso!" };
  } catch (error) {
    const { error: message } = normalizeError(error);
    return { success: false, error: message };
  }
}
