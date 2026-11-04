"use client";

import { useState } from "react";
import { X, Printer, FileText, Tag, CheckCircle2 } from "lucide-react";

export interface PrintableOrderData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  district?: string;
  items: Array<{ title: string; price: number; quantity: number; sku?: string }>;
  subtotal: number;
  discountAmount?: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  consignmentId?: string;
  courierName?: string;
  createdAt: string;
  storeName: string;
  storePhone?: string;
  storeEmail?: string;
  storeAddress?: string;
}

interface PrintableOrderModalProps {
  order: PrintableOrderData | null;
  onClose: () => void;
}

export function PrintableOrderModal({ order, onClose }: PrintableOrderModalProps) {
  const [activeTab, setActiveTab] = useState<"invoice" | "thermal">("invoice");

  if (!order) return null;

  const isCod = order.paymentMethod?.toLowerCase() === "cod";
  const codDue = isCod && order.paymentStatus !== "paid" ? order.totalAmount : 0;
  const trackingNumber = order.consignmentId || `ST-${order.orderNumber.replace(/\D/g, "").slice(-6) || "892104"}`;
  const courier = order.courierName || "Steadfast Courier";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:static">
      {/* Modal Card */}
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-w-none print:max-h-none print:shadow-none print:rounded-none">
        {/* Controls Bar - Hidden when printing */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("invoice")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "invoice"
                  ? "bg-zinc-900 text-white shadow"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              A4 Tax Invoice
            </button>
            <button
              onClick={() => setActiveTab("thermal")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "thermal"
                  ? "bg-zinc-900 text-white shadow"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
              }`}
            >
              <Tag className="w-4 h-4" />
              4x6&quot; Thermal Shipping Label
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Print Now
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Canvas */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-zinc-100 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          {activeTab === "invoice" ? (
            /* A4 INVOICE TEMPLATE */
            <div
              id="printable-invoice"
              className="w-full max-w-[210mm] min-h-[297mm] bg-white text-zinc-900 p-8 sm:p-12 shadow-md border border-zinc-200 print:shadow-none print:border-none print:p-0"
            >
              {/* Header */}
              <div className="flex justify-between items-start pb-6 border-b border-zinc-200">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-zinc-950 uppercase">{order.storeName}</h1>
                  <p className="text-xs text-zinc-500 mt-1">{order.storeAddress || "Official Store"}</p>
                  <p className="text-xs text-zinc-500">Hotline: {order.storePhone || "01700-000000"}</p>
                  <p className="text-xs text-zinc-500">{order.storeEmail || "support@storeswift.app"}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-zinc-900 text-white px-3 py-1 rounded text-xs font-black tracking-wider uppercase">
                    Tax Invoice
                  </div>
                  <p className="text-sm font-bold text-zinc-800 mt-2">#{order.orderNumber}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Date: {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs font-medium text-emerald-600 mt-1">
                    Status: {order.paymentStatus === "paid" ? "PAID" : "COD PENDING"}
                  </p>
                </div>
              </div>

              {/* Bill To & Ship To */}
              <div className="grid grid-cols-2 gap-8 my-6 text-xs">
                <div>
                  <p className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Customer / Bill To</p>
                  <p className="font-bold text-zinc-900 text-sm">{order.customerName}</p>
                  <p className="text-zinc-600 mt-0.5">{order.customerPhone}</p>
                  {order.customerEmail && <p className="text-zinc-500">{order.customerEmail}</p>}
                </div>
                <div>
                  <p className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Delivery Destination</p>
                  <p className="text-zinc-800 font-medium leading-relaxed">{order.shippingAddress}</p>
                  <p className="text-zinc-600 font-semibold mt-1">District: {order.district || "Dhaka"}</p>
                  <p className="text-zinc-500 mt-0.5">Courier: {courier} (Tracking: {trackingNumber})</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mt-8 border border-zinc-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-700 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {order.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50/50">
                        <td className="py-2.5 px-3 text-zinc-400 font-medium">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-zinc-900">{it.title}</td>
                        <td className="py-2.5 px-3 text-zinc-500 font-mono text-[11px]">{it.sku || "SKU-STD"}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-zinc-800">{it.quantity}</td>
                        <td className="py-2.5 px-3 text-right text-zinc-700">৳{it.price.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-zinc-900">৳{(it.price * it.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Ledger */}
              <div className="flex justify-end mt-6">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900">৳{order.subtotal.toLocaleString()}</span>
                  </div>
                  {order.discountAmount ? (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount ({order.couponCode || "Coupon"})</span>
                      <span>-৳{order.discountAmount.toLocaleString()}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-zinc-600">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-zinc-900">৳{order.shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-zinc-200 pt-2 flex justify-between text-sm font-black text-zinc-950">
                    <span>Total Payable</span>
                    <span>৳{order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="pt-1 text-[11px] text-zinc-500 text-right">
                    Payment Method: <span className="font-bold uppercase text-zinc-800">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Footer Notes & Signatures */}
              <div className="mt-16 pt-6 border-t border-zinc-200 flex justify-between items-end text-[11px] text-zinc-500">
                <div className="space-y-1">
                  <p className="font-semibold text-zinc-700">Terms & Conditions:</p>
                  <p>1. Please inspect all items upon delivery in presence of the courier rider.</p>
                  <p>2. Claims for damaged or missing items must be reported within 24 hours.</p>
                  <p>3. This is a computer-generated tax invoice verified on StoreSwift.</p>
                </div>
                <div className="text-center w-40">
                  <div className="border-b border-zinc-400 pb-1 mb-1 font-signature text-zinc-600 text-sm">StoreSwift Auth</div>
                  <p className="font-bold text-zinc-700 text-[10px] uppercase tracking-wider">Authorized Signature</p>
                </div>
              </div>
            </div>
          ) : (
            /* 4x6" THERMAL COURIER SHIPPING LABEL */
            <div
              id="printable-thermal"
              className="w-[100mm] min-h-[150mm] bg-white text-black p-5 shadow-md border-2 border-dashed border-zinc-300 font-sans flex flex-col justify-between print:border-none print:shadow-none print:w-full print:p-2"
            >
              {/* Top Banner */}
              <div className="border-b-2 border-black pb-2 flex justify-between items-center">
                <div>
                  <span className="text-base font-black uppercase tracking-tight">{courier}</span>
                  <p className="text-[10px] font-bold tracking-wider">EXPRESS COURIER SERVICE</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black border-2 border-black px-2 py-0.5 rounded">
                    {order.district?.toUpperCase() || "DHAKA"}
                  </span>
                </div>
              </div>

              {/* Barcode Mock & Consignment ID */}
              <div className="py-3 text-center border-b-2 border-black">
                <svg className="w-full h-12 mx-auto" viewBox="0 0 200 40">
                  {/* SVG Code 128 representation stripes */}
                  <rect x="10" y="0" width="3" height="35" fill="black" />
                  <rect x="16" y="0" width="2" height="35" fill="black" />
                  <rect x="22" y="0" width="5" height="35" fill="black" />
                  <rect x="30" y="0" width="2" height="35" fill="black" />
                  <rect x="36" y="0" width="4" height="35" fill="black" />
                  <rect x="44" y="0" width="1" height="35" fill="black" />
                  <rect x="48" y="0" width="6" height="35" fill="black" />
                  <rect x="58" y="0" width="3" height="35" fill="black" />
                  <rect x="64" y="0" width="2" height="35" fill="black" />
                  <rect x="70" y="0" width="4" height="35" fill="black" />
                  <rect x="78" y="0" width="2" height="35" fill="black" />
                  <rect x="84" y="0" width="5" height="35" fill="black" />
                  <rect x="92" y="0" width="3" height="35" fill="black" />
                  <rect x="98" y="0" width="4" height="35" fill="black" />
                  <rect x="106" y="0" width="2" height="35" fill="black" />
                  <rect x="112" y="0" width="6" height="35" fill="black" />
                  <rect x="122" y="0" width="3" height="35" fill="black" />
                  <rect x="128" y="0" width="2" height="35" fill="black" />
                  <rect x="134" y="0" width="4" height="35" fill="black" />
                  <rect x="142" y="0" width="5" height="35" fill="black" />
                  <rect x="150" y="0" width="2" height="35" fill="black" />
                  <rect x="156" y="0" width="4" height="35" fill="black" />
                  <rect x="164" y="0" width="3" height="35" fill="black" />
                  <rect x="170" y="0" width="2" height="35" fill="black" />
                  <rect x="176" y="0" width="6" height="35" fill="black" />
                  <rect x="186" y="0" width="3" height="35" fill="black" />
                </svg>
                <p className="font-mono font-black text-sm tracking-widest mt-1">{trackingNumber}</p>
                <p className="text-[10px] text-zinc-600">Order: #{order.orderNumber}</p>
              </div>

              {/* COD Box Callout */}
              <div className="my-2 p-2.5 border-2 border-black text-center bg-zinc-50">
                <p className="text-[11px] font-black uppercase tracking-wider">
                  {codDue > 0 ? "CASH ON DELIVERY (COD)" : "PREPAID — DO NOT COLLECT CASH"}
                </p>
                <p className="text-xl font-black mt-0.5">
                  {codDue > 0 ? `৳${codDue.toLocaleString()}` : "৳0.00"}
                </p>
              </div>

              {/* Recipient Details */}
              <div className="border-b-2 border-black pb-2 text-xs">
                <span className="font-black uppercase text-[10px] tracking-wider block mb-0.5">To (Recipient):</span>
                <p className="font-black text-sm">{order.customerName}</p>
                <p className="font-mono font-bold text-sm">{order.customerPhone}</p>
                <p className="mt-1 font-medium leading-tight text-zinc-800">{order.shippingAddress}</p>
                <p className="font-black uppercase mt-1">District: {order.district || "Dhaka"}</p>
              </div>

              {/* Sender Details */}
              <div className="pt-2 text-[10px] text-zinc-700 flex justify-between items-end">
                <div>
                  <span className="font-bold uppercase text-[9px] block">From (Sender):</span>
                  <p className="font-bold text-black">{order.storeName}</p>
                  <p>Hotline: {order.storePhone || "01700-000000"}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[9px]">Items: {order.items.reduce((s, i) => s + i.quantity, 0)} pcs</span>
                  <div className="flex items-center gap-1 font-bold text-[9px] text-black">
                    <CheckCircle2 className="w-3 h-3 text-black inline" /> Verified
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global CSS for Native Browser Print Execution */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-invoice,
          #printable-invoice *,
          #printable-thermal,
          #printable-thermal * {
            visibility: visible !important;
          }
          #printable-invoice,
          #printable-thermal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            size: auto;
            margin: 8mm;
          }
        }
      `}</style>
    </div>
  );
}
