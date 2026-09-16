import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ArrowRight, ArrowLeft, Send, CheckCircle2, Globe, Smartphone, Layers, Server, RefreshCw, Package, Sparkles, FileText, Wallet, Clock, User,
} from 'lucide-react';
import { Container, Button, Section } from '@/shared/ui';
import { insertQuotation } from '@/features/content/infrastructure/content_api';

const steps = [
  { num: 1, label: 'Type', icon: Layers },
  { num: 2, label: 'Description', icon: FileText },
  { num: 3, label: 'Fonctionnalités', icon: Sparkles },
  { num: 4, label: 'Budget', icon: Wallet },
  { num: 5, label: 'Délais', icon: Clock },
  { num: 6, label: 'Coordonnées', icon: User },
];

const projectTypes = [
  { value: 'website', label: 'Site web', icon: Globe, desc: 'Sites corporate, landing pages' },
  { value: 'webapp', label: 'Application web', icon: Layers, desc: 'Dashboards, plateformes' },
  { value: 'mobile', label: 'Application mobile', icon: Smartphone, desc: 'iOS, Android, cross-platform' },
  { value: 'saas', label: 'SaaS', icon: Server, desc: 'Logiciel en ligne' },
  { value: 'api', label: 'API', icon: Server, desc: 'Backend, intégrations' },
  { value: 'refonte', label: 'Refonte', icon: RefreshCw, desc: 'Modernisation' },
  { value: 'logiciel', label: 'Logiciel métier', icon: Package, desc: 'Outils sur mesure' },
  { value: 'autre', label: 'Autre', icon: ArrowRight, desc: 'Un autre besoin' },
];

const budgetRanges = [
  { value: 'less-1m', label: 'Moins de 1M FCFA', desc: 'Petit projet' },
  { value: '1m-5m', label: '1M — 5M FCFA', desc: 'Projet standard' },
  { value: '5m-10m', label: '5M — 10M FCFA', desc: 'Projet avancé' },
  { value: '10m-plus', label: 'Plus de 10M FCFA', desc: 'Grand projet' },
  { value: 'discuss', label: 'À discuter', desc: 'À définir ensemble' },
];

const timelineOptions = [
  { value: 'urgent', label: 'Urgent', desc: 'Moins de 2 mois' },
  { value: '2-4m', label: '2 — 4 mois', desc: 'Délai court' },
  { value: '4-6m', label: '4 — 6 mois', desc: 'Délai standard' },
  { value: '6m-plus', label: 'Plus de 6 mois', desc: 'Délai flexible' },
  { value: 'flexible', label: 'Flexible', desc: 'Pas de date fixe' },
];

const fieldClass = 'w-full rounded-2xl border border-ink-200 bg-white px-4 text-sm text-ink-900 placeholder:text-ink-400 transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';
const labelClass = 'block text-sm font-medium text-ink-700 mb-2';

