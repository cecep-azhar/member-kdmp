import React from "react";

export const runtime = "edge";
import Link from "next/link";
import { ChevronRight, Calendar, Tag, Newspaper } from "lucide-react";

async function getNews() {
  const baseApiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:3000/api";
  const apiUrl = baseApiUrl.endsWith("/api") ? baseApiUrl : `${baseApiUrl}/api`;

  try {
    const res = await fetch(`${apiUrl}/news?where[status][equals]=published&sort=-publishedAt&limit=50`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      console.error("News API returned status:", res.status);
      return [];
    }
    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
}

const categoryLabel: Record<string, string> = {
  news: "Berita",
  announcement: "Pengumuman",
  education: "Edukasi",
};

const categoryColor: Record<string, string> = {
  news: "bg-blue-100 text-blue-700",
  announcement: "bg-rose-100 text-rose-700",
  education: "bg-emerald-100 text-emerald-700",
};

export default async function NewsPage() {
  const newsItems = await getNews();

  const getImageUrl = (image: any) => {
    if (!image) return "";
    if (typeof image === "object") return image.url || "";
    const baseApiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:3000/api";
    const serverUrl = baseApiUrl.replace("/api", "");
    return `${serverUrl}/media/${image}`;
  };

  const getExcerpt = (content: any): string => {
    try {
      const paragraphs = content?.root?.children?.filter((c: any) => c.type === "paragraph") || [];
      for (const p of paragraphs) {
        const text = p.children?.map((c: any) => c.text || "").join("").trim();
        if (text) return text.slice(0, 120) + (text.length > 120 ? "..." : "");
      }
    } catch {}
    return "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 px-6 pt-10 pb-6 border-b border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <Newspaper size={22} className="text-primary" />
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Berita & Informasi</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Update terbaru seputar koperasi
        </p>
      </div>

      <div className="p-4 space-y-4">
        {newsItems.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="text-5xl mb-4">📰</div>
            <p className="text-slate-600 font-bold dark:text-slate-300">Belum ada berita terbaru</p>
            <p className="text-slate-400 text-xs mt-2 px-10">
              Pastikan berita di Admin sudah diset statusnya ke &quot;Publikasikan&quot;
            </p>
          </div>
        ) : (
          newsItems.map((item: any, index: number) => {
            const imageUrl = getImageUrl(item.image);
            const excerpt = getExcerpt(item.content);
            const catLabel = categoryLabel[item.category] || item.category;
            const catColor = categoryColor[item.category] || "bg-slate-100 text-slate-700";

            // Berita pertama tampil lebih besar (featured)
            if (index === 0) {
              return (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group block bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
                >
                  {imageUrl && (
                    <div className="relative h-52 w-full overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black uppercase rounded-lg ${catColor}`}>
                        {catLabel}
                      </span>
                    </div>
                  )}
                  <div className="p-5">
                    {!imageUrl && (
                      <span className={`inline-block px-2.5 py-1 text-[10px] font-black uppercase rounded-lg mb-2 ${catColor}`}>
                        {catLabel}
                      </span>
                    )}
                    <h3 className="font-black text-slate-900 dark:text-white text-base leading-tight mb-2">
                      {item.title}
                    </h3>
                    {excerpt && <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-3">{excerpt}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar size={11} />
                        {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </div>
                      <span className="text-primary text-xs font-bold flex items-center gap-0.5">
                        Baca <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group flex gap-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm active:scale-[0.98] transition-transform p-4"
              >
                {imageUrl ? (
                  <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <Newspaper size={24} className="text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase rounded-md mb-1.5 ${catColor}`}>
                    {catLabel}
                  </span>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm line-clamp-2 leading-tight mb-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Calendar size={10} />
                    {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 flex-shrink-0 self-center" />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
