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
            authorize: async (credentials) => {
                const { password, email } = credentials;

                if (!password || !email) {
                    console.log("Missing credentials");
                    return null;
                }
                
                try {
                    const user = await prisma.user.findUnique({
            
                        where: { email: email as string }
                    });
                    
                    if (user) {
                        const passwordMatched = await bcrypt.compare(password as string, user.hashedPassword as string);
                        if (passwordMatched) {
                            console.log("Password matched, returning user:", user);
                            return user;
                        } else {
                            console.log("Password not matched");
                            throw new Error("Username or password is incorrect.");
                            return null;
                        }
                    } else {
                        console.log("User not registered");
                        throw new Error("Email does not exist.");
                        return null;
                    }
                } catch (e) {
                    console.error("Error in authorize function:", e);
                    return null;
                }
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
    session: {
        strategy: "jwt",  // Ensures session persistence
    },
    debug: true, // Enables debugging in the server console
});
