"use client";

import { useEffect, useRef } from "react";
import { Search, X, ShoppingBag, ArrowRight } from "lucide-react";

export interface SearchProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  comparePrice: number;
  imageUrl?: string;
  badge?: string;
  category?: string;
}

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  products: SearchProduct[];
  onSelectProduct: (p: SearchProduct) => void;
  onAddToCart: (p: SearchProduct) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  products,
  onSelectProduct,
  onAddToCart
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matches = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : products.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-zinc-200 shadow-2xl overflow-hidden mt-12 sm:mt-20">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-zinc-200 flex items-center space-x-3 bg-zinc-50">
          <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search footwear, cosmetics, apparel, gear..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-zinc-900 placeholder:text-zinc-400 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="text-xs text-zinc-400 hover:text-zinc-600 px-1.5 py-0.5 rounded bg-zinc-200/60"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1 pb-1">
            <span>{searchQuery.trim() ? `Search Results (${matches.length})` : "Popular Recommendations"}</span>
            <span className="text-[10px]">Press ESC to close</span>
          </div>

          {matches.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-xs font-semibold text-zinc-700">No items matching "{searchQuery}"</p>
              <p className="text-[11px] text-zinc-400">Try searching for generic terms like "sneaker", "cotton", or "serum".</p>
            </div>
          ) : (
            matches.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 transition cursor-pointer border border-transparent hover:border-zinc-200 group"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-12 h-12 rounded-lg object-cover bg-zinc-100 border border-zinc-200 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition">
                      {p.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs font-black text-zinc-900">${p.price.toFixed(2)}</span>
                      {p.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(p);
                    }}
                    className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold rounded-lg transition flex items-center space-x-1"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 transition" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

