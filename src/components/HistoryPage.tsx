import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Trash2,
  Edit3,
  DollarSign,
  TrendingUp,
  Receipt,
  X,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import { InvoiceData } from '../types';
import { formatRupiah } from '../utils/formatters';

interface HistoryPageProps {
  invoices: InvoiceData[];
  onLoadInvoice: (invoice: InvoiceData) => void;
  onDeleteInvoice: (id: string) => void;
  onClearAllInvoices?: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const INDONESIAN_MONTHS = [
  'januari',
  'februari',
  'maret',
  'april',
  'mei',
  'juni',
  'juli',
  'agustus',
  'september',
  'oktober',
  'november',
  'desember',
];

// Helper to extract date keywords and formats for flexible search
const getDateSearchStrings = (dateStr?: string): string[] => {
  if (!dateStr) return [];
  const results: string[] = [dateStr.toLowerCase()];

  // If date format is DD-MM-YYYY or DD/MM/YYYY or YYYY-MM-DD
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    let day = '';
    let monthNum = 0;
    let year = '';

    if (parts[0].length === 4) {
      // YYYY-MM-DD
      year = parts[0];
      monthNum = parseInt(parts[1], 10);
      day = parts[2];
    } else {
      // DD-MM-YYYY
      day = parts[0];
      monthNum = parseInt(parts[1], 10);
      year = parts[2];
    }

    if (monthNum >= 1 && monthNum <= 12) {
      const monthName = INDONESIAN_MONTHS[monthNum - 1];
      results.push(monthName);
      results.push(`${day} ${monthName} ${year}`.toLowerCase());
      results.push(`${monthName} ${year}`.toLowerCase());
      results.push(`${day}/${monthNum}/${year}`);
      results.push(`${day}-${monthNum}-${year}`);
      results.push(
        `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      );
    }
  }

  return results;
};

export const HistoryPage: React.FC<HistoryPageProps> = ({
  invoices,
  onLoadInvoice,
  onDeleteInvoice,
  onClearAllInvoices,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState(''); // YYYY-MM-DD from datepicker
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unpaid' | 'paid'>('all');
  
  // Custom delete confirmation modal state
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  // Financial statistics
  const stats = useMemo(() => {
    let totalGross = 0;
    let totalDP = 0;
    let totalSisa = 0;
    let paidCount = 0;

    invoices.forEach((inv) => {
      const invGross = inv.items.reduce(
        (sum, item) => sum + (item.quantity * item.price || 0),
        0
      );
      const dp = inv.downPayment || 0;
      const sisa = Math.max(0, invGross - dp);

      totalGross += invGross;
      totalDP += dp;
      totalSisa += sisa;
      if (sisa <= 0 && invGross > 0) {
        paidCount++;
      }
    });

    return {
      count: invoices.length,
      totalGross,
      totalDP,
      totalSisa,
      paidCount,
    };
  }, [invoices]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const query = searchQuery.toLowerCase().trim();

      // 1. Text Search across name, address, number, and dates
      let matchQuery = true;
      if (query) {
        const eventDateKeywords = getDateSearchStrings(inv.eventDate);
        let createdDateKeywords: string[] = [];
        if (inv.createdAt) {
          try {
            const d = new Date(inv.createdAt);
            const dDay = String(d.getDate()).padStart(2, '0');
            const dMonth = String(d.getMonth() + 1).padStart(2, '0');
            const dYear = d.getFullYear();
            createdDateKeywords = getDateSearchStrings(`${dDay}-${dMonth}-${dYear}`);
          } catch {
            // ignore
          }
        }

        const matchName = inv.customerName?.toLowerCase().includes(query);
        const matchAddress = inv.address?.toLowerCase().includes(query);
        const matchNumber = inv.invoiceNumber?.toLowerCase().includes(query);
        const matchEventDate = eventDateKeywords.some((k) => k.includes(query));
        const matchCreatedDate = createdDateKeywords.some((k) => k.includes(query));

        matchQuery = !!(
          matchName ||
          matchAddress ||
          matchNumber ||
          matchEventDate ||
          matchCreatedDate
        );
      }

      // 2. Specific Date Picker Filter (matching event date or created date)
      let matchDateFilter = true;
      if (filterDate) {
        // filterDate format is YYYY-MM-DD
        const [fY, fM, fD] = filterDate.split('-');
        const formattedTarget1 = `${fD}-${fM}-${fY}`; // DD-MM-YYYY
        const formattedTarget2 = `${parseInt(fD, 10)}-${parseInt(fM, 10)}-${fY}`;
        const formattedTargetISO = filterDate;

        const eventDateMatches =
          inv.eventDate?.includes(formattedTarget1) ||
          inv.eventDate?.includes(formattedTarget2) ||
          inv.eventDate?.includes(formattedTargetISO);

        let createdDateMatches = false;
        if (inv.createdAt) {
          createdDateMatches = inv.createdAt.startsWith(filterDate);
        }

        matchDateFilter = !!(eventDateMatches || createdDateMatches);
      }

      // 3. Status filter
      const invGross = inv.items.reduce(
        (sum, item) => sum + (item.quantity * item.price || 0),
        0
      );
      const isPaid = invGross - (inv.downPayment || 0) <= 0;
      let matchStatus = true;
      if (selectedStatus === 'paid') matchStatus = isPaid;
      if (selectedStatus === 'unpaid') matchStatus = !isPaid;

      return matchQuery && matchDateFilter && matchStatus;
    });
  }, [invoices, searchQuery, filterDate, selectedStatus]);

  // Trigger modal confirmation
  const handleOpenDelete = (id: string, name: string) => {
    setItemToDelete({ id, name });
  };

  // Confirm delete action
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const targetId = itemToDelete.id;
    const targetName = itemToDelete.name;
    
    setItemToDelete(null);
    onDeleteInvoice(targetId);
    onShowToast(`Nota atas nama "${targetName || 'Pelanggan'}" telah berhasil dihapus.`, 'info');
  };

  // Confirm delete all action
  const handleConfirmDeleteAll = () => {
    setShowDeleteAllModal(false);
    if (onClearAllInvoices) {
      onClearAllInvoices();
      onShowToast('Semua riwayat data nota telah berhasil dihapus.', 'info');
    }
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setFilterDate('');
    setSelectedStatus('all');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Delete Single Item Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            id="delete-confirm-modal"
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Hapus Riwayat Nota?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus nota atas nama{' '}
                <strong className="text-slate-800">
                  {itemToDelete.name || 'Pelanggan Ini'}
                </strong>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                id="btn-cancel-delete"
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2 px-4 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition active:scale-95"
              >
                Batal
              </button>
              <button
                id="btn-confirm-delete-action"
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md hover:shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Data Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            id="delete-all-confirm-modal"
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto ring-8 ring-red-50">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-red-950">
                Hapus Semua Riwayat Data?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anda akan menghapus seluruh data riwayat nota (
                <strong className="text-red-700 font-bold">
                  {invoices.length} transaksi
                </strong>
                ) yang tersimpan di perangkat ini.
              </p>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-left text-[11px] text-amber-900 leading-normal">
                ⚠️ <strong>Perhatian:</strong> Data yang sudah dihapus tidak dapat dipulihkan kembali. Pastikan Anda telah menyimpan atau mencetak nota yang diperlukan.
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                id="btn-cancel-delete-all"
                type="button"
                onClick={() => setShowDeleteAllModal(false)}
                className="flex-1 py-2 px-4 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition active:scale-95"
              >
                Batal
              </button>
              <button
                id="btn-confirm-delete-all-action"
                type="button"
                onClick={handleConfirmDeleteAll}
                className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md hover:shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Ya, Hapus Semua Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase mb-1">
            <span>Total Nota</span>
            <Receipt className="w-4 h-4 text-[#8B0000]" />
          </div>
          <div className="text-xl font-bold text-slate-900">{stats.count} Transaksi</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
            {stats.paidCount} Lunas
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase mb-1">
            <span>Total Nilai</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 truncate">
            {formatRupiah(stats.totalGross)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Semua Acara</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase mb-1">
            <span>DP Masuk</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700 truncate">
            {formatRupiah(stats.totalDP)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Uang Muka Diterima</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase mb-1">
            <span>Sisa Piutang</span>
            <Receipt className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-red-700 truncate">
            {formatRupiah(stats.totalSisa)}
          </div>
          <div className="text-[11px] text-red-600 font-medium mt-0.5">Belum Lunas</div>
        </div>
      </div>

      {/* Search & Date Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-7 relative">
            <input
              id="history-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, alamat, no nota, atau ketik tgl (cth: 28-08 / agustus)..."
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:bg-white outline-none transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full transition"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date Picker Filter */}
          <div className="md:col-span-5 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                id="history-date-filter"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-[#8B0000] focus:bg-white outline-none transition cursor-pointer"
                title="Pilih tanggal khusus untuk filter"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            {filterDate && (
              <button
                type="button"
                onClick={() => setFilterDate('')}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-2 rounded-lg font-medium transition flex items-center gap-1 shrink-0"
                title="Reset filter tanggal"
              >
                <X className="w-3 h-3" />
                Reset Tgl
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills & Quick Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Status:
            </span>
            {(['all', 'unpaid', 'paid'] as const).map((status) => {
              const label =
                status === 'all'
                  ? 'Semua'
                  : status === 'unpaid'
                  ? 'Belum Lunas'
                  : 'Lunas';
              const isActive = selectedStatus === status;
              return (
                <button
                  key={status}
                  id={`filter-status-${status}`}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                    isActive
                      ? 'bg-[#8B0000] text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Action buttons: Reset Filters & Hapus Semua Data */}
          <div className="flex items-center gap-2">
            {(searchQuery || filterDate || selectedStatus !== 'all') && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-xs text-[#8B0000] hover:text-red-800 font-semibold underline mr-1"
              >
                Reset Filter
              </button>
            )}

            {invoices.length > 0 && (
              <button
                id="btn-trigger-delete-all"
                type="button"
                onClick={() => setShowDeleteAllModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg transition active:scale-95"
                title="Hapus semua data riwayat transaksi"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Semua Data
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-800 mb-1">
            {searchQuery || filterDate
              ? 'Tidak Ada Nota yang Cocok'
              : 'Belum Ada Riwayat Nota'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || filterDate
              ? `Tidak ditemukan nota dengan kriteria pencarian saat ini. Coba ubah tanggal atau kata kunci.`
              : 'Mulai buat nota baru di tab "Buat Nota", lalu simpan untuk melihat riwayat di sini.'}
          </p>
          {(searchQuery || filterDate || selectedStatus !== 'all') && (
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="mt-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition"
            >
              Tampilkan Semua Nota
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((inv) => {
            const invGross = inv.items.reduce(
              (sum, item) => sum + (item.quantity * item.price || 0),
              0
            );
            const dp = inv.downPayment || 0;
            const remaining = invGross - dp;
            const isLunas = remaining <= 0;
            const invKey = inv.id || inv.invoiceNumber || String(inv.createdAt);

            return (
              <div
                key={invKey}
                id={`history-item-${invKey}`}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-red-200 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {inv.invoiceNumber || 'GE-NOTA'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isLunas
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isLunas ? 'LUNAS' : `SISA: ${formatRupiah(remaining)}`}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {inv.customerName || 'Tanpa Nama'}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right sm:self-center">
                    <div className="text-lg font-bold text-emerald-700">
                      {formatRupiah(invGross)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      DP: {formatRupiah(dp)}
                    </div>
                  </div>
                </div>

                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8B0000] shrink-0" />
                    <span>
                      Tgl Acara:{' '}
                      <strong className="text-slate-800">
                        {inv.eventDate || '-'}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#8B0000] shrink-0" />
                    <span className="truncate">{inv.address || '-'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Dibuat:{' '}
                      {inv.createdAt
                        ? new Date(inv.createdAt).toLocaleString('id-ID')
                        : '-'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Total Item:{' '}
                    <span className="font-semibold text-slate-700">
                      {inv.items.length} item
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    id={`btn-load-inv-${invKey}`}
                    type="button"
                    onClick={() => onLoadInvoice(inv)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B0000] hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Buka di Editor
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      id={`btn-delete-inv-${invKey}`}
                      type="button"
                      onClick={() =>
                        handleOpenDelete(
                          inv.id || inv.invoiceNumber || invKey,
                          inv.customerName || 'Pelanggan'
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition active:scale-95"
                      title="Hapus Nota dari Riwayat"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline text-xs">Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
