import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .max(254, "Email is too long");

const strongPasswordField = z
  .string()
  .min(9, "Password must be more than 8 characters")
  .max(72, "Password is too long")
  .regex(/^[A-Z]/, "Password must start with a capital letter")
  .regex(/[0-9]/, "Password must include at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must include at least one symbol");

export const CreateUserSchema = z.object({
  username: emailField,
  password: strongPasswordField,
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),
});

export const SigninSchema = z.object({
  username: emailField,
  password: z.string().min(1, "Password is required"),
});

export const CreateRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Room name must be at least 3 characters")
    .max(20, "Room name must be under 20 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Room name can only contain letters, numbers, - and _"
    ),
});