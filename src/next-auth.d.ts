import { type DefaultSession } from 'next-auth';

export interface Board {
    id: string;
    userId: string;
    shapes: Shape[];
    position?: {
        x: number,
        y: number
    };
    scale?: number;
    createdAt: string;
    updatedAt: string;
}

export type ExtendUser = {
    boards?: Board[]
} & DefaultSession['user'];


declare module "next-auth" {
    interface Session {
        user: ExtendUser
    }
  
}



// {
//     id: string;
//     name?: string | null;
//     email?: string | null;
//     hashedPassword?: string | null;
//     emailVerified?: string | null;
//     image?: string | null;
//     boards?: Board[]; // Include user's boards
//     createdAt: string;
//     updatedAt: string;
//   };

// interface User {
//     id: string;
//     name?: string | null;
//     email?: string | null;
//     hashedPassword?: string | null;
//     emailVerified?: string | null;
//     image?: string | null;
//     boards?: Board[];
//     createdAt: string;
//     updatedAt: string;
// }

