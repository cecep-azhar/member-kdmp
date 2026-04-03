import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

async function getNewsBySlug(slug: string) {
  const baseApiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:3000";
  // Ensure we don't have double /api/api
  const apiUrl = baseApiUrl.endsWith('/api') ? baseApiUrl : `${baseApiUrl}/api`;
  
  try {
    const res = await fetch(`${apiUrl}/news?where[slug][equals]=${slug}&where[status][equals]=published`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs[0] || null;
  } catch (error) {
    console.error("Failed to fetch news detail:", error);
    return null;
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const item = await getNewsBySlug(params.slug);

  if (!item) {
    notFound();
  }

  const getImageUrl = (image: any) => {
    if (!image) return '';
    if (typeof image === 'object') return image.url;
    const baseApiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:3000";
    const serverUrl = baseApiUrl.replace('/api', '');
    return `${serverUrl}/media/${image}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 pb-20">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between">
        <Link href="/news" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group">
          <ArrowLeft size={20} className="group-active:-translate-x-1 transition-transform" />
        </Link>
        <span className="font-bold text-sm truncate px-4">Detail Berita</span>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <Share2 size={20} />
        </button>
      </div>

      {item.image && (
        <div className="relative w-full aspect-video overflow-hidden">
          <img 
            src={getImageUrl(item.image)} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-lg flex items-center gap-1.5 shadow-sm shadow-primary/10">
            <Tag size={12} strokeWidth={2.5} />
            {item.category}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Calendar size={12} />
            {new Date(item.publishedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
          {item.title}
        </h1>

        <article className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          {/* Enhanced content renderer for Lexical JSON */}
          {item.content?.root?.children?.map((child: any, i: number) => {
            // Helper to render text nodes
            const renderTextNodes = (nodes: any[]) => {
              return nodes?.map((c: any, ci: number) => {
                let text = c.text;
                let element = <span key={ci}>{text}</span>;
                
                if (c.format & 1) element = <strong key={ci}>{element}</strong>;
                if (c.format & 2) element = <em key={ci}>{element}</em>;
                if (c.format & 8) element = <u key={ci}>{element}</u>;
                
                return element;
              });
            };

            if (child.type === 'paragraph') {
              return <p key={i} className="mb-4">{renderTextNodes(child.children)}</p>;
            }
            if (child.type === 'heading') {
              const Tag: any = child.tag || 'h2';
              return <Tag key={i} className="font-bold text-slate-900 dark:text-white mt-6 mb-2">{renderTextNodes(child.children)}</Tag>;
            }
            if (child.type === 'list') {
              const ListTag = child.listType === 'number' ? 'ol' : 'ul';
              return (
                <ListTag key={i} className={`${child.listType === 'number' ? 'list-decimal' : 'list-disc'} ml-5 mb-4`}>
                  {child.children?.map((li: any, liIdx: number) => (
                    <li key={liIdx}>{renderTextNodes(li.children)}</li>
                  ))}
                </ListTag>
              );
            }
            if (child.type === 'upload') {
              return (
                <div key={i} className="my-6 rounded-xl overflow-hidden border border-slate-100">
                  <img src={child.value?.url} alt={child.value?.alt || ''} className="w-full h-auto" />
                  {child.value?.caption && <p className="text-[10px] text-center p-2 bg-slate-50 text-slate-400">{child.value.caption}</p>}
                </div>
              );
            }
            return null;
          })}
        </article>
      </div>
    </div>
  );
}
