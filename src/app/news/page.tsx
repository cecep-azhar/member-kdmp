import React from "react";
import Link from "next/link";
import { ChevronRight, Calendar, Tag } from "lucide-react";

async function getNews() {
  const baseApiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:3000";
  // Ensure we don't have double /api/api
  const apiUrl = baseApiUrl.endsWith('/api') ? baseApiUrl : `${baseApiUrl}/api`;
  
  try {
    const res = await fetch(`${apiUrl}/news?where[status][equals]=published&sort=-publishedAt`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      console.error("News API returned status:", res.status);
      return [];
    }
    const data = await res.json();
    console.log("Fetched News Docs:", data.docs?.length);
    return data.docs || [];
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
}

export default async function NewsPage() {
  const newsItems = await getNews();

  const getImageUrl = (image: any) => {
    if (!image) return '';
    if (typeof image === 'object') return image.url;
    // Fallback if it's an ID
    const baseApiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:3000";
    const serverUrl = baseApiUrl.replace('/api', '');
    return `${serverUrl}/media/${image}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <div className="p-6 bg-white dark:bg-slate-800 shadow-sm border-b border-slate-100 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Berita & Informasi</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Update terbaru seputar Koperasi</p>
      </div>

      <div className="p-4 space-y-4">
        {newsItems.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="text-4xl mb-4 bg-slate-100 dark:bg-slate-800 p-6 rounded-3xl">📰</div>
            <p className="text-slate-500 font-medium">Belum ada berita terbaru yang diterbitkan.</p>
            <p className="text-slate-400 text-xs mt-2 px-10">Pastikan berita di Admin Panel sudah diset statusnya ke &quot;Publikasikan&quot;.</p>
          </div>
        ) : (
          newsItems.map((item: any) => (
            <Link 
              key={item.id} 
              href={`/news/${item.slug}`}
              className="group block bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
            >
              {item.image && (
                <div className="relative h-44 w-full overflow-hidden">
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
                    <Tag size={10} />
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(item.publishedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                  {item.title}
                </h3>
                <div className="mt-3 flex items-center text-primary text-xs font-bold">
                  Baca Selengkapnya
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
