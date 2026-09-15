import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, Trash2, X, CheckCircle2, Clock } from 'lucide-react';
import { useContentStore } from '@/features/content/presentation/store/content_store';
import { Button } from '@/shared/ui';
import type { QuotationRequest } from '@/features/content/domain/entities/content';

function formatDate(date: string) { return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }

const budgetLabels: Record<string, string> = { 'less-1m': 'Moins de 1M FCFA', '1m-5m': '1M — 5M FCFA', '5m-10m': '5M — 10M FCFA', '10m-plus': 'Plus de 10M FCFA', discuss: 'À discuter' };
const timelineLabels: Record<string, string> = { urgent: 'Urgent (< 2 mois)', '2-4m': '2 — 4 mois', '4-6m': '4 — 6 mois', '6m-plus': 'Plus de 6 mois', flexible: 'Flexible' };

export function AdminQuotationsPage() {
  const quotations = useContentStore((s) => s.quotations);
  const updateQuotationStatus = useContentStore((s) => s.updateQuotationStatus);
  const deleteQuotation = useContentStore((s) => s.deleteQuotation);
  const [selected, setSelected] = useState<QuotationRequest | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'processed'>('all');

  const filtered = filter === 'all' ? quotations : quotations.filter((q) => q.status === filter);

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-ink-900">Demandes de devis</h2><p className="text-sm text-ink-500 mt-1">Demandes reçues via le formulaire de devis</p></div>

      <div className="flex items-center gap-2">
        {(['all', 'new', 'processed'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${filter === f ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:border-ink-300'}`}>
            {f === 'all' ? 'Toutes' : f === 'new' ? 'Nouvelles' : 'Traitées'} {f === 'new' && quotations.filter((q) => q.status === 'new').length > 0 && <span className="ml-1 px-1.5 py-0.5 rounded bg-primary-500 text-white text-[10px]">{quotations.filter((q) => q.status === 'new').length}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-ink-100 bg-white"><FileCheck className="h-12 w-12 text-ink-300 mx-auto mb-3" /><p className="text-ink-500">Aucune demande de devis</p></div>
      ) : (
        <div className="rounded-2xl border border-ink-100 bg-white overflow-hidden">
          <div className="divide-y divide-ink-100">
            {filtered.map((q, i) => (
              <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }} className="flex items-center gap-4 p-5 hover:bg-ink-50/50 transition-colors cursor-pointer" onClick={() => setSelected(q)}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 ${q.status === 'new' ? 'bg-secondary-50 text-secondary-600' : 'bg-green-50 text-green-600'}`}>
                  {q.status === 'new' ? <Clock className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="text-sm font-semibold text-ink-900">{q.name}</p>{q.status === 'new' && <span className="px-2 py-0.5 rounded bg-secondary-100 text-secondary-700 text-[10px] font-bold uppercase">Nouveau</span>}</div>
                  <p className="text-xs text-ink-500 truncate mt-0.5">{q.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-ink-400"><span>{q.email}</span><span>{q.project_type}</span><span>{budgetLabels[q.budget] ?? q.budget}</span><span>{formatDate(q.created_at)}</span></div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteQuotation(q.id); }} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600"><FileCheck className="h-6 w-6" /></div><div><h3 className="text-lg font-bold text-ink-900">{selected.name}</h3><p className="text-sm text-ink-500">{selected.email}</p></div></div><button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400"><X className="h-5 w-5" /></button></div>
              <div className="space-y-3 text-sm">
                {selected.company && <div><span className="text-ink-400 font-medium">Entreprise:</span> <span className="text-ink-900">{selected.company}</span></div>}
                {selected.phone && <div><span className="text-ink-400 font-medium">Téléphone:</span> <span className="text-ink-900">{selected.phone}</span></div>}
                <div><span className="text-ink-400 font-medium">Type de projet:</span> <span className="text-ink-900">{selected.project_type}</span></div>
                <div><span className="text-ink-400 font-medium">Budget:</span> <span className="text-ink-900">{budgetLabels[selected.budget] ?? selected.budget}</span></div>
                <div><span className="text-ink-400 font-medium">Délai:</span> <span className="text-ink-900">{timelineLabels[selected.timeline] ?? selected.timeline}</span></div>
                <div><span className="text-ink-400 font-medium">Date:</span> <span className="text-ink-900">{formatDate(selected.created_at)}</span></div>
                <div className="pt-3 border-t border-ink-100"><div className="text-ink-400 font-medium mb-1">Description:</div><p className="text-ink-700 leading-relaxed">{selected.description}</p></div>
                {selected.features && <div className="pt-3 border-t border-ink-100"><div className="text-ink-400 font-medium mb-1">Fonctionnalités souhaitées:</div><p className="text-ink-700 leading-relaxed whitespace-pre-wrap">{selected.features}</p></div>}
              </div>
              <div className="flex gap-3 mt-6">
                <a href={`mailto:${selected.email}`}><Button variant="primary" size="md">Répondre</Button></a>
                {selected.status === 'new' && <Button variant="outline" size="md" leftIcon={<CheckCircle2 className="h-4 w-4" />} onClick={() => { updateQuotationStatus(selected.id, 'processed'); setSelected(null); }}>Marquer comme traité</Button>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
