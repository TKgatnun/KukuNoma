import { getBatches } from '@/lib/db';
import { Countdown } from '@/components/Countdown';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import heroImage from '../../assets/wp2055252.jpg';
import cuteChickIcon from '../../assets/cute-chick.png';
import { ThemeToggle } from '@/components/ThemeToggle';

export default async function Home() {
  const batches = await getBatches();
  
  // Only show incubating and hatched batches to customers
  const activeBatches = batches.filter(b => b.status !== 'completed');
  
  const upcoming = activeBatches.filter(b => b.status === 'incubating');
  const ready = activeBatches.filter(b => b.status === 'hatched');

  return (
    <div className="min-h-screen flex flex-col">
      <style>{`
        @keyframes wave-text {
          0%, 20%, 100% { transform: translateY(0); }
          10% { transform: translateY(-8px); }
        }
        .animate-wave {
          display: inline-block;
          animation: wave-text 4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-wave { animation: none; }
        }
      `}</style>
      <section className="relative w-full h-[80vh] min-h-[600px] flex flex-col overflow-hidden">
        <Image
          src={heroImage}
          alt="KukuNoma Chicks Hero"
          fill
          priority
          className="object-cover object-center z-0"
        />
        {/* Gradient overlay for readability and elegant fade to background */}
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-transparent via-black/20 to-background z-10" />
        
        <header className="relative z-20 text-white py-6 px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 drop-shadow-md">
            <Image 
              src={cuteChickIcon} 
              alt="KukuNoma Chick Logo" 
              width={40} 
              height={40} 
              className="object-contain transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(251,146,60,0.8)] hover:-translate-y-1 cursor-pointer" 
            />
            <h1 className="text-2xl font-bold tracking-tight">KukuNoma</h1>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/admin" className="text-sm font-medium hover:underline opacity-90 hover:opacity-100 drop-shadow-md">
              Admin Login
            </Link>
          </nav>
        </header>

        <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 pb-12">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg mb-6" aria-label="Fresh, Healthy Chicks">
            {"Fresh, Healthy Chicks".split("").map((char, index) => (
              <span
                key={index}
                className={char === " " ? "" : "animate-wave"}
                style={char !== " " ? { animationDelay: `${index * 0.05}s` } : {}}
                aria-hidden="true"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-md font-light mb-10">
            Reserve your batch from our locally incubated, premium quality eggs. We track every step of the 21-day journey to ensure the best hatch rates and healthiest chicks.
          </p>
        </div>
      </section>

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-16 -mt-8 relative z-30">

        {ready.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-3xl font-bold border-b pb-2 flex items-center gap-2 text-green-700">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
              Ready for Order!
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {ready.map(batch => (
                <div key={batch.id} className="bg-card text-card-foreground border rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(251,146,60,0.4)] hover:-translate-y-1 cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Batch ID: {batch.id.slice(0, 8)}</p>
                      <h4 className="text-xl font-bold mt-1">Hatched on {format(new Date(batch.ready_date), 'MMM do')}</h4>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Available</span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    We currently have {batch.chicks_hatched} chicks from this batch. The older they get, the more expensive they are. Order now!
                  </p>
                  <Link href={`/order/${batch.id}`} className="block text-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-colors">
                    Place Order
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <h3 className="text-3xl font-bold border-b pb-2 text-foreground">Incubating Now</h3>
          
          {upcoming.length === 0 ? (
            <div className="text-center p-12 bg-muted rounded-2xl border border-dashed">
              <Image 
                src={cuteChickIcon} 
                alt="No batches incubating" 
                width={48} 
                height={48} 
                className="mx-auto mb-4 opacity-50 grayscale"
              />
              <p className="text-lg text-muted-foreground">No batches currently incubating. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {upcoming.map(batch => (
                <div key={batch.id} className="bg-card text-card-foreground border rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(251,146,60,0.4)] hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <Image 
                          src={cuteChickIcon} 
                          alt="Incubating Batch Icon" 
                          width={24} 
                          height={24} 
                          className="object-contain transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(251,146,60,0.8)] hover:-translate-y-1 cursor-pointer"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Batch {batch.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">Started: {format(new Date(batch.start_date), 'MMM do, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-xl flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Estimated Ready:</span>
                    <Countdown targetDate={batch.ready_date} />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    <Info className="h-3 w-3 inline mr-1" />
                    Target: {format(new Date(batch.ready_date), 'MMMM do, yyyy')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-muted py-8 text-center text-muted-foreground mt-12 border-t">
        <p>© {new Date().getFullYear()} KukuNoma. All rights reserved.</p>
      </footer>
    </div>
  );
}
