"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { ExtendUser } from "@/next-auth";


interface AuthContextType {
  userId: string | null;
  status: string;
  user: ExtendUser | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<ExtendUser | null>(null);
  
  useEffect(() => {
    console.log(session , " : from authcontext")
    if (session?.user) {
      setUserId(session.user.id as string); // Ensure `id` is available in the session
      
      setUser(session.user)


      }
  }, [session]);

  return (
    <AuthContext.Provider value={{ userId, status, user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook to use AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
