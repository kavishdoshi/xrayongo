import { getServerSession } from 'next-auth'
import { authOption } from '@/app/api/auth/[...nextauth]/route';
import {BookAnAppointmentForm} from '@/components/BookAnAppointmentForm';

export default async function Home() {

  const session = await getServerSession(authOption);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <BookAnAppointmentForm email={JSON.stringify(session?.user?.email)} />
    </main>
  )
}
