import { InvoiceData } from '../types';

const STORAGE_KEY = 'gapura_enterprise_invoices_v4';

export const getInvoicesFromStorage = (): InvoiceData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
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
