import { NextResponse } from 'next/server';
import { authOption } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import prisma from "@/lib/prisma"

export async function PATCH (
    req: Request
) {
    try{

        const session = await getServerSession(authOption);
        if(!session || !session?.user?.email || !session?.user?.name){
            redirect('/api/auth/signin');
        }

        const body = await req.json();
        const {addressline1, addressline2,area, city, date, time, phonenumber, countrycode, email } = body;

        if (!email) {
            return new NextResponse("Email is required", { status: 400 });
        }

        //check if this email exsist in the database
        const user = await prisma.user.findFirst({
            where: {
                email: session.user.email
            }
        });

        if (!user)
        {
            return new NextResponse(`User not found`, { status: 404 });
        }

        const appointment = await prisma.appointment.create({
            data: {
                userId : user.id,
                addressline1,
                addressline2,
                area,
                city,
                date,
                time,
                phonenumber,
                countrycode,
                email: session.user.email,
            }
        });

        return new NextResponse(JSON.stringify({appointment}), { status: 200 });

    } catch(error) {
        console.log("[Appointment_PATCH] ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST (
    req: Request
) {
    try{

        const session = await getServerSession(authOption);
        if(!session || !session?.user?.email || !session?.user?.name){
            redirect('/api/auth/signin');
        }

        const body = await req.json();
        const {time} = body;


        const appointments = await prisma.appointment.findMany({
            where: {
                time
            }
        });

        return new NextResponse(JSON.stringify({appointments}), { status: 200 });

    } catch(error) {
        console.log("[Appointment_POST] ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

