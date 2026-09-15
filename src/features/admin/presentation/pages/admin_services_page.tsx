import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Search, Plus, Edit3, Trash2, Eye, X, Save, Wrench, ArrowLeft, Info, Layers, Tag, FileText,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchServices, insertService, updateService, deleteService } from '@/features/content/infrastructure/content_api';
import { Button, Input, Textarea, Select, Card, CardHeader, CardTitle, CardDescription, Badge } from '@/shared/ui';
import { serviceSchema, type ServiceFormValues } from '../forms/service_schema';
import type { Service } from '@/features/services/domain/entities/service';

type View = 'list' | 'edit' | 'detail';

const iconOptions = [
  { value: 'web', label: 'Web (Code2)' },
  { value: 'mobile', label: 'Mobile (Smartphone)' },
  { value: 'saas', label: 'SaaS (Layers)' },
  { value: 'backend', label: 'Backend (Server)' },
  { value: 'devops', label: 'DevOps (Cloud)' },
  { value: 'design', label: 'Design (Palette)' },
];

function toFormData(s: Service): ServiceFormValues {
  return {
    name: s.name,
    slug: s.slug,
    tagline: s.tagline,
    description: s.description,
    icon: s.icon,
    features: toCommaList(s.features),
    technologies: toCommaList(s.technologies),
  };
}

function emptyForm(): ServiceFormValues {
  return { name: '', slug: '', tagline: '', description: '', icon: 'web', features: '', technologies: '' };
}

function toCommaList(arr: string[]): string {
  return arr.join(', ');
}

function fromCommaList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

interface ServiceFormProps {
  defaultValues: ServiceFormValues;
  onSubmit: (values: ServiceFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

function ServiceForm({ defaultValues, onSubmit, onCancel, loading, isEdit = false }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues,
    mode: 'onChange',
  });

  const values = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Info className="h-5 w-5 text-primary-600" /> Identité
              </CardTitle>
              <CardDescription>Informations générales du service</CardDescription>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Nom *" placeholder="Développement Web" error={errors.name?.message} {...register('name')} />
            <Input label="Slug *" placeholder="developpement-web" className="font-mono" error={errors.slug?.message} {...register('slug')} />
            <Input label="Slogan *" placeholder="Sites corporate, applications web" className="sm:col-span-2" error={errors.tagline?.message} {...register('tagline')} />
            <Select label="Icône" options={iconOptions} error={errors.icon?.message} {...register('icon')} />
          </div>
          <div className="mt-4">
            <Textarea label="Description *" rows={4} placeholder="Description du service" error={errors.description?.message} {...register('description')} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Layers className="h-5 w-5 text-primary-600" /> Détails
              </CardTitle>
              <CardDescription>Fonctionnalités et technologies associées</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <Input label="Fonctionnalités (virgule)" placeholder="Sites corporate, Dashboards, Marketplaces" error={errors.features?.message} {...register('features')} />
            <Input label="Technologies (virgule)" placeholder="React, TypeScript, Vite, Tailwind" error={errors.technologies?.message} {...register('technologies')} />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>{isEdit ? 'Modification du service' : 'Nouveau service'}</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[
              { label: 'Nom', value: values.name || null },
              { label: 'Slug', value: values.slug || null },
              { label: 'Icône', value: values.icon || null },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-3">
                <dt className="text-ink-500">{label}</dt>
                <dd className="max-w-[60%] truncate text-right font-medium text-ink-900">
                  {value ?? <span className="text-ink-300">-</span>}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 space-y-2">
            <Button type="submit" variant="primary" size="md" fullWidth loading={loading} leftIcon={!loading ? <Save className="h-4 w-4" /> : undefined}>
              Enregistrer
            </Button>
            <Button type="button" variant="outline" size="md" fullWidth onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </Card>
      </div>
    </form>
  );
}

