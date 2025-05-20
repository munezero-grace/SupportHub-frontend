import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();
  if (!session) {
    redirect('/');
  }
  
  return <DashboardLayout>{children}</DashboardLayout>
}
