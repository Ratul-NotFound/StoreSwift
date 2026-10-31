"use client";

import { useState } from "react";
import {
  X,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Search,
  Package,
  ArrowRight,
  AlertCircle
} from "lucide-react";

export interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeDisplayName?: string;
  tenantSlug?: string;
}

export function TrackOrderModal({
  isOpen,
  onClose,
  storeDisplayName = "Apex Fashion Hub",
  tenantSlug = "apex-fashion"
}: TrackOrderModalProps) {
  const [trackingInput, setTrackingInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingInput.trim();
    if (!query) return;

    setIsSearching(true);
    // Simulate real-time API lookup to Steadfast / Pathao / Database
    setTimeout(() => {
      const isSteadfast = query.toUpperCase().startsWith("ST-") || query.length === 8;
      const isPathao = query.toUpperCase().startsWith("PTH-");
      const courierName = isSteadfast ? "Steadfast Courier" : isPathao ? "Pathao Logistics" : "Steadfast Courier";
      const consignmentId = query.toUpperCase().startsWith("ST-") || query.toUpperCase().startsWith("PTH-")
        ? query.toUpperCase()
        : `ST-${Math.floor(100000 + Math.random() * 900000)}`;

      setTrackingResult({
        orderNumber: `SS-${Date.now().toString(36).toUpperCase().slice(-6)}`,
        consignmentId,
        courier: courierName,
        recipient: "Customer (Verified Delivery)",
        phone: query.includes("01") ? query : "01711-234567",
        status: "out_for_delivery",
        statusText: "Out for Delivery with Rider",
        hub: "Dhaka Central Tejgaon Hub → Gulshan / Banani Local Hub",
        riderName: "Al-Amin Hossain",
        riderPhone: "+880 1819-876543",
        estimatedArrival: "Today before 7:00 PM",
        codAmount: 1850,
        timeline: [
          { title: "Order Confirmed & Payment Verified", time: "Oct 29, 04:30 PM", done: true, icon: CheckCircle2 },
          { title: "Automated Courier Manifest Generated", time: "Oct 29, 06:15 PM", done: true, icon: Package },
          { title: "Picked Up by Courier Rider", time: "Oct 30, 09:30 AM", done: true, icon: Truck },
          { title: "Arrived at Destination Distribution Hub", time: "Oct 30, 01:15 PM", done: true, icon: MapPin },
          { title: "Out for Delivery (Rider Dispatched)", time: "Oct 30, 02:45 PM", done: true, active: true, icon: Truck },
          { title: "Delivered & COD Doorstep Inspection", time: "Estimated: Today 6 PM", done: false, icon: Clock }
        ]
      });
      setIsSearching(false);
      setHasSearched(true);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200/80 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200/80 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
              <Truck className="w-4.5 h-4.5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                Live Order & Parcel Tracking
              </h3>
              <p className="text-[11px] text-zinc-500 font-medium">
                {storeDisplayName} • Steadfast & Pathao Courier Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-5 border-b border-zinc-100 bg-white">
          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="Enter Consignment ID (e.g. ST-882910) or Phone..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none font-mono transition"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !trackingInput.trim()}
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 btn-press flex-shrink-0"
            >
              {isSearching ? (
                <span>Checking...</span>
              ) : (
                <>
                  <span>Track</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Sample Pills */}
          {!hasSearched && (
            <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-zinc-500">
              <span className="font-semibold text-zinc-400">Quick Test:</span>
              <button
                type="button"
                onClick={() => { setTrackingInput("ST-982143"); }}
                className="px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono transition"
              >
                ST-982143 (Steadfast)
              </button>
              <button
                type="button"
                onClick={() => { setTrackingInput("PTH-710294"); }}
                className="px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono transition"
              >
                PTH-710294 (Pathao)
              </button>
            </div>
          )}
        </div>

        {/* Result Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#fafafa]">
          {hasSearched && trackingResult ? (
            <div className="space-y-4">
              {/* Status Header Card */}
              <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-mono">
                      {trackingResult.courier}
                    </span>
                    <h4 className="text-base font-extrabold text-zinc-900 tracking-tight">
                      {trackingResult.consignmentId}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{trackingResult.statusText}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-medium">Estimated Arrival</span>
                    <span className="font-bold text-zinc-800">{trackingResult.estimatedArrival}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-medium">COD Collectible</span>
                    <span className="font-bold text-zinc-900 font-mono">৳{trackingResult.codAmount}</span>
                  </div>
                </div>

                {/* Rider Card */}
                <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px]">
                      AH
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">{trackingResult.riderName}</p>
                      <p className="text-[10px] text-zinc-500">Delivery Rider</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${trackingResult.riderPhone}`}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-semibold hover:border-zinc-400 transition"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span className="font-mono text-[11px]">Call Rider</span>
                  </a>
                </div>
              </div>

              {/* Live Timeline */}
              <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-subtle space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Consignment Milestones
                </h5>
                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
                  {trackingResult.timeline.map((step: any, idx: number) => {
                    const Icon = step.icon;
                    return (
                      <div key={idx} className="flex items-start space-x-3 relative">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                            step.active
                              ? "bg-blue-600 text-white ring-4 ring-blue-100"
                              : step.done
                              ? "bg-emerald-600 text-white"
                              : "bg-zinc-200 text-zinc-400"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold leading-none ${
                              step.active
                                ? "text-blue-700"
                                : step.done
                                ? "text-zinc-900"
                                : "text-zinc-400"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-1 font-mono">{step.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Doorstep Inspection Guarantee Badge */}
              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-start space-x-2.5 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Open Parcel Doorstep Inspection</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    You have the right to open the courier parcel and inspect all items in front of the rider before paying Cash on Delivery.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-zinc-800">
                Enter your Consignment ID or Phone Number
              </p>
              <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                Track live parcels handled by Steadfast Courier, Pathao, or RedX nationwide across all 64 districts.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 bg-white flex items-center justify-between text-xs">
          <span className="text-[11px] text-zinc-500">
            Need urgent help? Call <strong className="text-zinc-800">+880 1711-234567</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-xl transition text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

