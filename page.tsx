'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, ExternalLink, Filter, Search, Zap, Mail, Store, TrendingDown, Settings, CheckCircle2, Server, ShieldCheck, Smartphone, RefreshCw } from 'lucide-react';
import { currency } from '@/lib/rules';

type EnrichedDeal = {
  product: string; store: string; category: string; brand: string; normalPrice: number; dealPrice: number; stock: string; url: string; reason?: string;
  discount: number; rule: number; score: number; priority: string; savings: number; qualifies: boolean;
};

const alertEmail = 'commandelectricma@gmail.com';
const stores = ['All', 'Home Depot', 'Lowe’s', 'Amazon', 'SupplyHouse', 'Grainger', 'Acme Tools', 'Zoro'];
const categories = ['All', 'Tools', 'Batteries', 'Breakers', 'GFCI/AFCI', 'Wire/Cable', 'Connectors', 'Bath Fans', 'Ceiling Fans', 'Lighting', 'Supplies'];
const brands = ['All', 'Milwaukee', 'DeWalt', 'Klein', 'Fluke', 'Southwire', 'Leviton', 'Lutron', 'Square D', 'Eaton', 'Siemens', 'Panasonic', 'Arlington'];

export default function Page() {
  const [query, setQuery] = useState('');
  const [store, setStore] = useState('All');
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [minScore, setMinScore] = useState(70);
  const [deals, setDeals] = useState<EnrichedDeal[]>([]);
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadDeals() {
    setLoading(true);
    const res = await fetch('/api/deals', { cache: 'no-store' });
    const data = await res.json();
    setDeals(data.deals || []);
    setUpdatedAt(data.updatedAt || new Date().toISOString());
    setLoading(false);
  }

  useEffect(() => { loadDeals(); }, []);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const q = query.toLowerCase();
      return (deal.product.toLowerCase().includes(q) || deal.brand.toLowerCase().includes(q)) &&
        (store === 'All' || deal.store === store) &&
        (category === 'All' || deal.category === category) &&
        (brand === 'All' || deal.brand === brand) &&
        deal.score >= minScore;
    });
  }, [query, store, category, brand, minScore, deals]);

  const bestDeal = filteredDeals[0];
  const totalSavings = filteredDeals.reduce((sum, deal) => sum + deal.savings, 0);

  async function sendTestAlert() {
    await fetch('/api/alert', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deals: filteredDeals.slice(0, 10) }) });
    alert('Email alert request sent. If RESEND_API_KEY is not configured, check the API response/logs for preview mode.');
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-slate-950 p-6 md:p-8 text-white shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm"><Zap size={16} /> Command Electric private dashboard</div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Command Electric Deal Hunter</h1>
              <p className="mt-3 max-w-2xl text-slate-300">Deep-deal dashboard for electrical supplies, tools, batteries, breakers, fans, GFCI/AFCI, cable, connectors and job-ready material. Ranked by BUY NOW Score.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="flex items-center gap-2 font-semibold"><Mail size={18} /> Email Alerts</div>
              <p className="mt-1 text-sm text-slate-300">{alertEmail}</p>
              <button onClick={sendTestAlert} className="mt-3 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950">Send test alert</button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <Card icon={<Store />} title="Tracked stores" value="7" note="Home Depot, Lowe’s, Amazon + suppliers" />
          <Card icon={<TrendingDown />} title="Deep deals found" value={String(filteredDeals.length)} note="Filtered by rules + score" />
          <Card icon={<CheckCircle2 />} title="Best score now" value={bestDeal ? String(bestDeal.score) : '—'} note="BUY NOW Score /100" />
          <Card icon={<Bell />} title="Possible savings" value={currency(totalSavings)} note="Across visible deals" />
        </section>

        <section className="rounded-3xl bg-white p-5 shadow">
          <div className="mb-4 flex items-center justify-between gap-2 font-semibold">
            <div className="flex items-center gap-2"><Filter size={18} /> Filters</div>
            <button onClick={loadDeals} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"><RefreshCw size={14} /> {loading ? 'Loading...' : 'Refresh'}</button>
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            <div className="relative md:col-span-2"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-slate-300" placeholder="Search breaker, Milwaukee, GFCI, Romex..." /></div>
            <Select value={store} onChange={setStore} options={stores} />
            <Select value={category} onChange={setCategory} options={categories} />
            <Select value={brand} onChange={setBrand} options={brands} />
          </div>
          <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold">Minimum BUY NOW Score: {minScore}/100</p><p className="text-sm text-slate-500">70+ deep deals, 80+ serious buys, 90+ urgent buys.</p></div><input className="w-full md:w-72" type="range" min="70" max="95" step="5" value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} /></div>
          <p className="mt-3 text-xs text-slate-400">Updated: {updatedAt ? new Date(updatedAt).toLocaleString() : '—'}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Info icon={<Server />} title="Live Data Ready" text="API endpoints are ready. Add provider keys in Vercel Environment Variables to turn on live data." />
          <Info icon={<ShieldCheck />} title="Deep Deal Logic" text="Category thresholds, score calculation and noise filtering are built in." />
          <Info icon={<Smartphone />} title="iPhone Use" text="Open Vercel link in Safari, tap Share, then Add to Home Screen." />
        </section>

        <section className="grid gap-4">
          {filteredDeals.length === 0 && <div className="rounded-3xl bg-white p-8 text-center shadow"><p className="text-xl font-bold">No deep deals match these filters.</p><p className="mt-2 text-slate-500">Lower the score or change filters to see more opportunities.</p></div>}
          {filteredDeals.map((deal) => <DealCard key={`${deal.store}-${deal.product}`} deal={deal} />)}
        </section>
      </div>
    </div>
  );
}

function Card({ icon, title, value, note }: any) { return <div className="rounded-3xl bg-white p-5 shadow"><div className="mb-3 text-slate-500">{icon}</div><p className="text-sm text-slate-500">{title}</p><p className="mt-1 text-3xl font-bold">{value}</p><p className="mt-1 text-sm text-slate-500">{note}</p></div>; }
function Info({ icon, title, text }: any) { return <div className="rounded-3xl bg-white p-5 shadow"><div className="flex items-center gap-2 font-semibold">{icon}{title}</div><p className="mt-2 text-sm text-slate-500">{text}</p></div>; }
function Select({ value, onChange, options }: any) { return <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-300">{options.map((o: string) => <option key={o}>{o}</option>)}</select>; }
function DealCard({ deal }: { deal: EnrichedDeal }) { return <article className="rounded-3xl bg-white p-5 shadow transition hover:shadow-lg"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="space-y-2"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">{deal.store}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">{deal.category}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">{deal.brand}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">{deal.stock}</span></div><h2 className="text-xl font-bold">{deal.product}</h2><p className="max-w-2xl text-slate-600">{deal.reason}</p><p className="text-sm text-slate-500">Rule: appears only at {deal.rule}%+ off. This deal is {deal.discount}% off.</p></div><div className="min-w-64 rounded-2xl border border-slate-200 p-4 text-right"><p className="text-sm text-slate-500 line-through">Normal {currency(deal.normalPrice)}</p><p className="text-3xl font-bold">{currency(deal.dealPrice)}</p><p className="font-semibold text-slate-700">Save {currency(deal.savings)} · {deal.discount}% OFF</p><div className="mt-3 flex gap-2"><button className="flex-1 rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white">{deal.priority} · {deal.score}/100</button><a href={deal.url} className="rounded-xl border border-slate-200 px-3 py-2"><ExternalLink size={16} /></a></div></div></div></article>; }
