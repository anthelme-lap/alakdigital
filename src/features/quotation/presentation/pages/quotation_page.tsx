import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Send, CheckCircle2, Globe, Smartphone, Layers, Server, RefreshCw, Package } from 'lucide-react';
import { Container, Input, Textarea, Button, Section } from '@/shared/ui';

const steps = [
  { num: 1, label: 'Type de projet' },
  { num: 2, label: 'Description' },
  { num: 3, label: 'Fonctionnalités' },
  { num: 4, label: 'Budget' },
  { num: 5, label: 'Délais' },
  { num: 6, label: 'Coordonnées' },
];

const projectTypes = [
  { value: 'website', label: 'Site web', icon: Globe },
  { value: 'webapp', label: 'Application web', icon: Layers },
  { value: 'mobile', label: 'Application mobile', icon: Smartphone },
  { value: 'saas', label: 'SaaS', icon: Layers },
  { value: 'api', label: 'API', icon: Server },
  { value: 'refonte', label: 'Refonte', icon: RefreshCw },
  { value: 'logiciel', label: 'Logiciel métier', icon: Package },
  { value: 'autre', label: 'Autre', icon: ArrowRight },
];

const budgetRanges = [
  { value: 'less-1m', label: 'Moins de 1M FCFA' },
  { value: '1m-5m', label: '1M — 5M FCFA' },
  { value: '5m-10m', label: '5M — 10M FCFA' },
  { value: '10m-plus', label: 'Plus de 10M FCFA' },
  { value: 'discuss', label: 'À discuter' },
];

const timelineOptions = [
  { value: 'urgent', label: 'Urgent (moins de 2 mois)' },
  { value: '2-4m', label: '2 — 4 mois' },
  { value: '4-6m', label: '4 — 6 mois' },
  { value: '6m-plus', label: 'Plus de 6 mois' },
  { value: 'flexible', label: 'Flexible' },
];

