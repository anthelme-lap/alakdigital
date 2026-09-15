import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, Linkedin, Facebook, Instagram, Github } from 'lucide-react';
import { Container, Input, Textarea, Select, Button, Section } from '@/shared/ui';
import { APP_CONFIG } from '@/core/config/app_config';
import { useContentStore } from '@/features/content/presentation/store/content_store';

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
  { Icon: Linkedin, href: APP_CONFIG.social.linkedin },
  { Icon: Facebook, href: APP_CONFIG.social.facebook },
  { Icon: Instagram, href: APP_CONFIG.social.instagram },
  { Icon: Github, href: APP_CONFIG.social.github },
];

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const addMessage = useContentStore((s) => s.addMessage);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1000));
    addMessage({
      name: data.name,
      company: data.company ?? '',
      email: data.email,
      phone: data.phone ?? '',
      project_type: data.projectType,
      message: data.message,
    });
    setSubmitted(true);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary-600/20 blur-[120px]" />
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400 mb-4">Contact</p>
            <h1 className="text-display-lg font-extrabold text-balance">Parlons de votre <span className="text-gradient-light">projet</span></h1>
            <p className="mt-6 text-lg text-ink-300 leading-relaxed max-w-2xl">
              Une idée, un besoin, un projet ? Écrivez-nous et recevez une réponse sous 24h.
            </p>
          </motion.div>
        </Container>
      </section>

      <Section>
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-ink-900 mb-2">Nos coordonnées</h2>
            <p className="text-ink-500 leading-relaxed mb-8">
              Notre équipe est disponible pour échanger sur vos projets et vous accompagner dans
              votre transformation digitale.
            </p>
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4 p-4 rounded-xl border border-ink-100 bg-white">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <info.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1">{info.label}</div>
                    {info.href ? (
                      <a href={info.href} className="text-sm font-medium text-ink-900 hover:text-primary-600 transition-colors">{info.value}</a>
                    ) : (
                      <div className="text-sm font-medium text-ink-900">{info.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-4">
              {socials.map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-50 text-ink-600 hover:bg-primary-600 hover:text-white transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-12 rounded-2xl border border-green-100 bg-green-50 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-ink-900 mb-2">Message envoyé !</h3>
                <p className="text-ink-500 mb-6">Merci pour votre message. Nous vous répondrons sous 24h.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline" size="md">Envoyer un autre message</Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="p-8 rounded-2xl border border-ink-100 bg-white shadow-premium space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input label="Nom *" placeholder="Votre nom" error={errors.name?.message} {...register('name')} />
                  <Input label="Entreprise" placeholder="Nom de l'entreprise" {...register('company')} />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input label="Email *" type="email" placeholder="vous@entreprise.com" error={errors.email?.message} {...register('email')} />
                  <Input label="Téléphone" placeholder="+225 ..." {...register('phone')} />
                </div>
                <Select label="Type de projet *" options={projectTypes} error={errors.projectType?.message} {...register('projectType')} />
                <Textarea label="Message *" rows={5} placeholder="Décrivez votre projet en quelques lignes..." error={errors.message?.message} {...register('message')} />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" variant="primary" size="lg" loading={isSubmitting} leftIcon={<Send className="h-4 w-4" />}>
                    Envoyer ma demande
                  </Button>
                  <a href={`https://wa.me/${APP_CONFIG.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <Button type="button" variant="outline" size="lg" leftIcon={<MessageCircle className="h-5 w-5" />}>
                      Discuter sur WhatsApp
                    </Button>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
