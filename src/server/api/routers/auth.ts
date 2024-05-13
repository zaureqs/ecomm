import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import { emptyInputSchema, loginFormSchema, otpFormSchema, signupFormSchema } from "@/types/auth.type";
import sendOtp from "@/lib/sendOtp";

type MyPayload = {
  user: {
    id: number;
    name: string;
    email: string;
  };
};

function generateAuthToken(payload: MyPayload): string | undefined {
  try {
    const secret: string = process.env.JWT_SECRET_KEY!;
    if (!secret) {
      throw new Error("JWT secret key not found");
    }
    const options: jwt.SignOptions = {
      expiresIn: "24h",
    };
    return jwt.sign(payload, secret, options).toString();
  } catch (err) {
    return undefined;
  }
}

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(loginFormSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user || !(await bcrypt.compare(input.password, user.password))) {
        throw new Error("Invalid email or password");
      }
      const token = generateAuthToken({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });

      cookies().set({
        name: "auth_token",
        value: token || " ",
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "strict",
      });

      return { success: true, message: "login successful " };
    }),

  signup: publicProcedure
    .input(signupFormSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error("Email already exists");
      }

      const hashedPassword: string = bcrypt.hashSync(input.password, 10);

      const verificationToken = Math.floor(Math.random() * 90000000) + 10000000;

      const tokenHash = bcrypt.hashSync(verificationToken.toString(), 5);

      const mailstatus = await sendOtp(
        verificationToken.toString(),
        input.email,
      );

      if (!mailstatus.success) {
        throw new Error("Error sending OTP");
      }

      const newUser = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          token: tokenHash,
        },
      });

      newUser.password = "";

      const token = generateAuthToken({
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      });

      cookies().set({
        name: "auth_token",
        value: token || " ",
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "strict",
      });

      return {
        token: token,
        user: newUser,
        success: true,
      };
    }),

  verifyEmail: protectedProcedure
    .input(otpFormSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.user.id,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.token) {
        throw new Error("Invalid otp");
      }

      if (!bcrypt.compare(input.otp, user.token)) {
        throw new Error("Invalid otp");
      }

      const updated = await ctx.db.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          verified: true,
          token: null,
        },
      });
      return {
        user: updated,
      };
    }),
  isLogedIn: protectedProcedure
    .input(emptyInputSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.user.id,
        },
      });

      if (!user) {
        throw new Error("you are not logged.");
      }
      if (!user.verified) {
        throw new Error("you are not verified.");
      }
      return {
        success: true,
        message: "you are loged in",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    }),
});
