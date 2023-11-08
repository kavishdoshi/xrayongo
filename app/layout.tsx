import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { authOption } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import prisma from "@/lib/prisma"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Xray-On-Go',
  description: 'Xray on Go',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOption);
  if(!session || !session?.user?.email || !session?.user?.name){
    redirect('/api/auth/signin');
  }

  // check if email in session in database
  const email = session?.user?.email;
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  })
  
  // if not redirect to signup page
  if(!user){
    redirect('/api/auth/signin');
  }

  
    

  return (
    <>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </>
  )
}
