import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from "@/lib/mongoDB_Client";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'

export const authOptions : NextAuthOptions = {
    adapter:MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label:'Email',type: 'text'},
                password: {label: 'Password',type: 'password'},
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials.password) {
                    throw new Error('Email and Password are required');
                }

                await dbConnect();

                const user = await UserModel.findOne({email: credentials.email});

                if(!user) {
                    throw new Error('No user found with this email');
                }
                const isValidPassword = user.password && (await bcrypt.compare(credentials.password, user.password));
                if(!isValidPassword) {
                    throw new Error('Invalid Password');
                }
                return {
                    id : user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/sign-in'
    },
    callbacks: {
        async jwt({token,user}) {
            if(user && user.name && user.email && user.image) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.picture = user.image;
            }
            return token;
        },
        async session({token,session}) {
            if(token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.picture;
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
}
