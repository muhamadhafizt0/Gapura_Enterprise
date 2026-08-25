import React, { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Save,
  Printer,
  Share2,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { InvoiceData } from '../types';
import { formatRupiah, formatNumberOnly } from '../utils/formatters';

interface ActionButtonsProps {
  invoice: InvoiceData;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onSaveToDB: () => void;
  onClearForm: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  invoice,
  previewRef,
  onSaveToDB,
  onClearForm,
  onShowToast,
}) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isPngLoading, setIsPngLoading] = useState(false);

  // Trigger file download helper
  const triggerDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 1000);
  };

  // Fallback vector PDF builder if DOM capture has an unexpected issue
  const generateFallbackPdf = (pdfFileName: string) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const totalGross = invoice.items.reduce(
      (sum, item) => sum + (item.quantity * item.price || 0),
      0
    );
    const dp = invoice.downPayment || 0;
    const remaining = totalGross - dp;

    // Red header bar
    pdf.setFillColor(139, 0, 0); // #8B0000
    pdf.rect(10, 10, 190, 22, 'F');

    // Header Text
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GAPURA ENTERPRISE', 15, 20);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Wedding Dream Solution & Event Organizer', 15, 26);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('WA: 0821-1887-0862  |  IG: @gapura_enterprise', 15, 30);

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NOTA PEMESANAN', 150, 20);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`No: ${invoice.invoiceNumber || 'GE-NOTA'}`, 150, 26);

    // Customer info box
    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(10);
    let y = 40;
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATA PELANGGAN', 15, y);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(15, y + 2, 195, y + 2);

    y += 8;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nama Pelanggan / Tuan Hajat : ${invoice.customerName || '-'}`, 15, y);
    y += 6;
    pdf.text(`Alamat Acara : ${invoice.address || '-'}`, 15, y);
    y += 6;
    pdf.text(`Tanggal Acara : ${invoice.eventDate || '-'}`, 15, y);

    // Items table
    y += 12;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(15, y - 4, 180, 8, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.text('No', 18, y + 1);
    pdf.text('Nama Barang / Jasa', 32, y + 1);
    pdf.text('Qty', 115, y + 1);
    pdf.text('Harga (Rp)', 135, y + 1);
    pdf.text('Total (Rp)', 165, y + 1);

    y += 8;
    pdf.setFont('helvetica', 'normal');
    invoice.items.forEach((item, idx) => {
      const lineTotal = item.quantity * item.price;
      pdf.text(`${idx + 1}`, 18, y);
      pdf.text(item.name || '-', 32, y);
      pdf.text(`${item.quantity}`, 115, y);
      pdf.text(formatNumberOnly(item.price), 135, y);
      pdf.text(formatNumberOnly(lineTotal), 165, y);
      pdf.setDrawColor(230, 230, 230);
      pdf.line(15, y + 2, 195, y + 2);
      y += 7;
    });

    // Summary box
    y += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Total : ${formatRupiah(totalGross)}`, 140, y);
    y += 6;
    pdf.text(`DP / Uang Muka : ${formatRupiah(dp)}`, 140, y);
    y += 6;
    pdf.setTextColor(180, 0, 0);
    pdf.text(`Sisa Pembayaran : ${formatRupiah(remaining)}`, 140, y);

    // Notes
    y += 15;
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(8);
    pdf.text('Catatan: Pelunasan sisa pembayaran selambat-lambatnya 3 hari setelah acara selesai.', 15, y);

    pdf.save(pdfFileName);
  };

  // 1. GENERATE & DIRECTLY DOWNLOAD PDF (.pdf)
  const handleGeneratePdf = async () => {
    if (!previewRef.current) return;
    setIsPdfLoading(true);

    const safeName = (invoice.customerName || 'Pelanggan').trim().replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Nota_Gapura_${invoice.invoiceNumber || 'GE'}_${safeName}.pdf`;

    try {
      // Auto save to history
      onSaveToDB();

      const element = previewRef.current;

      // Use html-to-image which natively supports all CSS functions including oklch
      const imgData = await toJpeg(element, {
        quality: 0.95,
        pixelRatio: 2.2,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);

      const margin = 10;
      const availableWidth = pdfWidth - margin * 2;
      const imgHeight = (imgProps.height * availableWidth) / imgProps.width;

      pdf.addImage(
        imgData,
        'JPEG',
        margin,
        margin,
        availableWidth,
        Math.min(imgHeight, pdfHeight - margin * 2)
      );

      pdf.save(fileName);
      onShowToast(`File ${fileName} berhasil disimpan!`, 'success');
    } catch (error) {
      console.warn('html-to-image PDF export error, attempting fallback vector PDF:', error);
      try {
        generateFallbackPdf(fileName);
        onShowToast(`File ${fileName} berhasil disimpan!`, 'success');
      } catch (fallbackErr) {
        console.error('Fallback PDF error:', fallbackErr);
        onShowToast('Gagal membuat file PDF. Silakan coba lagi.', 'error');
      }
    } finally {
      setIsPdfLoading(false);
    }
  };

  // 2. GENERATE & DIRECTLY DOWNLOAD PNG (.png)
  const handleGeneratePng = async () => {
    if (!previewRef.current) return;
    setIsPngLoading(true);

    const safeName = (invoice.customerName || 'Pelanggan').trim().replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Nota_Gapura_${invoice.invoiceNumber || 'GE'}_${safeName}.png`;

    try {
      onSaveToDB();

      const element = previewRef.current;

      // html-to-image converts DOM with full modern CSS & SVG support
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      triggerDownload(dataUrl, fileName);
      onShowToast(`Gambar ${fileName} berhasil disimpan!`, 'success');
    } catch (error) {
      console.error('PNG Export Error:', error);
      onShowToast('Gagal menyimpan file gambar .png.', 'error');
    } finally {
      setIsPngLoading(false);
    }
  };

  // Quick WhatsApp Text Summary
  const handleShareWhatsApp = () => {
    const totalGross = invoice.items.reduce(
      (sum, item) => sum + (item.quantity * item.price || 0),
      0
    );
    const sisa = totalGross - (invoice.downPayment || 0);

    const itemsSummary = invoice.items
      .map((item, idx) => `${idx + 1}. ${item.name} (${item.quantity}x) = ${formatRupiah(item.quantity * item.price)}`)
      .join('\n');

    const text = `*GAPURA ENTERPRISE - NOTA PEMESANAN*\n` +
      `-----------------------------------------\n` +
      `No. Nota : *${invoice.invoiceNumber}*\n` +
      `Tuan Hajat : *${invoice.customerName || '-'}*\n` +
      `Alamat : ${invoice.address || '-'}\n` +
      `Tgl Acara : *${invoice.eventDate || '-'}*\n\n` +
      `*RINCIAN SEWA / JASA:*\n${itemsSummary}\n\n` +
      `-----------------------------------------\n` +
      `*TOTAL:* ${formatRupiah(totalGross)}\n` +
      `*DP MASUK:* ${formatRupiah(invoice.downPayment || 0)}\n` +
      `*SISA TAGIHAN:* ${formatRupiah(sisa)}\n` +
      `-----------------------------------------\n` +
      `Kontak: 0821-1887-0862 (Gapura Enterprise)\n` +
      `_Terima kasih atas kerja sama Anda_`;

    navigator.clipboard.writeText(text);
    onShowToast('Rincian nota berhasil disalin ke WhatsApp clipboard!', 'info');
  };

  // Direct Browser Print
  const handleDirectPrint = () => {
    onSaveToDB();
    window.print();
  };

  return (
    <div id="action-buttons-container" className="space-y-3">
      {/* Primary 1: SIMPAN & CETAK PDF */}
      <button
        id="btn-print-pdf"
        type="button"
        disabled={isPdfLoading}
        onClick={handleGeneratePdf}
        className="w-full h-12 bg-[#8B0000] hover:bg-[#700000] active:bg-[#500000] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2.5 transition active:scale-[0.99] disabled:opacity-70 cursor-pointer text-sm"
      >
        {isPdfLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>MENYIMPAN FILE PDF...</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>SIMPAN SEBAGAI PDF (.pdf)</span>
          </>
        )}
      </button>

      {/* Primary 2: SIMPAN SEBAGAI PNG */}
      <button
        id="btn-export-png"
        type="button"
        disabled={isPngLoading}
        onClick={handleGeneratePng}
        className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2.5 transition active:scale-[0.99] disabled:opacity-70 cursor-pointer text-sm"
      >
        {isPngLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>MENYIMPAN FILE GAMBAR...</span>
          </>
        ) : (
          <>
            <ImageIcon className="w-5 h-5" />
            <span>SIMPAN SEBAGAI GAMBAR (.png)</span>
          </>
        )}
      </button>

      {/* Auxiliary Actions Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <button
          id="btn-direct-print"
          type="button"
          onClick={handleDirectPrint}
          className="py-2.5 px-2 bg-slate-800 hover:bg-slate-900 text-slate-100 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
          title="Buka dialog cetak printer"
        >
          <Printer className="w-3.5 h-3.5 text-blue-400" />
          <span>Print Langsung</span>
        </button>

        <button
          id="btn-save-db"
          type="button"
          onClick={() => {
            onSaveToDB();
            onShowToast('Data nota berhasil disimpan ke Riwayat!', 'success');
          }}
          className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition border border-slate-200"
        >
          <Save className="w-3.5 h-3.5 text-emerald-600" />
          <span>Simpan Data</span>
        </button>

        <button
          id="btn-copy-wa"
          type="button"
          onClick={handleShareWhatsApp}
          className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition border border-slate-200"
          title="Salin rincian untuk chat WhatsApp"
        >
          <Share2 className="w-3.5 h-3.5 text-[#65a30d]" />
          <span>Salin ke WA</span>
        </button>

        <button
          id="btn-clear-form"
          type="button"
          onClick={onClearForm}
          className="py-2.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition border border-red-200"
        >
          <RefreshCw className="w-3.5 h-3.5 text-red-600" />
          <span>Form Baru</span>
        </button>
      </div>
    </div>
  );
};
