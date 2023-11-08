import prisma from "@/lib/prisma"
import { Prisma, PrismaClient } from "@prisma/client"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import toast from "react-hot-toast";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

export const authOption: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    secret: process.env.SECRET!,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email : { label: "Email", type: "email", placeholder: "example@example.com"},
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password)
                {
                    throw new Error("Please enter your email and password")
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user)
                {
                    await prisma.user.create({
                        data: {
                            email: credentials.email,
                            password: credentials.password,
                            name: credentials.email.split("@")[0]
                        }
                    })

                    const findAgain = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    })

                    if(findAgain)
                    {
                        return findAgain
                    }
                }

                if(user?.password != credentials.password)
                {
                    throw new Error ("Please sign in with Google")
                }

                const passwordMatch = user.password == credentials.password

                if(!passwordMatch)
                {
                    throw new Error("Incorrect password")
                }
                return user
            }
        }),
        GoogleProvider({
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET
        })
      ],
      callbacks: {
        async jwt({token, user, session}) {
            return token;
        },
        async session({session, user}) {
            return session;
        },
        async signIn ({account, profile}) {
            if (account?.type === 'credentials') {
                return true
            }
            if (!profile?.email)
            {
                throw new Error("No profile")
            }

            await prisma.user.upsert({
                where: { email: profile.email },
                update: {
                    name: profile.name,
                    avatar: profile.image,
                },
                create: {
                    email: profile.email,
                    name: profile.name,
                    avatar: profile.image,
                }
            })

            return true
        }
    }
}

const handler = NextAuth(authOption)

export { handler as GET, handler as POST }