import { User } from "@/models/User.model";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
type UserId = string;

declare module 'next-auth/jwt' {
    interface JWT {
        id: UserId;
        username?: string;
        name: string;
        email: string;
        picture?: string;
        username?: string;
    }
}

declare module 'next-auth' {
    interface Session {
        user: User & {
            id: UserId;
            username?: string;
            name: string;
            email: string;
            image?: string;
            username?: string;
        }
    }
}