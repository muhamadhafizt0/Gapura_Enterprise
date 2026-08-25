import React, { forwardRef } from 'react';
import { Phone, MapPin, Instagram } from 'lucide-react';
import { InvoiceData } from '../types';
import { formatNumberOnly, formatRupiah } from '../utils/formatters';
import { GapuraLogo } from './Logo';

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoice }, ref) => {
    const totalGross = invoice.items.reduce(
      (sum, item) => sum + (item.quantity * item.price || 0),
      0
    );
    const downPayment = invoice.downPayment || 0;
    const remaining = totalGross - downPayment;
    const tuanHajatSig = invoice.tuanHajatSignature || (invoice as any).customerSignature;
    const hormatKamiSig = invoice.hormatKamiSignature || (invoice as any).ownerSignature;

    return (
      <div
        id="invoice-capture-area"
        ref={ref}
        style={{
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          color: '#000000',
          border: '4px solid #8b0000',
          padding: '10px 10px',
          boxSizing: 'border-box',
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
        className="invoice-border select-none leading-tight"
      >
        {/* HEADER SECTION WITH LOGO & TITLE */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'linear-gradient(to top, rgb(70, 5, 5), rgb(112, 8, 8))',
            borderRadius: '8px',
            marginBottom: '8px',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          {/* Left: Logo & Company Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Logo without white box, slightly bigger */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <GapuraLogo size="md" variant="icon" />
            </div>

            {/* Header Title & Tagline */}
            <div style={{ minWidth: 0, flexShrink: 0 }}>
              <h1
                style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  color: '#ffffff',
                  letterSpacing: '1px',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)',
                  margin: '0',
                  lineHeight: '1.15',
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                GAPURA ENTERPRISE
              </h1>
              <p
                style={{
                  fontSize: '7.5px',
                  color: '#bef264',
                  fontWeight: '800',
                  fontStyle: 'italic',
                  margin: '2px 0 0 0',
                  letterSpacing: '0.03em',
                  lineHeight: '1.2',
                  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                  whiteSpace: 'nowrap',
                }}
              >
                wedding dream solution
              </p>
            </div>
          </div>
        </div>

        {/* CONTACT & CUSTOMER DETAILS BAR */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '8px',
            padding: '2px 4px',
            fontSize: '9.5px',
            lineHeight: '1.3',
          }}
        >
          {/* Left Column: Contact info */}
          <div style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <p style={{ fontWeight: '700', margin: '0', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  flexShrink: 0,
                }}
              >
                <Phone size={9} strokeWidth={2.5} />
              </span>
              <span style={{ color: '#0f172a', fontWeight: '800' }}>0821-1887-0862</span>
            </p>

            <p style={{ fontWeight: '600', margin: '0', display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                <MapPin size={9} strokeWidth={2.5} />
              </span>
              <span style={{ color: '#334155', fontSize: '9px', lineHeight: '1.25' }}>
                Jln Rambutan IV, Perum Korpri Cigintung Blok C, RT.17/RW.6, Kel. Cigintung, Kuningan, Jawa Barat
              </span>
            </p>

            <p style={{ fontWeight: '600', margin: '0', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  backgroundColor: '#fce7f3',
                  color: '#be185d',
                  flexShrink: 0,
                }}
              >
                <Instagram size={9} strokeWidth={2.5} />
              </span>
              <span style={{ color: '#0f172a', fontWeight: '700' }}>gapura_enterprise</span>
            </p>
          </div>

          {/* Right Column: Customer info */}
          <div
            style={{
              width: '40%',
              display: 'flex',
              flexDirection: 'column',
              gap: '2.5px',
              fontSize: '8.5px',
              lineHeight: '1.25',
              paddingLeft: '6px',
              borderLeft: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontWeight: '600', color: '#64748b', minWidth: '45px', flexShrink: 0 }}>Nama :</span>
              <span
                style={{
                  fontWeight: '700',
                  color: '#0f172a',
                  wordBreak: 'break-word',
                }}
              >
                {invoice.customerName || '...........................'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontWeight: '600', color: '#64748b', minWidth: '45px', flexShrink: 0 }}>Alamat :</span>
              <span
                style={{
                  color: '#334155',
                  wordBreak: 'break-word',
                }}
              >
                {invoice.address || '...........................'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontWeight: '600', color: '#64748b', minWidth: '45px', flexShrink: 0 }}>Tgl Acara :</span>
              <span
                style={{
                  fontWeight: '700',
                  color: '#8b0000',
                  wordBreak: 'break-word',
                }}
              >
                {invoice.eventDate || '...........................'}
              </span>
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '9.5px',
            marginTop: '4px',
            marginBottom: '0px',
          }}
        >
          <thead>
            <tr
              style={{
                background: 'linear-gradient(to top, rgb(70, 5, 5), rgb(112, 8, 8))',
                color: '#ffffff',
              }}
            >
              <th
                style={{
                  width: '6%',
                  border: '1px solid #000000',
                  padding: '2px 4px',
                  textAlign: 'center',
                  fontWeight: '700',
                }}
              >
                No.
              </th>
              <th
                style={{
                  width: '40%',
                  border: '1px solid #000000',
                  padding: '2px 6px',
                  textAlign: 'left',
                  fontWeight: '700',
                }}
              >
                Nama Barang
              </th>
              <th
                style={{
                  width: '12%',
                  border: '1px solid #000000',
                  padding: '2px 4px',
                  textAlign: 'center',
                  fontWeight: '700',
                }}
              >
                Jumlah
              </th>
              <th
                style={{
                  width: '20%',
                  border: '1px solid #000000',
                  padding: '2px 6px',
                  textAlign: 'right',
                  fontWeight: '700',
                }}
              >
                Harga
              </th>
              <th
                style={{
                  width: '22%',
                  border: '1px solid #000000',
                  padding: '2px 6px',
                  textAlign: 'right',
                  fontWeight: '700',
                }}
              >
                Total Harga
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    border: '1px solid #000000',
                    padding: '8px',
                    textAlign: 'center',
                    color: '#666',
                    fontStyle: 'italic',
                  }}
                >
                  Belum ada item
                </td>
              </tr>
            ) : (
              invoice.items.map((item, index) => {
                const lineTotal = (item.quantity || 0) * (item.price || 0);
                return (
                  <tr key={item.id || index}>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '1px 3px',
                        textAlign: 'center',
                        height: '16px',
                      }}
                    >
                      {index + 1}.
                    </td>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '1px 5px',
                        textAlign: 'left',
                        height: '16px',
                        fontWeight: '500',
                      }}
                    >
                      {item.name || ''}
                    </td>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '1px 3px',
                        textAlign: 'center',
                        height: '16px',
                      }}
                    >
                      {item.quantity || ''}
                    </td>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '1px 5px',
                        textAlign: 'right',
                        height: '16px',
                      }}
                    >
                      {item.price ? formatNumberOnly(item.price) : ''}
                    </td>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '1px 5px',
                        textAlign: 'right',
                        height: '16px',
                        fontWeight: '600',
                      }}
                    >
                      {lineTotal > 0 ? `Rp ${formatNumberOnly(lineTotal)}` : 'Rp 0'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* TOTALS SUMMARY BLOCK */}
        <div
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '9.5px',
            marginTop: '4px',
            marginBottom: '0px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', width: '50%', textAlign: 'right', paddingRight: '4px' }}>
              TOTAL:
            </span>
            <span
              style={{
                border: '1px solid #000000',
                padding: '2px 4px',
                width: '66%',
                textAlign: 'right',
                fontWeight: '600',
              }}
            >
              Rp {formatRupiah(totalGross)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-1px' }}>
            <span style={{ fontWeight: '700', width: '50%', textAlign: 'right', paddingRight: '4px' }}>
              UANG MUKA:
            </span>
            <span
              style={{
                border: '1px solid #000000',
                padding: '2px 4px',
                width: '66%',
                textAlign: 'right',
                fontWeight: '600',
              }}
            >
              Rp {formatRupiah(downPayment)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-1px' }}>
            <span style={{ fontWeight: '700', width: '50%', textAlign: 'right', paddingRight: '4px' }}>
              SISA:
            </span>
            <span
              style={{
                border: '1px solid #000000',
                padding: '2px 4px',
                width: '66%',
                textAlign: 'right',
                fontWeight: '800',
                color: remaining <= 0 ? '#166534' : '#991b1b',
              }}
            >
              Rp {formatRupiah(remaining)}
            </span>
          </div>
        </div>

        {/* BOTTOM SECTION: NOTES & SIGNATURES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0px', marginTop: '4px' }}>
          {/* Notes */}
          <div style={{ padding: '4px 6px' }}>
            <div style={{ fontSize: '8px', lineHeight: '1.3' }}>
              <h3 style={{ fontWeight: '700', margin: '0 0 2px 0', fontSize: '8.5px' }}>CATATAN:</h3>
              <ol style={{ listStyleType: 'decimal', paddingLeft: '14px', margin: '0' }}>
                <li>Segala bentuk kerusakan dan kehilangan barang merupakan tanggung jawab tuan hajat.</li>
                <li>
                  Uang muka wajib dibayarkan minimum <b style={{ fontWeight: '700' }}>10%</b> dari total keseluruhan.
                </li>
                <li>Uang muka dianggap hangus apabila ada pembatalan sepihak dari tuan hajat.</li>
                <li>
                  Pelunasan sisa pembayaran selambat-lambatnya <b style={{ fontWeight: '700' }}>3 hari</b> setelah acara selesai.
                </li>
                <li>
                  Apabila Tuan hajat tidak bisa melunasi dalam kurun waktu <b style={{ fontWeight: '700' }}>1 minggu</b> setelah acara selesai, maka tuan hajat wajib memberikan jaminan yang setara.
                </li>
              </ol>
            </div>
          </div>

          {/* Signature block */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', fontSize: '9px' }}>
            <div
              id="signature-block"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '4px',
                paddingTop: '2px',
                textAlign: 'center',
              }}
            >
              <div style={{ width: '45%' }}>
                <p style={{ margin: '0' }}>Tanda Terima</p>
                <div
                  style={{
                    marginTop: '4px',
                    borderBottom: '1px solid #000000',
                    width: '110px',
                    height: '38px',
                    margin: '4px auto 0 auto',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {tuanHajatSig ? (
                    <img
                      src={tuanHajatSig}
                      alt="Tanda Terima"
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '8px', color: '#cbd5e1', fontStyle: 'italic' }}>
                      (...................)
                    </span>
                  )}
                </div>
              </div>

              <div style={{ width: '45%' }}>
                <p style={{ margin: '0' }}>Hormat Kami</p>
                <div
                  style={{
                    marginTop: '4px',
                    borderBottom: '1px solid #000000',
                    width: '110px',
                    height: '38px',
                    margin: '4px auto 0 auto',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {hormatKamiSig ? (
                    <img
                      src={hormatKamiSig}
                      alt="Hormat Kami"
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '8px', color: '#cbd5e1', fontStyle: 'italic' }}>
                      (...................)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BANNER */}
        <div
          style={{
            marginTop: '14px',
            textAlign: 'center',
            padding: '6px',
            background: 'linear-gradient(to top, rgb(70, 5, 5), rgb(112, 8, 8))',
            color: '#ffffff',
            fontWeight: '700',
            borderTop: '2px dashed #93c5fd',
            borderBottom: '2px dashed #93c5fd',
          }}
        >
          <h2
            style={{
              borderRadius: '50px',
              fontSize: '10px',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '1px',
              textShadow: '4px 7px 4px rgba(0, 0, 0, 0.497)',
              margin: '0',
            }}
          >
            TERIMA KASIH ATAS KERJA SAMA ANDA
          </h2>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