interface ServiceDetailViewProps {
  service: Service;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ServiceDetailView({ service, onBack, onEdit, onDelete }: ServiceDetailViewProps) {
  const iconLabel = iconOptions.find((o) => o.value === service.icon)?.label ?? service.icon;

  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </button>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">{service.name}</h2>
          <p className="text-sm text-ink-500 mt-1">{service.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="md" leftIcon={<Edit3 className="h-4 w-4" />} onClick={onEdit}>
            Modifier
          </Button>
          <Button variant="outline" size="md" leftIcon={<Trash2 className="h-4 w-4" />} onClick={onDelete} className="!text-red-600 !border-red-200 hover:!bg-red-50">
            Supprimer
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Info className="h-5 w-5 text-primary-600" /> Identité
              </CardTitle>
              <CardDescription>Informations générales du service</CardDescription>
            </div>
          </CardHeader>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase text-ink-400 mb-1">Nom</dt>
              <dd className="text-sm font-medium text-ink-900">{service.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-ink-400 mb-1">Slug</dt>
              <dd className="text-sm font-medium text-ink-900 font-mono">{service.slug}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase text-ink-400 mb-1">Slogan</dt>
              <dd className="text-sm font-medium text-ink-900">{service.tagline}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-ink-400 mb-1">Icône</dt>
              <dd className="text-sm font-medium text-ink-900">{iconLabel}</dd>
            </div>
          </dl>
          <div className="mt-4">
            <dt className="text-xs font-semibold uppercase text-ink-400 mb-1 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Description
            </dt>
            <dd className="text-sm text-ink-700 leading-relaxed">{service.description}</dd>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Layers className="h-5 w-5 text-primary-600" /> Fonctionnalités
              </CardTitle>
              <CardDescription>Liste des fonctionnalités proposées</CardDescription>
            </div>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            {service.features.length === 0 ? (
              <span className="text-sm text-ink-300">Aucune fonctionnalité renseignée</span>
            ) : (
              service.features.map((feature) => (
                <Badge key={feature} variant="secondary" size="md">
                  {feature}
                </Badge>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Tag className="h-5 w-5 text-primary-600" /> Technologies
              </CardTitle>
              <CardDescription>Stack technique associée</CardDescription>
            </div>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            {service.technologies.length === 0 ? (
              <span className="text-sm text-ink-300">Aucune technologie renseignée</span>
            ) : (
              service.technologies.map((tech) => (
                <Badge key={tech} variant="neutral" size="md">
                  {tech}
                </Badge>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AdminServicesPage() {
  const queryClient = useQueryClient();
  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: fetchServices });
  const insertMutation = useMutation({ mutationFn: insertService, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }) });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Service>) => updateService(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });
  const deleteMutation = useMutation({ mutationFn: deleteService, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }) });

  const [view, setView] = useState<View>('list');
  const [editing, setEditing] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Service | null>(null);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase();
    return services.filter((s) => s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q));
  }, [services, searchQuery]);

  function handleEdit(service: Service) {
    setEditing(service);
    setView('edit');
  }

  function handleCreate() {
    setEditing(null);
    setView('edit');
  }

  function handleView(service: Service) {
    setViewingService(service);
    setView('detail');
  }

  function handleSave(values: ServiceFormValues) {
    const payload = {
      name: values.name,
      slug: values.slug,
      tagline: values.tagline,
      description: values.description,
      icon: values.icon,
      features: fromCommaList(values.features ?? ''),
      technologies: fromCommaList(values.technologies ?? ''),
    };
    if (editing) updateMutation.mutate({ id: editing.id, ...payload });
    else insertMutation.mutate(payload);
    setView('list');
  }

  if (view === 'detail' && viewingService) {
    return (
      <ServiceDetailView
        service={viewingService}
        onBack={() => setView('list')}
        onEdit={() => {
          setEditing(viewingService);
          setView('edit');
        }}
        onDelete={() => {
          setDeleteConfirm(viewingService);
          setView('list');
        }}
      />
    );
  }

  if (view === 'edit') {
    return (
      <div>
        <button
          onClick={() => setView('list')}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à la liste
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink-900">
            {editing ? 'Modifier le service' : 'Nouveau service'}
          </h2>
          <p className="text-sm text-ink-500 mt-1">
            {editing ? editing.name : 'Ajoutez un nouveau service au catalogue'}
          </p>
        </div>

        <ServiceForm
          defaultValues={editing ? toFormData(editing) : emptyForm()}
          onSubmit={handleSave}
          onCancel={() => setView('list')}
          loading={insertMutation.isPending || updateMutation.isPending}
          isEdit={!!editing}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-ink-900">Services</h2><p className="text-sm text-ink-500 mt-1">Gérez le catalogue de services</p></div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Nouveau service</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un service..." className="w-full h-11 pl-11 pr-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-ink-100 bg-white">
          <Wrench className="h-12 w-12 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500 mb-4">Aucun service trouvé</p>
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Créer un service</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service, i) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3) }} className="rounded-2xl border border-ink-100 bg-white p-5 hover:border-ink-200 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Wrench className="h-5 w-5" /></div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleView(service)} className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50 transition-all" title="Voir"><Eye className="h-4 w-4" /></button>
                  <button onClick={() => handleEdit(service)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all" title="Modifier"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteConfirm(service)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Supprimer"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <h3 className="text-sm font-bold text-ink-900 mb-1">{service.name}</h3>
              <p className="text-xs text-ink-500 line-clamp-2 mb-3">{service.tagline}</p>
              <div className="flex flex-wrap gap-1">
                {service.technologies.slice(0, 4).map((tech) => <span key={tech} className="px-2 py-0.5 rounded bg-ink-100 text-ink-600 text-[10px] font-semibold">{tech}</span>)}
                {service.technologies.length > 4 && <span className="px-2 py-0.5 rounded bg-ink-100 text-ink-400 text-[10px] font-semibold">+{service.technologies.length - 4}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 flex-shrink-0"><Trash2 className="h-6 w-6" /></div>
                <div className="flex-1"><h3 className="text-lg font-bold text-ink-900 mb-1">Supprimer le service ?</h3><p className="text-sm text-ink-500">Êtes-vous sûr de vouloir supprimer « {deleteConfirm.name} » ? Cette action est irréversible.</p></div>
                <button onClick={() => setDeleteConfirm(null)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="primary" size="md" onClick={() => { deleteMutation.mutate(deleteConfirm.id); setDeleteConfirm(null); }} className="!bg-red-600 hover:!bg-red-700">Supprimer</Button>
                <Button variant="outline" size="md" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
