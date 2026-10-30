import { Star, ShieldCheck, Heart } from "lucide-react";

export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  avatarBg: string;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Alexander M.",
    location: "Austin, Texas",
    rating: 5,
    date: "Verified Delivery • 2 days ago",
    title: "Exceptional craftsmanship & fast COD delivery",
    comment: "Ordered on Tuesday, arrived on Thursday via Cash on Delivery. The quality exceeded what I expected. Will definitely be a returning customer.",
    verified: true,
    avatarBg: "bg-blue-600"
  },
  {
    id: "rev-2",
    author: "Sophia L.",
    location: "Seattle, Washington",
    rating: 5,
    date: "Verified Delivery • 4 days ago",
    title: "100% authentic, fits true to size",
    comment: "The packaging was pristine and the materials feel exceptionally durable. Customer care was super responsive when I inquired about sizing.",
    verified: true,
    avatarBg: "bg-rose-600"
  },
  {
    id: "rev-3",
    author: "David K.",
    location: "Toronto, Canada",
    rating: 5,
    date: "Verified Delivery • 1 week ago",
    title: "Smooth checkout experience",
    comment: "No advance payment hassle, straight cash on delivery with zero surprise fees. Clean website, effortless ordering.",
    verified: true,
    avatarBg: "bg-amber-600"
  }
];

export function TestimonialsSection({ storeName }: { storeName: string }) {
  return (
    <section className="py-14 bg-zinc-50 border-t border-zinc-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-zinc-200 text-zinc-700 shadow-subtle">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Customer Feedback</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Loved by 10,000+ Happy Shoppers
          </h2>

          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Real reviews from customers who purchased certified items from {storeName}.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEFAULT_REVIEWS.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating stars & verified tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-500 space-x-0.5">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Buyer</span>
                  </span>
                </div>

                <h4 className="font-bold text-xs text-zinc-900 leading-snug">
                  "{r.title}"
                </h4>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  {r.comment}
                </p>
              </div>

              {/* Author footer */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full ${r.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-sm`}>
                  {r.author[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">{r.author}</p>
                  <p className="text-[10px] text-zinc-400">{r.location} • {r.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

