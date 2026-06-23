'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { shipmentApi } from '@/lib/api';
import { Loader2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const invoiceNum = (s: any) => {
  const n = s.netparcelOrderId || parseInt(s._id.slice(-7), 16) % 9999999;
  return `NPI${String(n).padStart(6, '0')}`;
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-CA', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');

const fmtWeight = (s: any) => {
  const w = (s.parcels || []).reduce((t: number, p: any) => t + (p.weight || 0), 0);
  return `${w.toFixed(2)} ${(s.parcels?.[0]?.weightUnit || 'KGS').toUpperCase()}`;
};

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch by getting user's shipments and finding this one
    shipmentApi.getMyShipments({ limit: 200 })
      .then(({ data }) => {
        const found = (data.shipments || []).find((s: any) => s._id === id);
        setShipment(found || null);
      })
      .catch(() => toast.error('Failed to load invoice.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    if (!shipment) return;
    try {
      const { data } = await shipmentApi.downloadLabel(shipment._id);
      const a = document.createElement('a');
      a.href = data.label;
      a.download = `invoice-${invoiceNum(shipment)}.pdf`;
      a.click();
    } catch { toast.error('Label not available.'); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-7 h-7 animate-spin text-[#00529B]" />
    </div>
  );

  if (!shipment) return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
      <p className="text-gray-500">Invoice not found.</p>
      <Link href="/account/invoices" className="mt-3 text-[#c0392b] hover:underline text-sm inline-block">← Back to Invoices</Link>
    </div>
  );

  const inv = invoiceNum(shipment);
  const amt = shipment.payment?.amount || 0;
  const status = shipment.payment?.status === 'completed' ? 'Paid' : (shipment.payment?.status || 'Pending');
  const weight = fmtWeight(shipment);

  return (
    <div className="space-y-4">
      {/* Back link */}
      <Link href="/account/invoices"
        className="flex items-center gap-1 text-sm text-[#c0392b] hover:underline">
        <span className="text-base">‹</span> Back to Invoices
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Invoice header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Invoice # - {inv} Summary</h2>
          <p className="text-sm text-gray-600 mt-0.5">Status &nbsp;: {status}</p>
        </div>

        {/* Summary row */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Invoice Total</p>
              <p className="text-sm text-gray-600">${amt.toFixed(2)} {shipment.payment?.currency || 'CAD'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Invoice Paid Amount</p>
              <p className="text-sm text-gray-600">$ {amt.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Total Credits</p>
              <p className="text-sm text-gray-600">$ 0.00</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Balance Due</p>
              <p className="text-sm text-gray-600">$ 0.00</p>
            </div>
          </div>
        </div>

        {/* Orders section */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            <span className="text-[#00529B] font-bold mr-1">1</span> Orders
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100">
                {['Order #','Ship Date','Quoted Weight','Billed Weight','Quoted','Actual Charges','On this Invoice','Adjustment'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <Link href={shipment.trackingNumber ? `/track?number=${shipment.trackingNumber}` : '#'}
                    className="text-[#c0392b] hover:underline font-medium text-xs">
                    {shipment.netparcelOrderId || shipment.shipmentNumber}
                  </Link>
                </td>
                <td className="px-5 py-4 text-xs text-gray-600">{fmtDate(shipment.createdAt)}</td>
                <td className="px-5 py-4 text-xs text-gray-600">{weight}</td>
                <td className="px-5 py-4 text-xs text-gray-600">{weight}</td>
                <td className="px-5 py-4 text-xs text-gray-600">$ {amt.toFixed(2)}</td>
                <td className="px-5 py-4 text-xs text-gray-600">$ {amt.toFixed(2)}</td>
                <td className="px-5 py-4 text-xs text-gray-600">$ {amt.toFixed(2)}</td>
                <td className="px-5 py-4 text-xs text-gray-600">$ 0.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Download row */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-3">
          <button onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-5 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:border-[#00529B] hover:text-[#00529B] transition-all flex-1 sm:flex-initial">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <Link href="/account/invoices"
            className="flex items-center justify-center gap-2 px-5 py-2 text-sm border border-gray-300 rounded text-gray-500 hover:border-gray-400 transition-all flex-1 sm:flex-initial">
            ← Back to Invoices
          </Link>
        </div>
      </div>
    </div>
  );
}
