"use client";

import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Globe, Users, Target, Heart, Star, Clock, ChevronDown, ChevronUp, Building2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:3000/api";

export default function InfoPage() {
  const [settings, setSettings] = useState<any>(null);
  const [boardMembers, setBoardMembers] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>("visi");

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, boardRes] = await Promise.all([
          fetch(`${API_URL}/globals/settings`),
          fetch(`${API_URL}/board-members?limit=20`).catch(() => ({ ok: false })),
        ]);
        if (settingsRes.ok) setSettings(await settingsRes.json());
        if ((boardRes as Response).ok) {
          const bd = await (boardRes as Response).json();
          setBoardMembers(bd.docs || []);
        }
      } catch (err) {
        console.error("Failed to fetch info data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggle = (key: string) => setOpenSection(openSection === key ? null : key);

  const infoSections = [
    {
      key: "visi",
      icon: Target,
      title: "Visi & Misi",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-sm mb-2">Visi</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Mewujudkan koperasi yang sehat, transparan, dan mandiri untuk meningkatkan kesejahteraan anggota dan masyarakat desa.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-sm mb-2">Misi</h4>
            <ul className="space-y-2">
              {[
                "Menghimpun dan mengelola simpanan anggota secara profesional",
                "Menyediakan layanan pinjaman yang mudah, cepat, dan berkeadilan",
                "Meningkatkan literasi keuangan anggota koperasi",
                "Menjalankan prinsip koperasi: kebersamaan, gotong royong, dan transparansi",
                "Berkontribusi pada pemberdayaan ekonomi masyarakat desa",
              ].map((misi, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {misi}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: "prinsip",
      icon: Heart,
      title: "Nilai & Prinsip",
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: "🤝", label: "Gotong Royong", desc: "Bersama demi kemajuan" },
            { emoji: "🔍", label: "Transparansi", desc: "Terbuka dan jujur" },
            { emoji: "⚖️", label: "Keadilan", desc: "Merata untuk semua" },
            { emoji: "💪", label: "Kemandirian", desc: "Berdaya sendiri" },
            { emoji: "🌱", label: "Keberlanjutan", desc: "Jangka panjang" },
            { emoji: "📚", label: "Edukasi", desc: "Tingkatkan literasi" },
          ].map((p) => (
            <div key={p.label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <span className="text-2xl">{p.emoji}</span>
              <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">{p.label}</p>
              <p className="text-xs text-slate-400">{p.desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "layanan",
      icon: Star,
      title: "Layanan Koperasi",
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      content: (
        <div className="space-y-3">
          {[
            { name: "Simpanan Pokok", desc: "Simpanan awal saat menjadi anggota, tidak dapat ditarik selama masih menjadi anggota" },
            { name: "Simpanan Wajib", desc: "Simpanan rutin bulanan yang wajib dibayarkan oleh setiap anggota" },
            { name: "Simpanan Sukarela", desc: "Simpanan tambahan sukarela yang dapat ditarik kapan saja sesuai kebutuhan" },
            { name: "Pinjaman Anggota", desc: "Pinjaman dengan bunga ringan untuk kebutuhan produktif maupun konsumtif" },
          ].map((s) => (
            <div key={s.name} className="flex gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 flex-shrink-0">
                ★
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{s.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "jam",
      icon: Clock,
      title: "Jam Operasional",
      color: "text-teal-600",
      bg: "bg-teal-50 dark:bg-teal-900/20",
      content: (
        <div className="space-y-2">
          {[
            { hari: "Senin – Jumat", jam: "08.00 – 16.00 WIB" },
            { hari: "Sabtu", jam: "08.00 – 12.00 WIB" },
            { hari: "Minggu & Hari Libur", jam: "Tutup" },
          ].map((j) => (
            <div key={j.hari} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{j.hari}</span>
              <span className={`text-sm font-black ${j.jam === "Tutup" ? "text-rose-500" : "text-teal-600 dark:text-teal-400"}`}>
                {j.jam}
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700 px-6 pt-10 pb-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-[20px] bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg">
            <Building2 size={32} />
          </div>
          <h1 className="text-2xl font-black leading-tight mb-1">
            {settings?.appName || "Koperasi Desa Merah Putih"}
          </h1>
          <p className="text-white/70 text-sm font-medium">Melayani Dengan Hati, Tumbuh Bersama</p>
        </div>
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 left-8 h-32 w-32 rounded-full bg-violet-400/20 blur-xl" />
      </div>

      <div className="p-5 space-y-4">
        {/* Kontak */}
        <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-slate-900 dark:text-white text-sm">Informasi Kontak</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              { icon: MapPin, label: "Alamat", value: "Jl. Desa Merah Putih No. 1, Kecamatan Setempat, Kab/Kota" },
              { icon: Phone, label: "Telepon", value: "(021) 1234-5678" },
              { icon: Mail, label: "Email", value: "info@kdmp-koperasi.id" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4 px-5 py-4">
                <div className="w-9 h-9 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 flex-shrink-0">
                  <c.icon size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{c.label}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accordion Sections */}
        {infoSections.map((section) => {
          const Icon = section.icon;
          const isOpen = openSection === section.key;
          return (
            <div
              key={section.key}
              className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(section.key)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${section.bg} flex items-center justify-center`}>
                    <Icon size={20} className={section.color} />
                  </div>
                  <span className="font-black text-slate-900 dark:text-white text-sm">{section.title}</span>
                </div>
                {isOpen ? (
                  <ChevronUp size={18} className="text-slate-400" />
                ) : (
                  <ChevronDown size={18} className="text-slate-400" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}

        {/* Pengurus (jika ada data) */}
        {boardMembers.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Users size={20} className="text-purple-600" />
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">Pengurus Koperasi</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {boardMembers.map((bm: any) => (
                <div key={bm.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {bm.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{bm.name}</p>
                    <p className="text-xs text-slate-400">{bm.position || bm.role || "Pengurus"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jika pengurus tidak ada dari API, tampilkan placeholder */}
        {boardMembers.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Users size={20} className="text-purple-600" />
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">Pengurus Koperasi</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { jabatan: "Ketua", nama: "Data dari Admin" },
                { jabatan: "Sekretaris", nama: "Data dari Admin" },
                { jabatan: "Bendahara", nama: "Data dari Admin" },
              ].map((p) => (
                <div key={p.jabatan} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {p.jabatan.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{p.jabatan}</p>
                    <p className="text-xs text-slate-400 italic">{p.nama}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
