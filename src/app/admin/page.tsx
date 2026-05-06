import { getBatches } from '@/lib/db';
import { createBatchAction, recordHatchAction, recordSaleAction, markBatchCompleteAction } from '@/app/actions';
import { format } from 'date-fns';
import { Plus, CheckCircle, PackageSearch } from 'lucide-react';

export default async function AdminDashboard() {
  const batches = await getBatches();
  
  const incubating = batches.filter(b => b.status === 'incubating');
  const hatched = batches.filter(b => b.status === 'hatched');

  return (
    <div className="space-y-10 pb-20">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage batches, tracking, and sales.</p>
        </div>
      </header>

      {/* Create Batch Section */}
      <section className="bg-card p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Plus className="h-6 w-6 text-primary" /> Start New Batch
        </h2>
        <form action={createBatchAction} className="grid sm:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Incubation Start Date</label>
            <input 
              type="date" 
              name="start_date" 
              required 
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Eggs Incubated</label>
            <input 
              type="number" 
              name="eggs_incubated" 
              required 
              min="1"
              placeholder="e.g. 500"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-colors">
            Start Incubating
          </button>
        </form>
      </section>

      {/* Incubating Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Currently Incubating</h2>
        {incubating.length === 0 ? (
          <p className="text-muted-foreground italic bg-muted p-6 rounded-xl text-center">No batches currently incubating.</p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {incubating.map(batch => (
              <div key={batch.id} className="bg-card p-6 rounded-2xl border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Batch ID: {batch.id.slice(0,8)}</p>
                    <p className="font-bold text-lg mt-1">Started: {format(new Date(batch.start_date), 'MMM do, yyyy')}</p>
                    <p className="text-sm mt-1">Eggs: <span className="font-semibold">{batch.eggs_incubated}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground font-medium">Target Ready Date</p>
                    <p className="font-bold text-orange-600 mt-1">{format(new Date(batch.ready_date), 'MMM do')}</p>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <form action={recordHatchAction} className="flex gap-4 items-end">
                  <input type="hidden" name="batch_id" value={batch.id} />
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Chicks Hatched</label>
                    <input 
                      type="number" 
                      name="chicks_hatched" 
                      required 
                      min="0"
                      max={batch.eggs_incubated}
                      placeholder="Amount"
                      className="w-full border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button type="submit" className="bg-orange-100 text-orange-700 hover:bg-orange-200 font-semibold py-2 px-4 rounded-xl text-sm transition-colors border border-orange-200">
                    Record Hatch
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Hatched / Sales Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-green-700">Ready & Selling</h2>
        {hatched.length === 0 ? (
           <p className="text-muted-foreground italic bg-muted p-6 rounded-xl text-center">No batches are currently ready for sale.</p>
        ) : (
          <div className="grid xl:grid-cols-2 gap-6">
            {hatched.map(batch => (
              <div key={batch.id} className="bg-card p-6 rounded-2xl border shadow-sm border-green-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-xl text-green-800">Batch {batch.id.slice(0,8)}</h3>
                    <p className="text-sm text-muted-foreground">Hatched: {format(new Date(batch.ready_date), 'MMM do, yyyy')}</p>
                  </div>
                  <div className="text-right bg-green-50 px-3 py-2 rounded-xl border border-green-100">
                    <p className="text-xs text-green-700 font-semibold uppercase tracking-wide">Success Rate</p>
                    <p className="font-bold text-lg text-green-800">
                      {Math.round(((batch.chicks_hatched || 0) / batch.eggs_incubated) * 100)}%
                    </p>
                  </div>
                </div>

                {/* Sales Form */}
                <div className="bg-muted p-5 rounded-xl">
                  <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <PackageSearch className="h-4 w-4" /> Record a Sale
                  </h4>
                  <form action={recordSaleAction} className="space-y-4">
                    <input type="hidden" name="batch_id" value={batch.id} />
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1">Quantity</label>
                        <input type="number" name="quantity" required min="1" className="w-full border rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Age (Days)</label>
                        <input type="number" name="age_at_sale_days" required min="1" className="w-full border rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Price/Chick</label>
                        <input type="number" name="price_per_chick" step="0.01" required className="w-full border rounded-lg px-3 py-2 text-sm" />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors">
                      Log Sale
                    </button>
                  </form>
                </div>

                <div className="mt-6 text-right">
                  <form action={markBatchCompleteAction}>
                    <input type="hidden" name="batch_id" value={batch.id} />
                    <button type="submit" className="flex items-center justify-end gap-2 ml-auto text-sm text-muted-foreground hover:text-foreground font-medium">
                      <CheckCircle className="h-4 w-4" /> Mark Batch as Sold Out
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
