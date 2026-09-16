import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, Linkedin, Facebook, Instagram, Github, Sparkles, Clock, ArrowUpRight,
} from 'lucide-react';
import { Container, Button, Section } from '@/shared/ui';
import { APP_CONFIG } from '@/core/config/app_config';
import { insertMessage } from '@/features/content/infrastructure/content_api';

const schema = z.object({
  name: z.string().min(2, 'Veuillez saisir votre nom'),
  company: z.string().optional(),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  projectType: z.string().min(1, 'Veuillez sélectionner un type de projet'),
  message: z.string().min(10, 'Votre message doit contenir au moins 10 caractères'),
});

type FormData = z.infer<typeof schema>;

const projectTypes = [
  { value: 'website', label: 'Site web' },
  { value: 'webapp', label: 'Application web' },
  { value: 'mobile', label: 'Application mobile' },
  { value: 'saas', label: 'Plateforme SaaS' },
  { value: 'api', label: 'API / Backend' },
  { value: 'other', label: 'Autre' },
];

const contactInfo = [
  { icon: Mail, label: 'Email', value: APP_CONFIG.email, href: `mailto:${APP_CONFIG.email}` },
  { icon: Phone, label: 'Téléphone', value: APP_CONFIG.phone, href: `tel:${APP_CONFIG.phone.replace(/\s/g, '')}` },
  { icon: MessageCircle, label: 'WhatsApp', value: APP_CONFIG.whatsapp, href: `https://wa.me/${APP_CONFIG.whatsapp.replace(/\s/g, '')}` },
  { icon: MapPin, label: 'Localisation', value: APP_CONFIG.address },
];

const socials = [
  { Icon: Linkedin, href: APP_CONFIG.social.linkedin, label: 'LinkedIn' },
  { Icon: Facebook, href: APP_CONFIG.social.facebook, label: 'Facebook' },
  { Icon: Instagram, href: APP_CONFIG.social.instagram, label: 'Instagram' },
  { Icon: Github, href: APP_CONFIG.social.github, label: 'GitHub' },
];

interface FloatingFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

