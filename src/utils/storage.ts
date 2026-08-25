import { InvoiceData } from '../types';

const STORAGE_KEY = 'gapura_enterprise_invoices_v3';

const INITIAL_DEMO_DATA: InvoiceData[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'GE-260820-1082',
    customerName: 'Bpk. H. Hendra Gunawan & Ibu Rina',
    address: 'Jl. Ahmad Yani No. 45, Cigugur, Kuningan',
    eventDate: '28-08-2026',
    downPayment: 5000000,
    items: [
      {
        id: '1',
        name: 'Paket Dekorasi Pelaminan Rustic Mewah 10 Meter',
        quantity: 1,
        price: 8500000,
      },
      {
        id: '2',
        name: 'Tenda VIP Plafon Serut + Karpet Merah (10 x 15 m)',
        quantity: 1,
        price: 4500000,
      },
      {
        id: '3',
        name: 'Kursi Futura + Cover & Pita Gold',
        quantity: 150,
        price: 15000,
      },
      {
        id: '4',
        name: 'Sound System 5000 Watt + Organ Tunggal + Singer',
        quantity: 1,
        price: 3500000,
      },
      {
        id: '5',
        name: 'Lighting Stage & Panggung Pengantin Modern',
        quantity: 1,
        price: 1800000,
      },
    ],
    tuanHajatSignature: null,
    hormatKamiSignature: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'inv-2',
    invoiceNumber: 'GE-260815-7721',
    customerName: 'Ibu Siti Aminah (Khitanan Ananda Fathir)',
    address: 'Perum Korpri Blok B No. 12, Cigintung, Kuningan',
    eventDate: '05-09-2026',
    downPayment: 3000000,
    items: [
      {
        id: '1',
        name: 'Tenda Semi Dekorasi + Lampu Hias (6 x 10 m)',
        quantity: 1,
        price: 2500000,
      },
      {
        id: '2',
        name: 'Pelaminan Khitan Mini Garden & Balon',
        quantity: 1,
        price: 2000000,
      },
      {
        id: '3',
        name: 'Peralatan Prasmanan Rolltop Komplit (5 Set)',
        quantity: 5,
        price: 150000,
      },
      {
        id: '4',
        name: 'Piring, Sendok, Garpu + Meja Makan VIP',
        quantity: 100,
        price: 5000,
      },
    ],
    tuanHajatSignature: null,
    hormatKamiSignature: null,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const getInvoicesFromStorage = (): InvoiceData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
      return INITIAL_DEMO_DATA;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return INITIAL_DEMO_DATA;
  }
};

export const saveInvoiceToStorage = (invoice: InvoiceData): InvoiceData[] => {
  try {
    const existing = getInvoicesFromStorage();
    const invoiceToSave = {
      ...invoice,
      id: invoice.id || `inv-${Date.now()}`,
      createdAt: invoice.createdAt || new Date().toISOString(),
    };

    const existingIndex = existing.findIndex((item) => item.id === invoiceToSave.id);
    let updated: InvoiceData[];

    if (existingIndex >= 0) {
      updated = [...existing];
      updated[existingIndex] = invoiceToSave;
    } else {
      updated = [invoiceToSave, ...existing];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return [];
  }
};

export const deleteInvoiceFromStorage = (idOrNumber: string): InvoiceData[] => {
  try {
    const existing = getInvoicesFromStorage();
    const filtered = existing.filter(
      (item) => item.id !== idOrNumber && item.invoiceNumber !== idOrNumber
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    return [];
  }
};

export const clearAllInvoicesFromStorage = (): InvoiceData[] => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch (error) {
    console.error('Error clearing all invoices from localStorage:', error);
    return [];
  }
};
