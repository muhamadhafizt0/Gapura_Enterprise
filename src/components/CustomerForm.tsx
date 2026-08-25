import React from 'react';
import { User, MapPin, Calendar } from 'lucide-react';

interface CustomerFormProps {
  customerName: string;
  address: string;
  eventDate: string;
  onChange: (fields: { customerName?: string; address?: string; eventDate?: string }) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customerName,
  address,
  eventDate,
  onChange,
}) => {
  // Convert standard date string to YYYY-MM-DD for native date picker fallback
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value; // YYYY-MM-DD
    if (rawVal) {
      const parts = rawVal.split('-');
      if (parts.length === 3) {
        // Convert to DD-MM-YYYY
        onChange({ eventDate: `${parts[2]}-${parts[1]}-${parts[0]}` });
        return;
      }
    }
    onChange({ eventDate: rawVal });
  };

  return (
    <div id="customer-form-card" className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
        <User className="w-4 h-4 text-[#8B0000]" />
        <h3 className="text-xs font-bold tracking-wider text-[#8B0000] uppercase">
          Data Pelanggan / Tuan Hajat
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="customer-name-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Pelanggan / Tuan Hajat <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="customer-name-input"
              type="text"
              value={customerName}
              onChange={(e) => onChange({ customerName: e.target.value })}
              placeholder="Contoh: Bpk. H. Hendra / Ibu Rina"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] outline-none transition"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label htmlFor="address-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Alamat Acara / Lokasi
          </label>
          <div className="relative">
            <input
              id="address-input"
              type="text"
              value={address}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="Contoh: Jl. Ahmad Yani No. 45, Cigugur, Kuningan"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] outline-none transition"
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label htmlFor="event-date-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Tanggal Acara (DD-MM-YYYY)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="relative">
              <input
                id="event-date-input"
                type="text"
                value={eventDate}
                onChange={(e) => onChange({ eventDate: e.target.value })}
                placeholder="28-08-2026"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] outline-none transition"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5">
              <input
                id="event-date-picker"
                type="date"
                onChange={handleDateChange}
                className="w-full py-1.5 px-2 text-xs border border-slate-200 rounded-lg text-slate-600 bg-slate-50 hover:bg-white transition cursor-pointer"
                title="Pilih tanggal dari kalender"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