function FloatingField({ id, label, type = 'text', value, onChange, error, required, textarea, rows = 4, options, placeholder }: FloatingFieldProps) {
  const hasValue = value.length > 0;
  const [focused, setFocused] = useState(false);
  const active = focused || hasValue;

  const sharedClass = `w-full rounded-2xl border bg-transparent text-sm text-white transition-all duration-300 focus:outline-none ${
    error ? 'border-red-400/60' : active ? 'border-primary-500/60' : 'border-white/15 hover:border-white/25'
  }`;

  return (
    <div className="relative">
      <label htmlFor={id} className={`pointer-events-none absolute left-4 transition-all duration-200 z-10 ${
        active
          ? 'top-2.5 text-[10px] font-bold uppercase tracking-wider text-primary-400'
          : 'top-1/2 -translate-y-1/2 text-sm text-ink-400'
      }`}>
        {label}{required && <span className="text-primary-500"> *</span>}
      </label>

      {textarea ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={active ? placeholder : ''}
          className={`${sharedClass} px-4 pt-8 pb-3 resize-none placeholder:text-ink-500`}
        />
      ) : options ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${sharedClass} h-14 px-4 text-white appearance-none cursor-pointer [&>option]:bg-ink-900 [&>option]:text-white`}
        >
          <option value="">{active ? '' : ' '}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={active ? placeholder : ''}
          className={`${sharedClass} h-14 px-4 placeholder:text-ink-500`}
        />
      )}

      {options && (
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
            <span className="inline-block h-1 w-1 rounded-full bg-red-400" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitError('');
      await insertMessage({
        name: data.name,
        company: data.company ?? '',
        email: data.email,
        phone: data.phone ?? '',
        project_type: data.projectType,
        message: data.message,
      });
      setSubmitted(true);
    } catch {
      setSubmitError("Une erreur est survenue. Veuillez réessayer ou nous contacter directement.");
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white min-h-[300px] lg:min-h-[380px] flex items-center">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-secondary-600/10 blur-[100px]" />
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-primary-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-300">Contact</span>
            </div>
            <h1 className="text-display-lg font-extrabold text-balance">Parlons de votre <span className="text-gradient-light">projet</span></h1>
            <p className="mt-6 text-lg text-ink-300 leading-relaxed max-w-2xl">
              Une idée, un besoin, un projet ? Écrivez-nous et recevez une réponse sous 24h.
            </p>
          </motion.div>
        </Container>
      </section>

      <Section className="-mt-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Contact info panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="lg:col-span-4">
            <div className="rounded-3xl bg-ink-900 text-white p-8 h-full flex flex-col">
              <h2 className="text-xl font-bold mb-2">Coordonnées</h2>
              <p className="text-sm text-ink-400 leading-relaxed mb-8">
                Notre équipe est disponible pour échanger sur vos projets.
              </p>

              <div className="space-y-3 flex-1">
                {contactInfo.map((info, i) => (
                  <motion.a
                    key={info.label}
                    href={info.href ?? undefined}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className={`group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 ${info.href ? 'hover:bg-white/10 hover:border-primary-500/30' : 'cursor-default'}`}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 group-hover:scale-110 transition-all duration-300">
                      <info.icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-ink-500 mb-0.5">{info.label}</div>
                      <div className="text-sm font-medium text-white truncate">{info.value}</div>
                    </div>
                    {info.href && <ArrowUpRight className="h-4 w-4 text-ink-500 group-hover:text-primary-400 transition-colors flex-shrink-0" />}
                  </motion.a>
                ))}
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-primary-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-300">Suivez-nous</span>
                </div>
                <div className="flex items-center gap-2">
                  {socials.map(({ Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-ink-400 hover:bg-primary-600 hover:text-white hover:scale-110 transition-all duration-300">
                      <Icon className="h-4.5 w-4.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-8">
            {submitted ? (
              <div className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-ink-900 mb-2">Message envoyé !</h3>
                <p className="text-ink-500 mb-8 max-w-sm">Merci pour votre message. Nous vous répondrons sous 24h.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline" size="md">Envoyer un autre message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl bg-ink-900 text-white p-8 lg:p-10 shadow-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 h-[200px] w-[200px] rounded-full bg-primary-600/10 blur-[80px] pointer-events-none" />

                <div className="relative mb-8">
                  <h2 className="text-xl font-bold text-white mb-1">Envoyez-nous un message</h2>
                  <p className="text-sm text-ink-400">Remplissez le formulaire ci-dessous</p>
                </div>

                <div className="relative space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FloatingField id="name" label="Nom" required placeholder="Votre nom" value={watch('name') ?? ''} onChange={(e) => register('name').onChange(e)} error={errors.name?.message} />
                    <FloatingField id="company" label="Entreprise" placeholder="Nom de l'entreprise" value={watch('company') ?? ''} onChange={(e) => register('company').onChange(e)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FloatingField id="email" label="Email" type="email" required placeholder="vous@entreprise.com" value={watch('email') ?? ''} onChange={(e) => register('email').onChange(e)} error={errors.email?.message} />
                    <FloatingField id="phone" label="Téléphone" type="tel" placeholder="+225 ..." value={watch('phone') ?? ''} onChange={(e) => register('phone').onChange(e)} />
                  </div>
                  <FloatingField id="projectType" label="Type de projet" required options={projectTypes} placeholder="Sélectionnez..." value={watch('projectType') ?? ''} onChange={(e) => register('projectType').onChange(e)} error={errors.projectType?.message} />
                  <FloatingField id="message" label="Message" required textarea rows={5} placeholder="Décrivez votre projet en quelques lignes..." value={watch('message') ?? ''} onChange={(e) => register('message').onChange(e)} error={errors.message?.message} />
                </div>

                <div className="relative mt-8 flex flex-col sm:flex-row gap-3">
                  <Button type="submit" variant="primary" size="lg" loading={isSubmitting} leftIcon={<Send className="h-4 w-4" />}>
                    Envoyer ma demande
                  </Button>
                  <a href={`https://wa.me/${APP_CONFIG.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <Button type="button" variant="outline" size="lg" leftIcon={<MessageCircle className="h-5 w-5" />} className="!border-white/20 !text-white hover:!bg-white/10">
                      Discuter sur WhatsApp
                    </Button>
                  </a>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </Section>
    </>
  );
}