export function QuotationPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<Record<string, string>>({});

  const next = () => setStep((s) => Math.min(s + 1, steps.length));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const update = (key: string, value: string) => setData((d) => ({ ...d, [key]: value }));

  const submit = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
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

  if (submitted) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center bg-ink-50/50 pt-20">
        <Container size="narrow">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 rounded-3xl bg-white border border-ink-100 shadow-premium">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-ink-900 mb-3">Demande envoyée !</h1>
            <p className="text-ink-500 leading-relaxed mb-8 max-w-md mx-auto">
              Merci pour votre demande de devis. Notre équipe l'étudie et vous recontacte sous 24h
              avec une proposition adaptée.
            </p>
            <Button to="/" variant="primary" size="lg">Retour à l'accueil</Button>
          </motion.div>
        </Container>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white pt-20 pb-20 lg:pt-28 lg:pb-24">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary-600/20 blur-[120px]" />
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400 mb-4">Demande de devis</p>
            <h1 className="text-display-md font-extrabold text-balance">Construisons votre <span className="text-gradient-light">projet ensemble</span></h1>
            <p className="mt-4 text-lg text-ink-300 leading-relaxed">Répondez à quelques questions pour recevoir une proposition adaptée.</p>
          </motion.div>
        </Container>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              {steps.map((s) => (
                <div key={s.num} className="flex-1 flex items-center">
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                    step >= s.num ? 'bg-primary-600 text-white' : 'bg-ink-100 text-ink-400'
                  }`}>
                    {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                  </div>
                  {s.num < steps.length && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${step > s.num ? 'bg-primary-600' : 'bg-ink-100'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              {steps.map((s) => (
                <div key={s.num} className="flex-1 text-center">
                  <span className={`text-[10px] lg:text-xs font-medium ${step >= s.num ? 'text-primary-600' : 'text-ink-400'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 lg:p-10 rounded-3xl border border-ink-100 bg-white shadow-premium">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-ink-900 mb-2">Quel type de projet souhaitez-vous réaliser ?</h2>
                    <p className="text-ink-500 mb-6">Sélectionnez la catégorie qui correspond le mieux à votre besoin.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {projectTypes.map((type) => (
                        <button key={type.value} onClick={() => update('projectType', type.value)} className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-300 ${data.projectType === type.value ? 'border-primary-500 bg-primary-50' : 'border-ink-100 hover:border-ink-300'}`}>
                          <type.icon className={`h-7 w-7 ${data.projectType === type.value ? 'text-primary-600' : 'text-ink-400'}`} />
                          <span className={`text-sm font-medium ${data.projectType === type.value ? 'text-primary-700' : 'text-ink-600'}`}>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold text-ink-900 mb-2">Décrivez votre besoin</h2>
                    <p className="text-ink-500 mb-6">Plus vous nous en dites, plus notre proposition sera précise.</p>
                    <Textarea label="Description du projet" rows={6} placeholder="Décrivez votre projet, vos objectifs, le contexte..." value={data.description ?? ''} onChange={(e) => update('description', e.target.value)} />
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-ink-900 mb-2">Quelles fonctionnalités attendez-vous ?</h2>
                    <p className="text-ink-500 mb-6">Listez les fonctionnalités principales souhaitées.</p>
                    <Textarea label="Fonctionnalités" rows={6} placeholder="Ex: authentification, paiement en ligne, tableau de bord, API..." value={data.features ?? ''} onChange={(e) => update('features', e.target.value)} />
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 className="text-2xl font-bold text-ink-900 mb-2">Quel est votre budget ?</h2>
                    <p className="text-ink-500 mb-6">Une estimation nous aide à calibrer la solution.</p>
                    <div className="space-y-3">
                      {budgetRanges.map((range) => (
                        <button key={range.value} onClick={() => update('budget', range.value)} className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${data.budget === range.value ? 'border-primary-500 bg-primary-50' : 'border-ink-100 hover:border-ink-300'}`}>
                          <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${data.budget === range.value ? 'border-primary-600 bg-primary-600' : 'border-ink-300'}`}>
                            {data.budget === range.value && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className={`text-sm font-medium ${data.budget === range.value ? 'text-primary-700' : 'text-ink-600'}`}>{range.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h2 className="text-2xl font-bold text-ink-900 mb-2">Quels sont vos délais ?</h2>
                    <p className="text-ink-500 mb-6">Quand souhaitez-vous que le projet soit livré ?</p>
                    <div className="space-y-3">
                      {timelineOptions.map((opt) => (
                        <button key={opt.value} onClick={() => update('timeline', opt.value)} className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${data.timeline === opt.value ? 'border-primary-500 bg-primary-50' : 'border-ink-100 hover:border-ink-300'}`}>
                          <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${data.timeline === opt.value ? 'border-primary-600 bg-primary-600' : 'border-ink-300'}`}>
                            {data.timeline === opt.value && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className={`text-sm font-medium ${data.timeline === opt.value ? 'text-primary-700' : 'text-ink-600'}`}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div>
                    <h2 className="text-2xl font-bold text-ink-900 mb-2">Vos coordonnées</h2>
                    <p className="text-ink-500 mb-6">Comment pouvons-nous vous contacter ?</p>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Input label="Nom *" placeholder="Votre nom" value={data.name ?? ''} onChange={(e) => update('name', e.target.value)} />
                      <Input label="Entreprise" placeholder="Nom de l'entreprise" value={data.company ?? ''} onChange={(e) => update('company', e.target.value)} />
                      <Input label="Email *" type="email" placeholder="vous@entreprise.com" value={data.email ?? ''} onChange={(e) => update('email', e.target.value)} />
                      <Input label="Téléphone" placeholder="+225 ..." value={data.phone ?? ''} onChange={(e) => update('phone', e.target.value)} />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
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
      </Section>
    </>
  );
}
