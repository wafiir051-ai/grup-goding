import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CalendarDays, ChevronDown, ExternalLink, FileText, Folder, Search, X } from 'lucide-react';
import PageShell from './components/PageShell';
import { DOC_GROUPS, ENTRY_TYPES, PROJECT_STATUS } from './data/docs';

const STATUS_STYLE = {
  berjalan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
  selesai: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  jeda: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
};
const STATUS_DOT = { berjalan: 'bg-cyan-400', selesai: 'bg-emerald-400', jeda: 'bg-amber-400' };
const TYPE_STYLE = {
  rilis: 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300',
  fitur: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
  perbaikan: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  performa: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  catatan: 'bg-zinc-500/10 border-zinc-400/30 text-zinc-300',
};

// 'YYYY-MM-DD' dibaca sebagai tanggal lokal supaya tidak bergeser sehari karena zona waktu.
const parseDate = (s) => {
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
const fmtShort = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtMonth = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });
const shortDate = (s) => fmtShort.format(parseDate(s));
const monthLabel = (s) => fmtMonth.format(parseDate(s));

// Daftar datar semua project, masing-masing tahu nama grupnya.
const ALL_PROJECTS = DOC_GROUPS.flatMap((g) =>
  g.projects.map((p) => ({
    ...p,
    entries: [...(p.entries || [])].sort((a, b) => b.date.localeCompare(a.date)),
    group: { id: g.id, name: g.name },
  })),
);
const TOTAL_ENTRIES = ALL_PROJECTS.reduce((n, p) => n + p.entries.length, 0);
const projectHref = (p) => `/dokumentasi/${p.slug}`;
const lastDate = (p) => (p.entries.length ? p.entries[0].date : null);

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[status] || STATUS_STYLE.berjalan}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || STATUS_DOT.berjalan}`} />
      {PROJECT_STATUS[status] || status}
    </span>
  );
}

function TypeBadge({ type }) {
  const key = TYPE_STYLE[type] ? type : 'catatan';
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TYPE_STYLE[key]}`}>{ENTRY_TYPES[key]}</span>
  );
}

