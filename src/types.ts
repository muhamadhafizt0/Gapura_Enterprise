export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  id?: string;
  invoiceNumber: string;
  customerName: string;
  address: string;
  eventDate: string;
  downPayment: number;
  items: InvoiceItem[];
  tuanHajatSignature: string | null; // Base64 data URL
  hormatKamiSignature: string | null; // Base64 data URL
  createdAt: string;
  notes?: string;
}

export type ActiveTab = 'create' | 'history';
