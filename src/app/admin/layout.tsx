import Link from 'next/link';
import Image from 'next/image';
import { LogOut, LayoutDashboard, BarChart3 } from 'lucide-react';
import { logoutAction } from '@/app/actions';
import cuteChickIcon from '../../../assets/cute-chick.png';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_auth');
  
  if (!authCookie || authCookie.value !== process.env.ADMIN_PASSWORD) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r shadow-sm flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-2 border-b">
          <Image 
            src={cuteChickIcon} 
            alt="KukuNoma Chick Logo" 
            width={24} 
            height={24} 
            className="object-contain transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,146,60,0.8)] hover:-translate-y-0.5" 
          />
          <span className="font-bold text-lg">KukuNoma Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 text-foreground transition-colors">
            <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 text-foreground transition-colors">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Reports</span>
          </Link>
        </nav>
        <div className="p-4 border-t flex items-center justify-between">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-3 w-full px-2 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors font-medium">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </form>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-card border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image 
              src={cuteChickIcon} 
              alt="KukuNoma Chick Logo" 
              width={24} 
              height={24} 
              className="object-contain" 
            />
            <span className="font-bold">KukuNoma Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <form action={logoutAction}>
              <button type="submit" className="text-sm text-destructive font-medium">Logout</button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
