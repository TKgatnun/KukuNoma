import fs from 'fs/promises';
import path from 'path';
import { AppData, Batch, Sale } from './types';

const DATA_FILE = path.join(process.cwd(), 'data.json');

const defaultData: AppData = {
  batches: [
    {
      id: 'mock-batch-1',
      start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      ready_date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days from now
      eggs_incubated: 200,
      chicks_hatched: null,
      status: 'incubating',
    },
    {
      id: 'mock-batch-2',
      start_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
      ready_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      eggs_incubated: 150,
      chicks_hatched: 135,
      status: 'hatched',
    }
  ],
  sales: [
    {
      id: 'mock-sale-1',
      batch_id: 'mock-batch-2',
      quantity: 50,
      age_at_sale_days: 1,
      price_per_chick: 2.5,
      sale_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ]
};

async function ensureDataFile(): Promise<AppData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data) as AppData;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    throw error;
  }
}

async function saveData(data: AppData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getBatches(): Promise<Batch[]> {
  const data = await ensureDataFile();
  return data.batches.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
}

export async function getBatch(id: string): Promise<Batch | undefined> {
  const data = await ensureDataFile();
  return data.batches.find(b => b.id === id);
}

export async function addBatch(batch: Omit<Batch, 'id' | 'ready_date' | 'status' | 'chicks_hatched'>): Promise<Batch> {
  const data = await ensureDataFile();
  const start = new Date(batch.start_date);
  const ready = new Date(start.getTime() + 21 * 24 * 60 * 60 * 1000);
  
  const newBatch: Batch = {
    id: crypto.randomUUID(),
    start_date: batch.start_date,
    ready_date: ready.toISOString(),
    eggs_incubated: batch.eggs_incubated,
    chicks_hatched: null,
    status: 'incubating'
  };

  data.batches.push(newBatch);
  await saveData(data);
  return newBatch;
}

export async function updateBatchHatch(id: string, chicks_hatched: number): Promise<void> {
  const data = await ensureDataFile();
  const index = data.batches.findIndex(b => b.id === id);
  if (index !== -1) {
    data.batches[index].chicks_hatched = chicks_hatched;
    data.batches[index].status = 'hatched';
    await saveData(data);
  }
}

export async function completeBatch(id: string): Promise<void> {
  const data = await ensureDataFile();
  const index = data.batches.findIndex(b => b.id === id);
  if (index !== -1) {
    data.batches[index].status = 'completed';
    await saveData(data);
  }
}

export async function getSales(): Promise<Sale[]> {
  const data = await ensureDataFile();
  return data.sales.sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime());
}

export async function addSale(sale: Omit<Sale, 'id' | 'sale_date'>): Promise<Sale> {
  const data = await ensureDataFile();
  const newSale: Sale = {
    ...sale,
    id: crypto.randomUUID(),
    sale_date: new Date().toISOString()
  };
  data.sales.push(newSale);
  await saveData(data);
  return newSale;
}
