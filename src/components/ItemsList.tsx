import React from 'react';
import { Plus, Trash2, Package, Sparkles } from 'lucide-react';
import { InvoiceItem } from '../types';
import { formatRupiah, formatNumberOnly } from '../utils/formatters';

interface ItemsListProps {
  items: InvoiceItem[];
  downPayment: number;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, updates: Partial<InvoiceItem>) => void;
  onUpdateDP: (amount: number) => void;
}

const COMMON_PRESETS = [
  { name: 'Tenda VIP Plafon Serut + Karpet (10 x 15 m)', price: 4500000 },
  { name: 'Pelaminan Modern Rustic 8 Meter + Mini Garden', price: 7500000 },
  { name: 'Kursi Futura + Cover & Pita', price: 15000 },
  { name: 'Sound System 5000W + Singer & Organ Tunggal', price: 3500000 },
  { name: 'Panggung & Rigging Utama (6 x 8 m)', price: 2000000 },
  { name: 'Make Up & Busana Pengantin (Akad + Resepsi)', price: 5000000 },
  { name: 'Peralatan Prasmanan Rolltop Komplit (5 Set)', price: 750000 },
  { name: 'Dokumentasi Foto & Video Cinematic (Album + Flashdisk)', price: 3000000 },
  { name: 'Lighting Stage & Follow Spot', price: 1500000 },
  { name: 'Genset Silent 40 KVA + BBM', price: 2200000 },
];

export const ItemsList: React.FC<ItemsListProps> = ({
  items,
  downPayment,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onUpdateDP,
}) => {
  const totalGross = items.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0);
  const remaining = totalGross - downPayment;

  const handleApplyPreset = (preset: { name: string; price: number }) => {
    // Check if the last item is empty, if so fill it; otherwise add new
    const lastItem = items[items.length - 1];
    if (lastItem && !lastItem.name && lastItem.price === 0) {
      onUpdateItem(items.length - 1, {
        name: preset.name,
        quantity: 1,
        price: preset.price,
      });
    } else {
      onAddItem();
      setTimeout(() => {
        onUpdateItem(items.length, {
          name: preset.name,
          quantity: 1,
          price: preset.price,
        });
      }, 0);
    }
  };

  const handleQuickDPPercentage = (pct: number) => {
    const calculatedDP = Math.round((totalGross * pct) / 100);
    onUpdateDP(calculatedDP);
  };

  return (
    <div id="items-list-card" className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#8B0000]" />
          <h3 className="text-xs font-bold tracking-wider text-[#8B0000] uppercase">
            Item Barang / Jasa Sewa
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {items.length} Baris
        </span>
      </div>

      {/* Quick Presets Picker */}
      <div className="mb-4">
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1.5">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Preset Cepat (Klik untuk tambah):</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {COMMON_PRESETS.slice(0, 5).map((preset, idx) => (
            <button
              id={`preset-btn-${idx}`}
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-[11px] whitespace-nowrap bg-slate-50 hover:bg-red-50 hover:text-[#8B0000] hover:border-red-200 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition shrink-0"
            >
              + {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Item Rows */}
      <div className="space-y-3 mb-4">
        {items.map((item, index) => {
          const rowTotal = (item.quantity || 0) * (item.price || 0);

          return (
            <div
              key={item.id || index}
              id={`item-row-${index}`}
              className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-lg transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white text-[11px] font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    Item #{index + 1}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800">
                    Subtotal: <span className="text-[#8B0000]">{formatRupiah(rowTotal)}</span>
                  </span>
                  {items.length > 1 && (
                    <button
                      id={`delete-item-${index}-btn`}
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Hapus baris"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <input
                  id={`item-name-${index}-input`}
                  type="text"
                  value={item.name}
                  onChange={(e) => onUpdateItem(index, { name: e.target.value })}
                  placeholder="Nama Barang / Jasa (misal: Pelaminan 8m, Tenda VIP)"
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] outline-none"
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-medium mb-0.5">
                      Jumlah (Qty)
                    </label>
                    <input
                      id={`item-qty-${index}-input`}
                      type="number"
                      min="0"
                      value={item.quantity === 0 ? '' : item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onUpdateItem(index, { quantity: isNaN(val) ? 0 : val });
                      }}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#8B0000] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-500 uppercase font-medium mb-0.5">
                      Harga Satuan (Rp)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-medium">
                        Rp
                      </span>
                      <input
                        id={`item-price-${index}-input`}
                        type="number"
                        min="0"
                        value={item.price === 0 ? '' : item.price}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          onUpdateItem(index, { price: isNaN(val) ? 0 : val });
                        }}
                        placeholder="0"
                        className="w-full pl-8 pr-2.5 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#8B0000] outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Row Button */}
      <button
        id="add-item-row-btn"
        type="button"
        onClick={onAddItem}
        className="w-full py-2 px-3 border border-dashed border-[#8B0000] text-[#8B0000] hover:bg-red-50/50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.99] mb-4"
      >
        <Plus className="w-4 h-4" />
        TAMBAH BARIS ITEM
      </button>

      {/* Down Payment (DP) Section */}
      <div className="pt-3 border-t border-slate-200">
        <label htmlFor="down-payment-input" className="block text-xs font-semibold text-slate-700 mb-1">
          Uang Muka / DP (Rp)
        </label>
        <div className="relative mb-2">
          <span className="absolute left-3 top-2 text-sm text-slate-400 font-medium">
            Rp
          </span>
          <input
            id="down-payment-input"
            type="number"
            min="0"
            value={downPayment === 0 ? '' : downPayment}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onUpdateDP(isNaN(val) ? 0 : val);
            }}
            placeholder="0"
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] outline-none font-mono font-medium"
          />
        </div>

        {/* Quick DP % buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-500 font-medium">Quick DP:</span>
          {[10, 20, 30, 50, 100].map((pct) => (
            <button
              id={`quick-dp-${pct}-btn`}
              key={pct}
              type="button"
              onClick={() => handleQuickDPPercentage(pct)}
              className="text-[10px] font-medium bg-slate-100 hover:bg-red-50 hover:text-[#8B0000] text-slate-700 px-2 py-0.5 rounded transition"
            >
              {pct === 100 ? 'Lunas (100%)' : `${pct}%`}
            </button>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="mt-3 p-3 bg-red-50/50 rounded-lg border border-red-100 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-700">
            <span>Total Kotor (Gross):</span>
            <span className="font-semibold text-slate-900">{formatRupiah(totalGross)}</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>Uang Muka (DP):</span>
            <span className="font-semibold text-emerald-700">{formatRupiah(downPayment)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold border-t border-red-200/60 pt-1 text-slate-900">
            <span>Sisa Tagihan:</span>
            <span className={remaining > 0 ? 'text-red-700' : 'text-emerald-700'}>
              {formatRupiah(remaining)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
