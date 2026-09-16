# CLAUDE.md — Conventions API

> Migration en cours : bascule de Supabase vers l'API custom `alak-api`. Checklist et
> etat d'avancement dans `e:\personnel\alak-api\CLAUDE.md`.

## Architecture

Le projet suit une architecture Clean Architecture en couches :

```
src/
  core/              # Infrastructure transverse (HTTP, erreurs, DB)
  features/
    <feature>/
      domain/        # Entites et interfaces de repository (no I/O)
      application/   # Use cases (orchestration)
      infrastructure/# Implementations concretes (static, API, Supabase)
      presentation/  # Pages, composants, hooks React Query
  app/di/            # Injection de dependances (composition root)
```

## Client HTTP (`core/http/api_client.ts`)

### Base URL

Toutes les requetes partent de `/api`. Le client est instancie comme singleton :

```ts
export const apiClient = new ApiClient(); // baseUrl = '/api'
```

### Methodes disponibles

| Methode | Signature | Retour |
|---------|-----------|--------|
| `get<T>` | `(path, options?)` | `Promise<T>` |
| `post<T>` | `(path, body?, options?)` | `Promise<T>` |
| `put<T>` | `(path, body?, options?)` | `Promise<T>` |
| `delete<T>` | `(path, options?)` | `Promise<T>` |

### Format des reponses attendu

Le API doit retourner du JSON avec les conventions suivantes :

#### Succes

- **200** — Retourne directement le payload JSON (pas d'enveloppe `{ data: ... }`).
  - Pour une liste : `T[]` directement.
  - Pour un element : `T` directement.
  - Pour un element unique optionnel (ex: `getBySlug`) : le client repository gere le `null` cote front, mais l'API doit retourner `404` si introuvable — le repository convertira en `null`.
- **204** — Retour `undefined` (pour DELETE sans contenu).
- **201** — Retourne la ressource creee `T`.

#### Erreurs

L'API doit retourner un objet JSON avec au minimum un champ `message` :

```json
{
  "message": "Description lisible de l'erreur",
  "code": "ERROR_CODE_OPTIONAL",
  "details": {}
}
```

Seul `message` est utilise par `parseApiError`. Les autres champs sont optionnels.

#### Codes de statut mapping

| Code HTTP | Erreur JS | Usage |
|-----------|-----------|-------|
| 401 | `UnauthorizedError` | Authentification requise ou token expire |
| 403 | `ForbiddenError` | Acces refuse (permissions insuffisantes) |
| 404 | `NotFoundError` | Ressource inexistante |
| 422 | `ValidationError` | Validation cote serveur echouee |
| 500, 502, 503 | `ServerError` | Erreur serveur |
| Autres 4xx | `ValidationError` | Par defaut, erreurs client |
| Autres 5xx | `ServerError` | Par defaut, erreurs serveur |

#### Reponse reseau

Si `fetch` leve une `TypeError` (connexion perdue, DNS, etc.), le client convertit en `NetworkError`.

## Supabase (`core/database/supabase_client.ts`)

Le client Supabase est configure avec :
- `persistSession: true` — la session persiste dans le localStorage
- `autoRefreshToken: true` — refresh automatique du token
- `detectSessionInUrl: true` — detection des redirects OAuth

### Conventions Supabase

- Les variables d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont pre-remplies.
- Pour les listes : `supabase.from('table').select('*')` retourne `{ data, error }`.
- Pour un element unique : utiliser `.single()` qui retourne `{ data, error }` ou `null` si introuvable.
- Pour un element optionnel : utiliser `.maybeSingle()` qui retourne `{ data: null, error: null }` si introuvable (pas d'erreur).
- **Toujours** verifier `error` avant d'utiliser `data`.
- **RLS obligatoire** sur chaque table avec 4 politiques (SELECT, INSERT, UPDATE, DELETE) scopees par `auth.uid()`.
- Edge functions : inclure les headers CORS dans chaque reponse.

## Pattern Repository

Chaque feature expose une interface dans `domain/repositories/` :

```ts
export interface ProjectRepository {
  getAll(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project | null>;
  getFeatured(): Promise<Project[]>;
}
```

L'implementation actuelle est statique (`StaticProjectRepository`), mais l'interface permet de basculer vers une implementation API ou Supabase sans modifier les use cases ni la presentation.

### Pour ajouter une implementation API

1. Creer `infrastructure/repositories/api_project_repository.ts`
2. Implementer l'interface en utilisant `apiClient`
3. Remplacer l'instantiation dans `app/di/index.ts`

```ts
// Exemple
export class ApiProjectRepository implements ProjectRepository {
  async getAll(): Promise<Project[]> {
    return apiClient.get<Project[]>('/projects');
  }
  async getBySlug(slug: string): Promise<Project | null> {
    try {
      return await apiClient.get<Project>(`/projects/${slug}`);
    } catch (e) {
      if (e instanceof NotFoundError) return null;
      throw e;
    }
  }
}
```

## Use Cases

Les use cases dans `application/usecases/` orchestrent les repositories :

```ts
export class GetProjects {
  constructor(private readonly repository: ProjectRepository) {}
  execute(): Promise<Project[]> {
    return this.repository.getAll();
  }
}
```

Ils ne contiennent **aucune** logique de presentation ni d'I/O direct.

## Queries cote presentation

Les hooks React Query (`presentation/queries/`) encapsulent les use cases :

```ts
export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: () => getProjects.execute() });
}
```

## Nomenclature des entites

Les entites (`domain/entities/`) definissent la structure des donnees. Toutes les entites exportent aussi des donnees statiques pour le prototype :

- `id: string` — identifiant unique
- `slug: string` — slug URL-friendly
- Noms de champs en `camelCase`
- Les tableaux de technologies/tags sont des `string[]`
- Les resultats cles sont des `{ label: string; value: string }[]`

## Regles importantes

- Ne jamais utiliser `current_user` dans les politiques RLS — utiliser `auth.uid()`.
- Ne jamais utiliser `FOR ALL` dans une politique — une politique par verbe CRUD.
- Ne jamais faire de DDL en dehors de l'outil `apply_migration`.
- Toutes les edge functions doivent inclure les headers CORS.
- Le client HTTP retourne directement le payload, pas d'enveloppe — l'API doit suivre cette convention.
