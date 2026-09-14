export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  authorBio: string;
  date: string;
  readingTime: string;
  coverImage: string;
  featured: boolean;
  content: string;
  tags: string[];
}

export const articles: BlogArticle[] = [
  {
    id: '1',
    title: 'Pourquoi le TypeScript est devenu indispensable en 2024',
    slug: 'typescript-indispensable-2024',
    excerpt:
      'Le typage statique transforme la façon dont nous écrivons du JavaScript. Découvrez pourquoi TypeScript est désormais un standard de l\'industrie.',
    category: 'Développement Web',
    author: 'Konan A.',
    authorRole: 'Lead Developer',
    authorBio: 'Lead Developer chez ALAK DIGITAL, passionné par la qualité du code et l\'architecture logicielle.',
    date: '2024-08-15',
    readingTime: '6 min',
    coverImage: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: true,
    content: `
<p>Le typage statique transforme la façon dont nous écrivons du JavaScript. En ajoutant une couche de sécurité au moment du développement, TypeScript permet de détecter les erreurs avant même que le code ne soit exécuté.</p>

<h2>Pourquoi adopter TypeScript ?</h2>
<p>L'un des bénéfices majeurs est la <strong>lisibilité du code</strong>. En explicitant les types, on documente directement le code, ce qui facilite la collaboration et la maintenance.</p>

<blockquote>TypeScript s'intègre parfaitement avec les outils modernes : Vite, ESLint, Prettier. L'écosystème a mûri au point que le coût d'adoption est minimal comparé aux bénéfices.</blockquote>

<h3>Les avantages concrets</h3>
<ul>
<li>Détection des erreurs à la compilation, avant l'exécution</li>
<li>Autocomplétion intelligente dans l'éditeur</li>
<li>Refactoring sécurisé et fiable</li>
<li>Documentation vivante grâce aux types</li>
</ul>

<p>Chez ALAK DIGITAL, tous nos projets web sont développés en <strong>TypeScript strict</strong>. C'est un investissement sur la qualité long terme.</p>

<pre><code>interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): Promise&lt;User&gt; {
  return fetch(\`/api/users/\${id}\`).then(r =&gt; r.json());
}</code></pre>
`,
    tags: ['TypeScript', 'JavaScript', 'Web', 'Qualité'],
  },
  {
    id: '2',
    title: 'Transformer une PME africaine: le rôle du digital',
    slug: 'transformation-digitale-pme-africaine',
    excerpt:
      'La transformation digitale n\'est plus une option pour les PME africaines. Comment les technologies web et mobile redéfinissent la compétitivité.',
    category: 'Transformation digitale',
    author: 'Kouamé B.',
    authorRole: 'Digital Strategist',
    authorBio: 'Stratégiste digital, accompagne les entreprises dans leur transformation digitale.',
    date: '2024-07-20',
    readingTime: '8 min',
    coverImage: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: false,
    content: `
<p>La transformation digitale n'est plus une option pour les PME africaines. L'adoption d'outils numériques est devenue un facteur clé de compétitivité.</p>

<h2>Un levier de croissance</h2>
<p>Les entreprises qui digitalisent leurs processus internes gagnent en efficacité, réduisent leurs coûts opérationnels et améliorent l'expérience de leurs clients.</p>

<blockquote>Le mobile joue un rôle central en Afrique. Avec un taux de pénétration smartphone en croissance constante, les applications mobiles sont souvent le premier point de contact entre une entreprise et ses clients.</blockquote>

<h3>Les étapes clés d'une transformation réussie</h3>
<ol>
<li>Diagnostic de la maturité digitale de l'entreprise</li>
<li>Identification des processus à digitaliser en priorité</li>
<li>Choix des technologies adaptées au contexte local</li>
<li>Formation et accompagnement des équipes</li>
<li>Mesure et optimisation continue</li>
</ol>

<p>Chez ALAK DIGITAL, nous accompagnons les PME dans cette transition, du diagnostic à la mise en œuvre de solutions adaptées au contexte local.</p>
`,
    tags: ['Transformation digitale', 'Afrique', 'PME', 'Mobile'],
  },
  {
    id: '3',
    title: 'Docker et CI/CD: automatiser vos déploiements',
    slug: 'docker-cicd-automatiser-deploiements',
    excerpt:
      'La conteneurisation et l\'intégration continue sont au cœur du DevOps moderne. Guide pratique pour mettre en place un pipeline efficace.',
    category: 'DevOps',
    author: 'Traoré M.',
    authorRole: 'DevOps Engineer',
    authorBio: 'Ingénieur DevOps, spécialiste de l\'automatisation et des infrastructures cloud.',
    date: '2024-06-10',
    readingTime: '10 min',
    coverImage: 'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: false,
    content: `
<p>La conteneurisation avec Docker a révolutionné la façon dont nous déployons les applications. En encapsulant l'application et ses dépendances dans un conteneur, on garantit une cohérence entre les environnements de développement et de production.</p>

<h2>Qu'est-ce que la CI/CD ?</h2>
<p>La <strong>CI/CD</strong> (Continuous Integration / Continuous Deployment) automatise le processus de livraison. À chaque commit, le code est testé, construit et déployé automatiquement.</p>

<h3>GitHub Actions en pratique</h3>
<p>GitHub Actions offre une solution puissante et flexible pour orchestrer ces pipelines. L'intégration native avec GitHub en fait un choix naturel.</p>

<pre><code>name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t app .
      - run: docker push app</code></pre>

<blockquote>Un pipeline bien configuré réduit les erreurs de déploiement, accélère la livraison et permet aux équipes de se concentrer sur le développement plutôt que sur l'infrastructure.</blockquote>
`,
    tags: ['Docker', 'CI/CD', 'DevOps', 'GitHub Actions'],
  },
  {
    id: '4',
    title: 'Concevoir un Design System qui évolue',
    slug: 'concevoir-design-system',
    excerpt:
      'Un Design System n\'est pas qu\'une bibliothèque de composants. C\'est un langage visuel partagé qui garantit la cohérence de vos produits.',
    category: 'UI/UX',
    author: 'Aya K.',
    authorRole: 'UI/UX Designer',
    authorBio: 'Designer produit, crée des interfaces cohérentes et accessibles.',
    date: '2024-05-05',
    readingTime: '7 min',
    coverImage: 'https://images.pexels.com/photos/1966447/pexels-photo-1966447.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: false,
    content: `
<p>Un Design System va au-delà d'une simple bibliothèque de composants. C'est un <strong>langage visuel partagé</strong> qui garantit la cohérence de vos produits digitaux.</p>

<h2>Les fondations</h2>
<p>La première étape consiste à définir les fondations : typographie, palette de couleurs, espacements et grilles. Ces choix structurent toute l'interface.</p>

<h3>Principes de conception</h3>
<ul>
<li><strong>Modularité</strong> : chaque composant a une responsabilité unique</li>
<li><strong>Réutilisabilité</strong> : des variantes clairement définies</li>
<li><strong>Accessibilité</strong> : conforme aux standards WCAG</li>
<li><strong>Documentation</strong> : chaque composant est documenté</li>
</ul>

<blockquote>Un Design System vivant évolue avec le produit. Il doit être documenté, testé et maintenu par toute l'équipe, pas seulement par les designers.</blockquote>
`,
    tags: ['Design System', 'UI/UX', 'Figma', 'Cohérence'],
  },
  {
    id: '5',
    title: 'FastAPI vs Laravel: choisir son backend',
    slug: 'fastapi-vs-laravel-backend',
    excerpt:
      'Python ou PHP ? Deux approches différentes pour construire des API performantes. Comparatif pour vous aider à choisir.',
    category: 'Backend',
    author: 'Konan A.',
    authorRole: 'Lead Developer',
    authorBio: 'Lead Developer chez ALAK DIGITAL, passionné par la qualité du code et l\'architecture logicielle.',
    date: '2024-04-18',
    readingTime: '9 min',
    coverImage: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: false,
    content: `
<p>Le choix du framework backend dépend de nombreux facteurs : équipe, écosystème, performance, type de projet. FastAPI et Laravel sont deux excellents choix, mais avec des philosophies différentes.</p>

<h2>FastAPI : la rapidité et le typage</h2>
<p>FastAPI, basé sur Python, excelle pour les API performantes et la validation de données. Son typage statique intégré et sa documentation automatique en font un choix moderne.</p>

<pre><code>from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{id}")
async def get_user(id: int):
    return {"id": id, "name": "Alice"}</code></pre>

<h2>Laravel : l'élégance et l'écosystème</h2>
<p>Laravel, basé sur PHP, offre un écosystème plus mature avec un ORM puissant, un système d'authentification complet et une syntaxe élégante.</p>

<blockquote>Chez ALAK DIGITAL, nous choisissons selon le contexte : FastAPI pour les API pures et les projets data, Laravel pour les applications web complètes.</blockquote>
`,
    tags: ['FastAPI', 'Laravel', 'Python', 'PHP', 'Backend'],
  },
  {
    id: '6',
    title: 'Le SaaS en Afrique: opportunités et défis',
    slug: 'saas-afrique-opportunites-defis',
    excerpt:
      'Le marché SaaS africain est en pleine croissance. Quelles opportunités pour les entrepreneurs et quels défis techniques à anticiper.',
    category: 'SaaS',
    author: 'Kouamé B.',
    authorRole: 'Digital Strategist',
    authorBio: 'Stratégiste digital, accompagne les entreprises dans leur transformation digitale.',
    date: '2024-03-22',
    readingTime: '8 min',
    coverImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: false,
    content: `
<p>Le marché SaaS africain connaît une croissance rapide, portée par la digitalisation des entreprises et l'augmentation de la connectivité internet.</p>

<h2>Des opportunités nombreuses</h2>
<p>Les opportunités sont nombreuses : gestion d'entreprise, logiciels métiers sectoriels, outils de productivité. Les besoins locaux sont spécifiques et souvent non couverts par les solutions internationales.</p>

<h3>Les défis techniques à anticiper</h3>
<ul>
<li>Gestion de la connectivité intermittente</li>
<li>Intégration du paiement mobile (Orange Money, MTN, Wave)</li>
<li>Adaptation aux contextes réglementaires locaux</li>
<li>Support multilingue et multi-devises</li>
</ul>

<blockquote>Construire un SaaS en Afrique nécessite une compréhension profonde du marché local et une architecture technique capable de s'adapter à ces contraintes.</blockquote>
`,
    tags: ['SaaS', 'Afrique', 'Entrepreneuriat', 'Cloud'],
  },
];
