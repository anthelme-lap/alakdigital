import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Search,
  Plus,
  Calendar,
  Edit3,
  Trash2,
  Eye,
  X,
  ArrowLeft,
  Save,
  Star,
  FolderKanban,
  Info,
  Target,
  Layers,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, insertProject, updateProject, deleteProject } from '@/features/content/infrastructure/content_api';
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui';
import { projectSchema, type ProjectFormValues } from '../forms/project_schema';
import type { Project } from '@/features/projects/domain/entities/project';

type View = 'list' | 'edit';

function toFormData(p: Project): ProjectFormValues {
  return {
    name: p.name,
    slug: p.slug,
    sector: p.sector,
    tagline: p.tagline,
    description: p.description,
    problem: p.problem,
    solution: p.solution,
    technologies: toCommaList(p.technologies),
    services: toCommaList(p.services),
    featured: p.featured,
    year: p.year,
    client: p.client,
    duration: p.duration,
    features: toCommaList(p.features),
  };
}

function emptyForm(): ProjectFormValues {
  return {
    name: '',
    slug: '',
    sector: '',
    tagline: '',
    description: '',
    problem: '',
    solution: '',
    technologies: '',
    services: '',
    featured: false,
    year: String(new Date().getFullYear()),
    client: '',
    duration: '',
    features: '',
  };
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

interface ProjectFormProps {
  defaultValues: ProjectFormValues;
  onSubmit: (values: ProjectFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

function ProjectForm({ defaultValues, onSubmit, onCancel, loading, isEdit = false }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
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
                <Info className="h-5 w-5 text-primary-600" /> Identite
              </CardTitle>
              <CardDescription>Informations generales du projet</CardDescription>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Nom *" placeholder="EventFlow" error={errors.name?.message} {...register('name')} />
            <Input label="Slug *" placeholder="eventflow" className="font-mono" error={errors.slug?.message} {...register('slug')} />
            <Input label="Secteur *" placeholder="Evenementiel" error={errors.sector?.message} {...register('sector')} />
            <Input label="Client *" placeholder="EventFlow CI" error={errors.client?.message} {...register('client')} />
            <Input label="Slogan *" placeholder="Plateforme de gestion d'evenements" className="sm:col-span-2" error={errors.tagline?.message} {...register('tagline')} />
          </div>
          <div className="mt-4">
            <Textarea label="Description *" rows={3} placeholder="Description du projet" error={errors.description?.message} {...register('description')} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Target className="h-5 w-5 text-primary-600" /> Contexte
              </CardTitle>
              <CardDescription>Le probleme resolu et la solution apportee</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <Textarea label="Probleme *" rows={2} placeholder="Quel probleme le projet resout-il ?" error={errors.problem?.message} {...register('problem')} />
            <Textarea label="Solution *" rows={2} placeholder="Quelle solution a ete apportee ?" error={errors.solution?.message} {...register('solution')} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Layers className="h-5 w-5 text-primary-600" /> Details techniques
              </CardTitle>
              <CardDescription>Stack, perimetre et duree de la mission</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Technologies (virgule)" placeholder="React, FastAPI, PostgreSQL" error={errors.technologies?.message} {...register('technologies')} />
              <Input label="Services (virgule)" placeholder="Web, Mobile, Backend" error={errors.services?.message} {...register('services')} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Annee" placeholder="2024" error={errors.year?.message} {...register('year')} />
              <Input label="Duree" placeholder="5 mois" error={errors.duration?.message} {...register('duration')} />
            </div>
            <Input label="Fonctionnalites (virgule)" placeholder="Billetterie, Check-in QR, Dashboard" error={errors.features?.message} {...register('features')} />
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setValue('featured', !values.featured, { shouldValidate: true })}
                className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${values.featured ? 'bg-primary-600' : 'bg-ink-200'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${values.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm font-medium text-ink-700">Mettre en avant</span>
            </label>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Recapitulatif</CardTitle>
              <CardDescription>{isEdit ? 'Modification du projet' : 'Nouveau projet'}</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[
              { label: 'Nom', value: values.name || null },
              { label: 'Client', value: values.client || null },
              { label: 'Secteur', value: values.sector || null },
              { label: 'Annee', value: values.year || null },
              { label: 'Mis en avant', value: values.featured ? 'Oui' : 'Non' },
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

export function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });
  const insertMutation = useMutation({
    mutationFn: insertProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Project>) => updateProject(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
  const [view, setView] = useState<View>('list');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSector, setActiveSector] = useState('Tous');
  const [deleteConfirm, setDeleteConfirm] = useState<Project | null>(null);

  const sectors = useMemo(() => {
    return ['Tous', ...Array.from(new Set(projects.map((p) => p.sector)))];
  }, [projects]);

  const filtered = useMemo(() => {
    let result = projects;
    if (activeSector !== 'Tous') result = result.filter((p) => p.sector === activeSector);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q),
      );
    }
    return result;
  }, [projects, activeSector, searchQuery]);

  function handleEdit(project: Project) {
    setEditingProject(project);
    setView('edit');
  }

  function handleCreate() {
    setEditingProject(null);
    setView('edit');
  }

  function handleSave(values: ProjectFormValues) {
    const payload = {
      name: values.name,
      slug: values.slug,
      sector: values.sector,
      tagline: values.tagline,
      description: values.description,
      problem: values.problem,
      solution: values.solution,
      technologies: fromCommaList(values.technologies ?? ''),
      services: fromCommaList(values.services ?? ''),
      featured: values.featured,
      year: values.year,
      client: values.client,
      duration: values.duration ?? '',
      features: fromCommaList(values.features ?? ''),
      results: editingProject ? editingProject.results : [],
    };
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, ...payload });
    } else {
      insertMutation.mutate(payload);
    }
    setView('list');
  }

  if (view === 'edit') {
    return (
      <div>
        <button
          onClick={() => setView('list')}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour a la liste
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink-900">
            {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
          </h2>
          <p className="text-sm text-ink-500 mt-1">
            {editingProject ? editingProject.name : 'Ajoutez un nouveau projet au portfolio'}
          </p>
        </div>

        <ProjectForm
          defaultValues={editingProject ? toFormData(editingProject) : emptyForm()}
          onSubmit={handleSave}
          onCancel={() => setView('list')}
          loading={insertMutation.isPending || updateMutation.isPending}
          isEdit={!!editingProject}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">Projets</h2>
          <p className="text-sm text-ink-500 mt-1">Gelez tous les projets du portfolio</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
          Nouveau projet
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un projet..."
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSector(s)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeSector === s ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:border-ink-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-ink-100 bg-white">
          <FolderKanban className="h-12 w-12 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500 mb-4">Aucun projet trouve</p>
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
            Creer un projet
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-ink-100 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500">Projet</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500 hidden md:table-cell">Secteur</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500 hidden lg:table-cell">Client</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500 hidden sm:table-cell">Annee</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500">Statut</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((project, i) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                    className="hover:bg-ink-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-ink-900">{project.name}</p>
                      <p className="text-xs text-ink-400 truncate max-w-xs">{project.tagline}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="px-2.5 py-1 rounded-md bg-ink-100 text-ink-600 text-xs font-semibold">{project.sector}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-sm text-ink-500">{project.client}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="flex items-center gap-1.5 text-sm text-ink-500">
                        <Calendar className="h-3.5 w-3.5" /> {project.year}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {project.featured ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-50 text-accent-600 text-xs font-bold uppercase tracking-wide">
                          <Star className="h-3 w-3" /> A la une
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-ink-100 text-ink-500 text-xs font-bold uppercase tracking-wide">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/projects/${project.slug}`} className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50 transition-all" title="Voir">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleEdit(project)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all" title="Modifier">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(project)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 flex-shrink-0">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ink-900 mb-1">Supprimer le projet ?</h3>
                  <p className="text-sm text-ink-500">
                    Etes-vous sur de vouloir supprimer « {deleteConfirm.name} » ? Cette action est irreversible.
                  </p>
                </div>
                <button onClick={() => setDeleteConfirm(null)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="primary" size="md" onClick={() => { deleteMutation.mutate(deleteConfirm.id); setDeleteConfirm(null); }} className="!bg-red-600 hover:!bg-red-700 !shadow-red-600/20">
                  Supprimer
                </Button>
                <Button variant="outline" size="md" onClick={() => setDeleteConfirm(null)}>
                  Annuler
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
