'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import cuteChickIcon from '../../../../assets/cute-chick.png';
import bgImage from '../../../../assets/44a9bb3e308feeacaa4410602eac3391.jpg';

export default function PlaceOrder() {
  const params = useParams();
  // Safely grab the ID from the URL (defaults to empty string if loading)
  const batchId = (params.id as string) || '';

  // State for sliders and toggles
  const [quantity, setQuantity] = useState(1);
  const [ageWeeks, setAgeWeeks] = useState(0);
  const [isDelivery, setIsDelivery] = useState(false);

  // --- PRICING LOGIC ---
  // Set your pricing here. Everything is calculated automatically.
  const DELIVERY_FEE = 100.00; // Flat fee for delivery

  const getUnitPrice = (weeks: number) => {
    if (weeks === 0) return 110; // 1 day old
    if (weeks <= 8) return 110 + weeks * 17.5; // Up to 2 months (250 Ksh)
    if (weeks <= 12) return 250 + (weeks - 8) * 25; // Up to 3 months (350 Ksh)
    return 350 + (weeks - 12) * 25; // Beyond 3 months
  };

  const unitPrice = getUnitPrice(ageWeeks);
  const subtotal = quantity * unitPrice;
  const totalPrice = subtotal + (isDelivery ? DELIVERY_FEE : 0);

  // Your WhatsApp Number (Include country code, no + or dashes. e.g., 1234567890)
  const WHATSAPP_NUMBER = "0720170943"; 
  
  const whatsappMessage = encodeURIComponent(
    `Hello KukuNoma! I would like to place an order:\n\n` +
    `Batch ID: ${batchId.slice(0, 8)}\n` +
    `Quantity: ${quantity} ${quantity === 1 ? 'chick' : 'chicks'}\n` +
    `Age: ${ageWeeks} weeks old\n` +
    `Method: ${isDelivery ? 'Delivery' : 'Pickup'}\n` +
    `Total Price: Ksh ${totalPrice.toFixed(2)}\n\n` +
    `Please let me know how to proceed with payment and ${isDelivery ? 'delivery' : 'pickup'} details!`
  );

  return (
    <div className="relative min-h-screen p-4 md:p-8 flex items-center justify-center overflow-hidden">
      {/* Full-screen Background Image */}
      <Image
        src={bgImage}
        alt="Order Page Background"
        fill
        priority
        className="object-cover object-center z-0"
      />

      <div className="relative z-20 bg-card text-card-foreground max-w-lg w-full p-6 md:p-10 rounded-3xl shadow-2xl border">
        
        <div className="text-center mb-8">
          <Image src={cuteChickIcon} alt="Cute Chick" width={56} height={56} className="mx-auto mb-4 drop-shadow-md" />
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Place Your Order</h1>
          <p className="text-muted-foreground text-sm">Configure your chicks below. Price updates automatically.</p>
          <div className="mt-4 inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-primary/20">
            Batch: {batchId.slice(0, 8)}
          </div>
        </div>

        <div className="space-y-8">
          {/* Quantity Slider */}
          <div className="bg-muted p-5 rounded-2xl border">
            <div className="flex justify-between items-center mb-4">
              <label className="font-semibold text-sm uppercase tracking-wide">Quantity</label>
              <span className="text-xl font-bold text-primary">{quantity} {quantity === 1 ? 'Chick' : 'Chicks'}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
              <span>1</span>
              <span>Limit: 20</span>
            </div>
          </div>

          {/* Age Slider */}
          <div className="bg-muted p-5 rounded-2xl border">
            <div className="flex justify-between items-center mb-4">
              <label className="font-semibold text-sm uppercase tracking-wide">Age Request</label>
              <span className="text-xl font-bold text-primary">{ageWeeks} Weeks</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="24" 
              value={ageWeeks} 
              onChange={(e) => setAgeWeeks(Number(e.target.value))}
              className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
              <span>0 (Fresh)</span>
              <span>24 Weeks</span>
            </div>
          </div>

          {/* Delivery / Pickup Toggle */}
          <div className="bg-muted p-5 rounded-2xl border">
            <label className="font-semibold text-sm uppercase tracking-wide block mb-4">Fulfillment Method</label>
            <div className="flex bg-card p-1 rounded-xl border">
              <button onClick={() => setIsDelivery(false)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isDelivery ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                Pickup (Free)
              </button>
              <button onClick={() => setIsDelivery(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isDelivery ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                Delivery (+100)
              </button>
            </div>
          </div>

          {/* Price Calculation Summary */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-sm mb-2 text-muted-foreground">
              <span>Price per chick:</span>
              <span>Ksh {unitPrice.toFixed(2)}</span>
            </div>
            {isDelivery && (
              <div className="flex justify-between items-center text-sm mb-2 text-muted-foreground">
                <span>Delivery fee:</span>
                <span>Ksh {DELIVERY_FEE.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-end">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-4xl font-black text-green-600 dark:text-green-500">Ksh{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 space-y-3">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg">
              Confirm & Send via WhatsApp
            </a>
            <Link href="/" className="block text-center w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Cancel & Go Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}