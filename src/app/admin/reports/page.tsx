import { getBatches, getSales } from '@/lib/db';
import { SuccessRateChart, SalesRevenueChart } from '@/components/Charts';
import { format } from 'date-fns';

export default async function ReportsPage() {
  const batches = await getBatches();
  const sales = await getSales();

  // Process data for Success Rate Chart (only hatched/completed batches)
  const finishedBatches = batches.filter(b => b.chicks_hatched !== null).reverse();
  const successRateData = finishedBatches.map(b => ({
    date: format(new Date(b.ready_date), 'MMM d'),
    successRate: Math.round(((b.chicks_hatched || 0) / b.eggs_incubated) * 100),
    batchId: b.id.slice(0, 8)
  }));

  // Process data for Sales Revenue Chart by date
  const salesMap = new Map<string, number>();
  sales.forEach(sale => {
    const dateStr = format(new Date(sale.sale_date), 'MMM d');
    const revenue = sale.quantity * sale.price_per_chick;
    salesMap.set(dateStr, (salesMap.get(dateStr) || 0) + revenue);
  });
  
  const salesRevenueData = Array.from(salesMap.entries())
    .map(([date, revenue]) => ({ date, revenue }))
    .reverse();

  // Summary Stats
  const totalRevenue = sales.reduce((acc, curr) => acc + (curr.quantity * curr.price_per_chick), 0);
  const totalChicksSold = sales.reduce((acc, curr) => acc + curr.quantity, 0);
  
  const avgSuccessRate = successRateData.length > 0 
    ? Math.round(successRateData.reduce((acc, curr) => acc + curr.successRate, 0) / successRateData.length)
    : 0;

  return (
    <div className="space-y-8 pb-20">
      <header className="border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight">Extensive Reports</h1>
        <p className="text-muted-foreground mt-2 text-lg">Analyze business performance and hatch success.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl shadow-sm border">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-sm border">
          <p className="text-sm font-medium text-muted-foreground mb-1">Chicks Sold</p>
          <p className="text-3xl font-bold">{totalChicksSold}</p>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-sm border">
          <p className="text-sm font-medium text-muted-foreground mb-1">Avg Success Rate</p>
          <p className="text-3xl font-bold text-green-600">{avgSuccessRate}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-2xl shadow-sm border">
          <h3 className="text-xl font-bold mb-6">Hatch Success Rate Over Time</h3>
          {successRateData.length > 0 ? (
            <SuccessRateChart data={successRateData} />
          ) : (
            <div className="h-[400px] flex items-center justify-center bg-muted rounded-xl">
              <p className="text-muted-foreground">Not enough data to display.</p>
            </div>
          )}
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-sm border">
          <h3 className="text-xl font-bold mb-6">Sales Revenue</h3>
          {salesRevenueData.length > 0 ? (
            <SalesRevenueChart data={salesRevenueData} />
          ) : (
            <div className="h-[400px] flex items-center justify-center bg-muted rounded-xl">
              <p className="text-muted-foreground">No sales data available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
