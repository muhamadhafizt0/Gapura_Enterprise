import React, { useState, useEffect, useRef } from 'react';
import {
  FilePlus2,
  History,
  RotateCcw,
  Sparkles,
  Printer,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { InvoiceData, InvoiceItem, ActiveTab } from './types';
import { generateInvoiceNumber } from './utils/formatters';
import {
  getInvoicesFromStorage,
  saveInvoiceToStorage,
  deleteInvoiceFromStorage,
  clearAllInvoicesFromStorage,
} from './utils/storage';
import { Header } from './components/Header';
import { CustomerForm } from './components/CustomerForm';
import { ItemsList } from './components/ItemsList';
import { QuickCalculator } from './components/QuickCalculator';
import { SignaturePad } from './components/SignaturePad';
import { InvoicePreview } from './components/InvoicePreview';
import { ActionButtons } from './components/ActionButtons';
import { HistoryPage } from './components/HistoryPage';
import { ToastContainer, ToastMessage } from './components/Toast';

const createEmptyInvoice = (): InvoiceData => ({
  invoiceNumber: generateInvoiceNumber(),
  customerName: '',
  address: '',
  eventDate: '',
  downPayment: 0,
  items: [
    {
      id: '1',
      name: '',
      quantity: 1,
      price: 0,
    },
  ],
  tuanHajatSignature: null,
  hormatKamiSignature: null,
  createdAt: new Date().toISOString(),
});

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('create');
  const [invoice, setInvoice] = useState<InvoiceData>(createEmptyInvoice());
  const [historyList, setHistoryList] = useState<InvoiceData[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Load history from storage on mount
  useEffect(() => {
    const saved = getInvoicesFromStorage();
    setHistoryList(saved);
  }, []);

  const showToast = (
    message: string,
    type: 'success' | 'info' | 'error' = 'info'
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Customer details
  const handleCustomerChange = (fields: {
    customerName?: string;
    address?: string;
    eventDate?: string;
  }) => {
    setInvoice((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  // Items manipulation
  const handleAddItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `${Date.now()}-${Math.random()}`,
          name: '',
          quantity: 1,
          price: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (invoice.items.length <= 1) return;
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateItem = (index: number, updates: Partial<InvoiceItem>) => {
    setInvoice((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], ...updates };
      return { ...prev, items: updated };
    });
  };

  const handleUpdateDP = (amount: number) => {
    setInvoice((prev) => ({ ...prev, downPayment: amount }));
  };

  // Signatures
  const handleSaveTuanHajatSignature = (dataUrl: string | null) => {
    setInvoice((prev) => ({ ...prev, tuanHajatSignature: dataUrl }));
  };

  const handleSaveHormatKamiSignature = (dataUrl: string | null) => {
    setInvoice((prev) => ({ ...prev, hormatKamiSignature: dataUrl }));
  };

  // Clear Form
  const handleClearForm = () => {
    if (
      invoice.customerName ||
      invoice.items.some((i) => i.name) ||
      invoice.downPayment > 0
    ) {
      if (!window.confirm('Bersihkan form dan buat nota baru?')) {
        return;
      }
    }
    setInvoice(createEmptyInvoice());
    showToast('Form telah direset untuk nota baru.', 'info');
  };

  // Save to DB
  const handleSaveToDB = () => {
    const updated = saveInvoiceToStorage(invoice);
    setHistoryList(updated);
  };

  // Load from History into Editor
  const handleLoadInvoice = (selectedInvoice: InvoiceData) => {
    setInvoice({
      ...selectedInvoice,
    });
    setActiveTab('create');
    showToast(`Nota ${selectedInvoice.customerName || selectedInvoice.invoiceNumber} dimuat ke Editor.`, 'success');
  };

  // Delete from History
  const handleDeleteInvoice = (id: string) => {
    const updated = deleteInvoiceFromStorage(id);
    setHistoryList(updated);
  };

  // Delete all from History
  const handleClearAllInvoices = () => {
    const updated = clearAllInvoicesFromStorage();
    setHistoryList(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReset={handleClearForm}
        historyCount={historyList.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 mb-16 md:mb-6">
        {activeTab === 'history' ? (
          <HistoryPage
            invoices={historyList}
            onLoadInvoice={handleLoadInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onClearAllInvoices={handleClearAllInvoices}
            onShowToast={showToast}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form & Inputs */}
            <div className="lg:col-span-6 space-y-4">
              {/* Section 1: Customer Info */}
              <CustomerForm
                customerName={invoice.customerName}
                address={invoice.address}
                eventDate={invoice.eventDate}
                onChange={handleCustomerChange}
              />

              {/* Section 2: Items & DP */}
              <ItemsList
                items={invoice.items}
                downPayment={invoice.downPayment}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onUpdateItem={handleUpdateItem}
                onUpdateDP={handleUpdateDP}
              />

              {/* Section 3: Quick Calculator */}
              <QuickCalculator
                onApplyToDP={handleUpdateDP}
              />

              {/* Section 4: Dual Signatures */}
              <div id="signatures-section" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold tracking-wider text-[#8B0000] uppercase">
                    Tanda Tangan Digital
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Otomatis masuk ke cetakan
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SignaturePad
                    label="Tanda Tangan Tuan Hajat"
                    signatureData={invoice.tuanHajatSignature}
                    onSave={handleSaveTuanHajatSignature}
                    idPrefix="sig-tuan-hajat"
                  />

                  <SignaturePad
                    label="Tanda Tangan Hormat Kami"
                    signatureData={invoice.hormatKamiSignature}
                    onSave={handleSaveHormatKamiSignature}
                    idPrefix="sig-hormat-kami"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Live Invoice Preview & Actions */}
            <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-20">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-700 uppercase">
                    <Eye className="w-4 h-4 text-[#8B0000]" />
                    <span>PREVIEW NOTA CETAK</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    {invoice.invoiceNumber}
                  </span>
                </div>

                {/* Printable Paper Container */}
                <div className="overflow-x-auto bg-slate-100/70 p-2 sm:p-4 rounded-lg border border-slate-200/80">
                  <InvoicePreview ref={previewRef} invoice={invoice} />
                </div>

                {/* Action Buttons */}
                <div className="mt-4">
                  <ActionButtons
                    invoice={invoice}
                    previewRef={previewRef}
                    onSaveToDB={handleSaveToDB}
                    onClearForm={handleClearForm}
                    onShowToast={showToast}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Flutter-style Bottom Navigation Bar (Mobile) */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-1.5 px-6 flex justify-around items-center z-40 shadow-lg"
      >
        <button
          id="tab-btn-create-mobile"
          type="button"
          onClick={() => setActiveTab('create')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition ${
            activeTab === 'create'
              ? 'text-[#8B0000] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FilePlus2 className="w-5 h-5" />
          <span className="text-[11px]">Buat Nota</span>
        </button>

        <button
          id="tab-btn-history-mobile"
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition ${
            activeTab === 'history'
              ? 'text-[#8B0000] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[11px]">Riwayat ({historyList.length})</span>
        </button>
      </nav>

      {/* Notification Toast Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
