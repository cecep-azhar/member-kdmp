import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

async function getNewsBySlug(slug: string) {
  const baseApiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:3000/api";
  const apiUrl = baseApiUrl.endsWith("/api") ? baseApiUrl : `${baseApiUrl}/api`;

  try {
    const res = await fetch(
      `${apiUrl}/news?where[slug][equals]=${slug}&where[status][equals]=published`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error("Failed to fetch news detail:", error);
    return null;
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

// Next.js 16: params is a Promise
export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  const getImageUrl = (image: any) => {
    if (!image) return "";
    if (typeof image === "object") return image.url || "";
    const baseApiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:3000/api";
    const serverUrl = baseApiUrl.replace("/api", "");
    return `${serverUrl}/media/${image}`;
  };

  const catLabel = categoryLabel[item.category] || item.category;
  const catColor = categoryColor[item.category] || "bg-slate-100 text-slate-700";

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between">
        <Link
          href="/news"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group"
        >
          <ArrowLeft size={20} className="group-active:-translate-x-1 transition-transform" />
        </Link>
        <span className="font-black text-sm text-slate-900 dark:text-white truncate px-4">
          Detail Berita
        </span>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <Share2 size={20} />
        </button>
      </div>

      {/* Gambar */}
      {item.image && (
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={getImageUrl(item.image)}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Konten */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center flex-wrap gap-2 mb-4">
          <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg flex items-center gap-1.5 ${catColor}`}>
            <Tag size={10} strokeWidth={2.5} />
            {catLabel}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Calendar size={12} />
            {new Date(item.publishedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Judul */}
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
          {item.title}
        </h1>

        <div className="w-16 h-1 bg-primary rounded-full mb-6" />

        {/* Body */}
        <article className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-[15px]">
          {item.content?.root?.children?.map((child: any, i: number) => {
            const renderTextNodes = (nodes: any[]): React.ReactNode[] => {
              return (nodes || []).map((c: any, ci: number) => {
                if (!c.text) return null;
                let el: React.ReactNode = c.text;
                if (c.format & 1) el = <strong key={ci}>{el}</strong>;
                if (c.format & 2) el = <em key={ci}>{el}</em>;
                if (c.format & 8) el = <u key={ci}>{el}</u>;
                if (c.format & 16) el = <code key={ci} className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-sm font-mono">{el}</code>;
                return <span key={ci}>{el}</span>;
              });
            };

            if (child.type === "paragraph") {
              const textContent = child.children?.map((c: any) => c.text || "").join("").trim();
              if (!textContent) return null;
              return (
                <p key={i} className="mb-4">
                  {renderTextNodes(child.children)}
                </p>
              );
            }

            if (child.type === "heading") {
              const Tag: any = child.tag || "h2";
              const sizeMap: Record<string, string> = {
                h1: "text-xl font-black",
                h2: "text-lg font-extrabold",
                h3: "text-base font-bold",
              };
              return (
                <Tag key={i} className={`${sizeMap[child.tag] || "text-base font-bold"} text-slate-900 dark:text-white mt-6 mb-3`}>
                  {renderTextNodes(child.children)}
                </Tag>
              );
            }

            if (child.type === "list") {
              const ListTag = child.listType === "number" ? "ol" : "ul";
              return (
                <ListTag
                  key={i}
                  className={`${child.listType === "number" ? "list-decimal" : "list-disc"} ml-6 mb-4 space-y-1`}
                >
                  {child.children?.map((li: any, liIdx: number) => (
                    <li key={liIdx} className="text-slate-700 dark:text-slate-300">
                      {renderTextNodes(li.children)}
                    </li>
                  ))}
                </ListTag>
              );
            }

            if (child.type === "upload" && child.value?.url) {
              return (
                <div key={i} className="my-6 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                  <img
                    src={child.value.url}
                    alt={child.value?.alt || ""}
                    className="w-full h-auto"
                  />
                  {child.value?.caption && (
                    <p className="text-[11px] text-center p-2 bg-slate-50 dark:bg-slate-800 text-slate-400">
                      {child.value.caption}
                    </p>
                  )}
                </div>
              );
            }

            if (child.type === "quote") {
              return (
                <blockquote key={i} className="border-l-4 border-primary pl-4 my-4 italic text-slate-600 dark:text-slate-400">
                  {renderTextNodes(child.children)}
                </blockquote>
              );
            }

            return null;
          })}
        </article>
      </div>

      {/* Kembali ke Berita */}
      <div className="px-6 pb-6">
        <Link
          href="/news"
          className="flex items-center gap-2 text-primary text-sm font-bold hover:underline"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Berita
        </Link>
      </div>
    </div>
  );
}
