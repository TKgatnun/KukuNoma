import { loginAction } from '@/app/actions';
import Link from 'next/link';
import Image from 'next/image';
import cuteChickIcon from '../../../assets/cute-chick.png';


export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="bg-card text-card-foreground max-w-md w-full p-8 rounded-2xl shadow-lg border">
        <div className="text-center mb-8">
          <Image src={cuteChickIcon} alt="Cute Chick" width={64} height={64} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage batches and sales.</p>
        </div>

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors">
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}
