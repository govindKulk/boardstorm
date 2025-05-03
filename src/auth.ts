import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import { saltAndHashPassword } from "./utils/password";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { getUserFromDb } from "./utils/db";
import { User } from "@prisma/client";
import Google from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import { error } from "console";
export const {
    auth,
    signIn,
    signOut,
    handlers
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Github,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const { password, email } = credentials;
              
                if (!password || !email) {
                  // Instead of throwing, return null
                    return Promise.reject(new Error("MISSING_CREDENTIALS"));
                }
              
                const user = await prisma.user.findUnique({
                  where: { email: email as string },
                });
              
                if (!user) {
                  return Promise.reject(new Error("USER_NOT_FOUND"));
                }
              
                const passwordMatched = await bcrypt.compare(password as string, user.hashedPassword!);
                if (!passwordMatched) {
                  return Promise.reject(new Error("INVALID_PASSWORD"));
                }
              
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                };
              },
              
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            console.log("Session callback token:", token); // Debugging
        
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.id as string,
                    email: token.email as string,
                    
                };
            }
        
            console.log("Modified session:", session); // Debugging
            return session;
        },        
        async jwt({ token, user }) {
            console.log("JWT callback user:", user); // Debugging
        
            if (user) {
                token.id = user.id;         // ✅ Ensure ID is stored in token
                token.email = user.email;
            }
        
            console.log("Modified JWT token:", token); // Debugging
            return token;
        }
        
    },
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt",  // Ensures session persistence
    },
    debug: true, // Enables debugging in the server console
});
