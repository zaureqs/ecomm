import * as z from "zod";

const signupFormSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  email: z
    .string()
    .min(1, { message: "Required" })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(8, { message: "password length must be at least 8 characters." }),
});

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Required" })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(8, { message: "password length must be at least 8 characters." }),
});

const otpFormSchema = z.object({
  otp: z.string().min(8, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const emptyInputSchema = z.object({});

export { signupFormSchema, loginFormSchema, otpFormSchema, emptyInputSchema};
