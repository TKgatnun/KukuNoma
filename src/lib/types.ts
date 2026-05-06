export type BatchStatus = 'incubating' | 'hatched' | 'completed';

export interface Batch {
  id: string;
  start_date: string; // ISO string
  ready_date: string; // ISO string, start_date + 21 days
  eggs_incubated: number;
  chicks_hatched: number | null;
  status: BatchStatus;
}

export interface Sale {
  id: string;
  batch_id: string;
  quantity: number;
  age_at_sale_days: number;
  price_per_chick: number;
  sale_date: string; // ISO string
}

export interface AppData {
  batches: Batch[];
  sales: Sale[];
}