export function QuotationPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<Record<string, string>>({});

  const next = () => setStep((s) => Math.min(s + 1, steps.length));
  const prev = () => setStep((s) => Math.max(s - 1, 1));
  const update = (key: string, value: string) => setData((d) => ({ ...d, [key]: value }));

  const submit = async () => {
    try {
      await insertQuotation({
        project_type: data.projectType ?? '',
        description: data.description ?? '',
        features: data.features ?? '',
        budget: data.budget ?? '',
        timeline: data.timeline ?? '',
        name: data.name ?? '',
        company: data.company ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
      });
      setSubmitted(true);
    } catch {
      // keep user on the form if submit fails
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!data.projectType;
      case 2: return (data.description?.length ?? 0) >= 10;
      case 3: return (data.features?.length ?? 0) >= 3;
      case 4: return !!data.budget;
      case 5: return !!data.timeline;
      case 6: return !!data.name && !!data.email;
      default: return false;
    }
  };

  const getSummary = () => {
    const items: { label: string; value: string }[] = [];
    if (data.projectType) {
      const pt = projectTypes.find((p) => p.value === data.projectType);
      if (pt) items.push({ label: 'Type de projet', value: pt.label });
    }
    if (data.description) items.push({ label: 'Description', value: data.description.length > 60 ? data.description.slice(0, 60) + '...' : data.description });
    if (data.features) items.push({ label: 'Fonctionnalités', value: data.features.length > 60 ? data.features.slice(0, 60) + '...' : data.features });
    if (data.budget) {
      const b = budgetRanges.find((r) => r.value === data.budget);
      if (b) items.push({ label: 'Budget', value: b.label });
    }
    if (data.timeline) {
      const t = timelineOptions.find((o) => o.value === data.timeline);
      if (t) items.push({ label: 'Délai', value: `${t.label} — ${t.desc}` });
    }
    if (data.name) items.push({ label: 'Nom', value: data.name });
    if (data.email) items.push({ label: 'Email', value: data.email });
    return items;
  };

  if (submitted) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center bg-ink-50/50 pt-20">
        <Container size="narrow">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 rounded-3xl bg-white border border-ink-100 shadow-premium">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-ink-900 mb-3">Demande envoyée !</h1>
            <p className="text-ink-500 leading-relaxed mb-8 max-w-md mx-auto">
              Merci pour votre demande de devis. Notre équipe l'étudie et vous contacte sous 24h avec une proposition adaptée.
            </p>
            <Button to="/" variant="primary" size="lg">Retour à l'accueil</Button>
          </motion.div>
        </Container>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white min-h-[300px] lg:min-h-[380px] flex items-center">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary-600/20 blur-[120px]" />
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-primary-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-300">Demande de devis</span>
            </div>
            <h1 className="text-display-md font-extrabold text-balance">Construisons votre <span className="text-gradient-light">projet ensemble</span></h1>
            <p className="mt-4 text-lg text-ink-300 leading-relaxed">Répondez à quelques questions pour recevoir une proposition adaptée.</p>
          </motion.div>
        </Container>
      </section>

      <Section className="-mt-8 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Main form area */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-ink-100 bg-white shadow-premium overflow-hidden">
              {/* Progress bar */}
              <div className="border-b border-ink-100 px-6 lg:px-8 pt-6 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-400">Étape {step} sur {steps.length}</span>
                  <span className="text-xs font-semibold text-primary-600">{Math.round((step / steps.length) * 100)}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {steps.map((s) => (
                    <div key={s.num} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step > s.num ? 'bg-primary-600' : step === s.num ? 'bg-primary-500' : 'bg-ink-100'}`} />
                  ))}
                </div>
              </div>

              <div className="p-6 lg:p-8 min-h-[380px]">
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    {step === 1 && (
                      <div>
                        <h2 className="text-2xl font-bold text-ink-900 mb-1">Quel type de projet ?</h2>
                        <p className="text-sm text-ink-500 mb-6">Sélectionnez la catégorie qui correspond le mieux à votre besoin.</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {projectTypes.map((type) => (
                            <button key={type.value} onClick={() => update('projectType', type.value)}
                              className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300 ${data.projectType === type.value ? 'border-primary-500 bg-primary-50/50' : 'border-ink-100 hover:border-ink-300 hover:bg-ink-50/50'}`}>
                              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all ${data.projectType === type.value ? 'bg-primary-600 text-white' : 'bg-ink-100 text-ink-500'}`}>
                                <type.icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <span className={`block text-sm font-bold ${data.projectType === type.value ? 'text-primary-700' : 'text-ink-900'}`}>{type.label}</span>
                                <span className="text-xs text-ink-400 mt-0.5">{type.desc}</span>
                              </div>
                              {data.projectType === type.value && <Check className="h-5 w-5 text-primary-600 flex-shrink-0 ml-auto" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <h2 className="text-2xl font-bold text-ink-900 mb-1">Décrivez votre besoin</h2>
                        <p className="text-sm text-ink-500 mb-6">Plus vous nous en dites, plus notre proposition sera précise.</p>
                        <label className={labelClass}>Description du projet *</label>
                        <textarea rows={7} placeholder="Décrivez votre projet, vos objectifs, le contexte..." value={data.description ?? ''} onChange={(e) => update('description', e.target.value)} className={`${fieldClass} resize-none`} />
                        <p className="mt-2 text-xs text-ink-400">{(data.description?.length ?? 0)} caractères — minimum 10 requis</p>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <h2 className="text-2xl font-bold text-ink-900 mb-1">Quelles fonctionnalités ?</h2>
                        <p className="text-sm text-ink-500 mb-6">Listez les fonctionnalités principales souhaitées.</p>
                        <label className={labelClass}>Fonctionnalités attendues *</label>
                        <textarea rows={7} placeholder="Ex: authentification, paiement en ligne, tableau de bord, API..." value={data.features ?? ''} onChange={(e) => update('features', e.target.value)} className={`${fieldClass} resize-none`} />
                        <p className="mt-2 text-xs text-ink-400">Une fonctionnalité par ligne pour plus de clarté</p>
                      </div>
                    )}

                    {step === 4 && (
                      <div>
                        <h2 className="text-2xl font-bold text-ink-900 mb-1">Quel est votre budget ?</h2>
                        <p className="text-sm text-ink-500 mb-6">Une estimation nous aide à calibrer la solution.</p>
                        <div className="space-y-3">
                          {budgetRanges.map((range) => (
                            <button key={range.value} onClick={() => update('budget', range.value)}
                              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${data.budget === range.value ? 'border-primary-500 bg-primary-50/50' : 'border-ink-100 hover:border-ink-300'}`}>
                              <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${data.budget === range.value ? 'border-primary-600 bg-primary-600' : 'border-ink-300'}`}>
                                {data.budget === range.value && <Check className="h-3.5 w-3.5 text-white" />}
                              </div>
                              <div className="text-left">
                                <span className={`block text-sm font-bold ${data.budget === range.value ? 'text-primary-700' : 'text-ink-900'}`}>{range.label}</span>
                                <span className="text-xs text-ink-400">{range.desc}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 5 && (
                      <div>
                        <h2 className="text-2xl font-bold text-ink-900 mb-1">Quels sont vos délais ?</h2>
                        <p className="text-sm text-ink-500 mb-6">Quand souhaitez-vous que le projet soit livré ?</p>
                        <div className="space-y-3">
                          {timelineOptions.map((opt) => (
                            <button key={opt.value} onClick={() => update('timeline', opt.value)}
                              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${data.timeline === opt.value ? 'border-primary-500 bg-primary-50/50' : 'border-ink-100 hover:border-ink-300'}`}>
                              <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${data.timeline === opt.value ? 'border-primary-600 bg-primary-600' : 'border-ink-300'}`}>
                                {data.timeline === opt.value && <Check className="h-3.5 w-3.5 text-white" />}
                              </div>
                              <div className="text-left">
                                <span className={`block text-sm font-bold ${data.timeline === opt.value ? 'text-primary-700' : 'text-ink-900'}`}>{opt.label}</span>
                                <span className="text-xs text-ink-400">{opt.desc}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 6 && (
                      <div>
                        <h2 className="text-2xl font-bold text-ink-900 mb-1">Vos coordonnées</h2>
                        <p className="text-sm text-ink-500 mb-6">Comment pouvons-nous vous contacter ?</p>
                        <div className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className={labelClass}>Nom *</label>
                              <input type="text" placeholder="Votre nom" value={data.name ?? ''} onChange={(e) => update('name', e.target.value)} className={`${fieldClass} h-12`} />
                            </div>
                            <div>
                              <label className={labelClass}>Entreprise</label>
                              <input type="text" placeholder="Nom de l'entreprise" value={data.company ?? ''} onChange={(e) => update('company', e.target.value)} className={`${fieldClass} h-12`} />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className={labelClass}>Email *</label>
                              <input type="email" placeholder="vous@entreprise.com" value={data.email ?? ''} onChange={(e) => update('email', e.target.value)} className={`${fieldClass} h-12`} />
                            </div>
                            <div>
                              <label className={labelClass}>Téléphone</label>
                              <input type="tel" placeholder="+225 ..." value={data.phone ?? ''} onChange={(e) => update('phone', e.target.value)} className={`${fieldClass} h-12`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="px-6 lg:px-8 py-5 border-t border-ink-100 bg-ink-50/50 flex items-center justify-between">
                {step > 1 ? (
                  <Button onClick={prev} variant="ghost" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>Précédent</Button>
                ) : <div />}
                {step < steps.length ? (
                  <Button onClick={next} variant="primary" size="md" disabled={!canProceed()} rightIcon={<ArrowRight className="h-4 w-4" />}>Continuer</Button>
                ) : (
                  <Button onClick={submit} variant="primary" size="md" leftIcon={<Send className="h-4 w-4" />}>Envoyer ma demande</Button>
                )}
              </div>
            </div>
          </div>

          {/* Summary panel */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 rounded-3xl bg-ink-900 text-white p-6 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 h-[150px] w-[150px] rounded-full bg-primary-600/15 blur-[60px] pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">Récapitulatif</h3>
                </div>

                {getSummary().length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mx-auto mb-4">
                      <Sparkles className="h-7 w-7 text-ink-500" />
                    </div>
                    <p className="text-sm text-ink-400 leading-relaxed">Vos réponses apparaîtront ici au fil des étapes</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {getSummary().map((item, i) => (
                        <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-500 mb-1">{item.label}</p>
                          <p className="text-sm font-medium text-white leading-snug">{item.value}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {steps.slice(0, step).map((s) => (
                        <div key={s.num} className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 border-2 border-ink-900">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-ink-400">{step} sur {steps.length} étapes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