function Sidebar({ activeSlug, onNavigate }) {
  const [query, setQuery] = useState('');
  const [closed, setClosed] = useState({});
  const q = query.trim().toLowerCase();

  const groups = useMemo(
    () =>
      DOC_GROUPS.map((g) => ({
        ...g,
        projects: ALL_PROJECTS.filter(
          (p) =>
            p.group.id === g.id &&
            (!q || [p.name, p.summary, ...(p.stack || []), ...p.entries.map((e) => e.title)].join(' ').toLowerCase().includes(q)),
        ),
      })).filter((g) => !q || g.projects.length > 0),
    [q],
  );

  return (
    <nav aria-label="Daftar project" className="space-y-5">
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari project..."
          aria-label="Cari project"
          className="w-full bg-zinc-900/80 border border-white/10 focus:border-cyan-400/60 outline-none rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder:text-zinc-500"
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="Hapus pencarian" className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <a
        href="/dokumentasi"
        onClick={onNavigate}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${!activeSlug ? 'bg-white/5 text-cyan-300' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
      >
        <BookOpen className="w-4 h-4" /> Semua project
      </a>

      {groups.length === 0 && <p className="text-sm text-zinc-500 px-1">Tidak ada project yang cocok.</p>}

      {groups.map((g) => {
        const open = q ? true : !closed[g.id];
        return (
          <div key={g.id}>
            <button
              onClick={() => setClosed((c) => ({ ...c, [g.id]: !c[g.id] }))}
              aria-expanded={open}
              className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <span className="flex items-center gap-2 text-left">
                <Folder className="w-3.5 h-3.5 shrink-0" /> {g.name}
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="text-zinc-600 normal-case tracking-normal font-medium">{g.projects.length}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? '' : '-rotate-90'}`} />
              </span>
            </button>
            {open && (
              <ul className="mt-1 space-y-0.5">
                {g.projects.map((p) => {
                  const active = p.slug === activeSlug;
                  return (
                    <li key={p.slug}>
                      <a
                        href={projectHref(p)}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center gap-2.5 pl-4 pr-3 py-2 rounded-xl text-sm transition-colors ${active ? 'bg-cyan-500/10 text-cyan-200 font-semibold' : 'text-zinc-300 hover:text-white hover:bg-white/5'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[p.status] || STATUS_DOT.berjalan}`} />
                        <span className="flex-1 min-w-0 break-words">{p.name}</span>
                        <span className="text-xs text-zinc-600">{p.entries.length}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function Overview({ onNavigate }) {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Semua Project</h1>
      <p className="text-zinc-400 mb-8 max-w-2xl">
        Catatan pengerjaan dikelompokkan per grup, lalu per project. Pilih project untuk melihat perjalanan pengerjaannya dari yang terbaru.
      </p>
      <div className="space-y-12">
        {DOC_GROUPS.map((g) => {
          const projects = ALL_PROJECTS.filter((p) => p.group.id === g.id);
          return (
            <div key={g.id}>
              <div className="mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2.5">
                  <Folder className="w-5 h-5 text-cyan-400" /> {g.name}
                  <span className="text-sm font-medium text-zinc-500">{projects.length} project</span>
                </h2>
                {g.description && <p className="text-sm text-zinc-500 mt-1">{g.description}</p>}
              </div>
              {projects.length === 0 ? (
                <p className="text-sm text-zinc-600 border border-dashed border-white/10 rounded-2xl px-5 py-6">Belum ada project di grup ini.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((p) => (
                    <a
                      key={p.slug}
                      href={projectHref(p)}
                      onClick={onNavigate}
                      className="group flex flex-col bg-zinc-900/80 border border-white/10 hover:border-cyan-400/50 rounded-3xl p-5 sm:p-6 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-lg font-bold leading-snug break-words">{p.name}</h3>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-4">{p.summary}</p>
                      {p.stack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {p.stack.slice(0, 4).map((t) => (
                            <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">{t}</span>
                          ))}
                          {p.stack.length > 4 && <span className="text-xs px-2 py-1 text-zinc-500">+{p.stack.length - 4}</span>}
                        </div>
                      )}
                      <div className="mt-auto flex items-center justify-between text-xs text-zinc-500">
                        <span>
                          {p.entries.length} catatan{lastDate(p) ? ` · terakhir ${shortDate(lastDate(p))}` : ''}
                        </span>
                        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectView({ project }) {
  const [type, setType] = useState('semua');

  const typeCounts = project.entries.reduce((acc, e) => {
    const k = TYPE_STYLE[e.type] ? e.type : 'catatan';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const shown = type === 'semua' ? project.entries : project.entries.filter((e) => (TYPE_STYLE[e.type] ? e.type : 'catatan') === type);

  // Kelompokkan per bulan; entri sudah terurut dari yang terbaru.
  const months = [];
  shown.forEach((e) => {
    const key = e.date.slice(0, 7);
    let m = months[months.length - 1];
    if (!m || m.key !== key) {
      m = { key, label: monthLabel(e.date), items: [] };
      months.push(m);
    }
    m.items.push(e);
  });

  const first = project.entries.length ? project.entries[project.entries.length - 1].date : null;

  return (
    <div>
      <nav aria-label="Jejak halaman" className="text-sm text-zinc-500 mb-4 flex flex-wrap items-center gap-x-2">
        <a href="/dokumentasi" className="hover:text-cyan-400 transition-colors">Dokumentasi</a>
        <span>/</span>
        <span>{project.group.name}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight break-words">{project.name}</h1>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-zinc-400 max-w-2xl leading-relaxed mb-5">{project.summary}</p>

      {project.stack?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {project.stack.map((t) => (
            <span key={t} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">{t}</span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-2 bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-zinc-300">
          <FileText className="w-4 h-4 text-cyan-400" /> {project.entries.length} catatan
        </div>
        {first && (
          <div className="flex items-center gap-2 bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-zinc-300">
            <CalendarDays className="w-4 h-4 text-cyan-400" /> {shortDate(first)} – {shortDate(lastDate(project))}
          </div>
        )}
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors px-1">
            Buka project <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {project.entries.length === 0 ? (
        <p className="text-zinc-500 border border-dashed border-white/10 rounded-2xl px-5 py-10 text-center">
          Belum ada catatan pengerjaan untuk project ini.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter jenis catatan">
            {[['semua', 'Semua', project.entries.length], ...Object.keys(ENTRY_TYPES).filter((k) => typeCounts[k]).map((k) => [k, ENTRY_TYPES[k], typeCounts[k]])].map(([key, label, count]) => (
              <button
                key={key}
                onClick={() => setType(key)}
                aria-pressed={type === key}
                className={`text-sm font-medium px-3.5 py-1.5 rounded-full border transition-colors ${type === key ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200' : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/25'}`}
              >
                {label} <span className="text-zinc-500">{count}</span>
              </button>
            ))}
          </div>

          <div className="space-y-10">
            {months.map((m) => (
              <div key={m.key}>
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">{m.label}</h2>
                <ol className="border-l border-white/10 ml-1.5 space-y-4">
                  {m.items.map((e, i) => (
                    <motion.li
                      key={`${e.date}-${e.title}-${i}`}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '0px 0px -30px 0px' }}
                      transition={{ duration: 0.35 }}
                      className="relative pl-6"
                    >
                      <span className="absolute -left-[5px] top-6 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-[#0a0a0a]" />
                      <article className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
                          <time dateTime={e.date} className="text-xs font-medium text-zinc-500">{shortDate(e.date)}</time>
                          <TypeBadge type={e.type} />
                          {e.author && <span className="text-xs text-zinc-500">oleh {e.author}</span>}
                        </div>
                        <h3 className="font-bold text-white leading-snug mb-2">{e.title}</h3>
                        {[].concat(e.notes || []).length > 0 && (
                          <ul className="space-y-1.5">
                            {[].concat(e.notes).map((n) => (
                              <li key={n} className="flex items-start gap-2.5 text-sm text-zinc-400 leading-relaxed">
                                <span className="mt-2 w-1 h-1 rounded-full bg-cyan-400/70 shrink-0" />
                                <span>{n}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    </motion.li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function NotFound({ slug }) {
  return (
    <div className="text-center border border-dashed border-white/15 rounded-3xl px-6 py-16">
      <h1 className="text-2xl font-bold mb-2">Project tidak ditemukan</h1>
      <p className="text-zinc-400 mb-6">Tidak ada project dengan alamat “{slug}”. Mungkin namanya sudah diganti.</p>
      <a href="/dokumentasi" className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform">
        Lihat semua project
      </a>
    </div>
  );
}

export default function DocsPage({ path }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  let slug = '';
  try {
    slug = decodeURIComponent(path.replace(/^\/dokumentasi\/?/, '').split('/')[0] || '');
  } catch {
    slug = '';
  }
  const project = slug ? ALL_PROJECTS.find((p) => p.slug === slug) : null;
  const title = project ? `${project.name} — Dokumentasi Goding` : 'Dokumentasi — Goding';
  const closeMobile = () => setMobileOpen(false);

  return (
    <PageShell title={title}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-24">
        <div className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-4 border bg-cyan-500/10 border-cyan-500/20 text-cyan-400">
            <BookOpen className="w-4 h-4" /> DOKUMENTASI
          </div>
          <p className="text-sm text-zinc-500">
            {DOC_GROUPS.length} grup · {ALL_PROJECTS.length} project · {TOTAL_ENTRIES} catatan pengerjaan
          </p>
        </div>

        {ALL_PROJECTS.length === 0 ? (
          <div className="text-center border border-dashed border-white/15 rounded-3xl px-6 py-16">
            <h1 className="text-2xl font-bold mb-2">Belum ada dokumentasi</h1>
            <p className="text-zinc-400">Tambahkan project pertama di <code className="text-cyan-300">src/data/docs.js</code>.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
            <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2">
              <button
                onClick={() => setMobileOpen((o) => !o)}
                aria-expanded={mobileOpen}
                className="lg:hidden w-full flex items-center justify-between gap-3 bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm"
              >
                <span className="min-w-0 text-left">
                  <span className="block text-xs text-zinc-500">Project</span>
                  <span className="block font-semibold truncate">{project ? project.name : 'Semua project'}</span>
                </span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`${mobileOpen ? 'block mt-4' : 'hidden'} lg:block`}>
                <Sidebar activeSlug={project?.slug} onNavigate={closeMobile} />
              </div>
            </aside>

            <div className="min-w-0">
              {slug && !project ? (
                <NotFound slug={slug} />
              ) : project ? (
                <ProjectView key={project.slug} project={project} />
              ) : (
                <Overview onNavigate={closeMobile} />
              )}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
