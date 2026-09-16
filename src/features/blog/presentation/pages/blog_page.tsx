import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, ArrowLeft, User, TrendingUp, Newspaper, Search, ChevronRight } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Container, Badge, Loader } from '@/shared/ui';
import { Section } from '@/shared/ui';
import { CtaSection } from '@/shared/components/cta_section';
import { useArticles, useArticleBySlug } from '@/features/blog/presentation/queries/use_articles';
import { NotFoundPage } from '@/features/home/presentation/pages/not_found_page';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateLong(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('');
}

export function BlogPage() {
  const { data: articles, isLoading } = useArticles();
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    if (!articles) return ['Tous'];
    return ['Tous', ...Array.from(new Set(articles.map((a) => a.category)))];
  }, [articles]);

  const featured = articles?.find((a) => a.featured) ?? articles?.[0] ?? null;
  const secondary = useMemo(() => {
    if (!articles || !featured) return [];
    return articles.filter((a) => a.id !== featured.id).slice(0, 2);
  }, [articles, featured]);

  const filtered = useMemo(() => {
    if (!articles || !featured) return [];
    let result = articles.filter((a) => a.id !== featured.id && !secondary.some((s) => s.id === a.id));
    if (activeCategory !== 'Tous') {
      result = result.filter((a) => a.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [articles, activeCategory, searchQuery, featured, secondary]);

  const latestSidebar = useMemo(() => {
    if (!articles) return [];
    return [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
  }, [articles]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary-600/20 blur-[120px]" />
        <div className="min-h-[300px] lg:min-h-[380px] flex items-center">
          <Container>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20 text-primary-400">
                  <Newspaper className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400">Actualités</p>
              </div>
              <h1 className="text-display-lg font-extrabold text-balance">
                Insights & <span className="text-gradient-light">expertises techniques</span>
              </h1>
              <p className="mt-6 text-lg text-ink-300 leading-relaxed max-w-2xl">
                Articles, tutoriels et réflexions sur le développement, le design, le DevOps et la
                transformation digitale.
              </p>
            </motion.div>
          </Container>
        </div>

        <div className="relative border-t border-white/10 bg-ink-950/50 backdrop-blur-sm">
          <Container>
            <div className="flex items-center gap-1 overflow-x-auto py-4 -mx-1 px-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-primary-500 text-white'
                      : 'text-ink-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {featured && (
        <Section className="!pt-12">
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <Link to={`/blog/${featured.slug}`} className="group relative block rounded-3xl overflow-hidden h-[420px] lg:h-[560px]">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-900/70 to-transparent" />
                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-bold uppercase tracking-wide">
                    <TrendingUp className="h-3.5 w-3.5" /> À la une
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-md bg-white/15 backdrop-blur-sm text-xs font-bold text-white uppercase tracking-wide border border-white/20">
                      {featured.category}
                    </span>
                    <span className="text-xs text-ink-300 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> {formatDate(featured.date)}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-4xl font-extrabold text-white leading-tight mb-3 group-hover:text-primary-300 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-ink-300 leading-relaxed mb-4 line-clamp-2 max-w-2xl">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-ink-400">
                    <span className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500/30 text-primary-300 text-[10px] font-bold">
                        {getInitials(featured.author)}
                      </div>
                      <span className="font-medium text-white">{featured.author}</span>
                    </span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {featured.readingTime}</span>
                  </div>
                </div>
              </Link>
            </motion.div>

            <div className="flex flex-col gap-6">
              {secondary.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex-1"
                >
                  <Link to={`/blog/${article.slug}`} className="group flex gap-4 h-full">
                    <div className="relative w-32 sm:w-40 flex-shrink-0 overflow-hidden rounded-2xl">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-center py-1">
                      <span className="text-[11px] font-bold text-primary-600 uppercase tracking-wide mb-1.5">
                        {article.category}
                      </span>
                      <h3 className="text-base lg:text-lg font-bold text-ink-900 leading-tight mb-2 group-hover:text-primary-600 transition-colors line-clamp-3">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-ink-400">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(article.date)}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readingTime}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative p-6 rounded-2xl bg-ink-900 text-white overflow-hidden flex-1"
              >
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary-500/20 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-primary-400" />
                    <span className="text-xs font-bold uppercase tracking-wide text-primary-400">Tendances</span>
                  </div>
                  <p className="text-sm text-ink-300 leading-relaxed mb-4">
                    Retrouvez nos articles les plus lus sur le développement, le DevOps et la transformation digitale.
                  </p>
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Parcourir tous les articles <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </Section>
      )}

      <Section className="!pt-0">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-12">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-ink-900">
                  {activeCategory === 'Tous' ? 'Tous les articles' : activeCategory}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md bg-ink-100 text-ink-500 text-xs font-bold">
                  {filtered.length}
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-ink-200 bg-white text-sm text-ink-700 placeholder:text-ink-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all w-40 sm:w-56"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-20 text-ink-400">Chargement...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-ink-400">
                {searchQuery ? 'Aucun article ne correspond à votre recherche.' : 'Aucun article dans cette catégorie.'}
              </div>
            ) : (
              <div className="space-y-6">
                {filtered.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                  >
                    <Link
                      to={`/blog/${article.slug}`}
                      className="group grid sm:grid-cols-[200px_1fr] gap-5 rounded-2xl overflow-hidden border border-ink-100 bg-white hover:shadow-premium-lg hover:border-primary-200 transition-all duration-500"
                    >
                      <div className="relative aspect-[16/10] sm:aspect-auto overflow-hidden bg-ink-100">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-bold text-ink-800 uppercase tracking-wide">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col justify-center">
                        <h3 className="text-lg font-bold text-ink-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-ink-500 leading-relaxed mb-3 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-ink-400">
                          <span className="flex items-center gap-1.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-[10px] font-bold">
                              {getInitials(article.author)}
                            </div>
                            {article.author}
                          </span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(article.date)}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readingTime}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-1 w-8 rounded-full bg-primary-500" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink-900">Derniers articles</h3>
              </div>
              <div className="space-y-4">
                {latestSidebar.map((article, i) => (
                  <Link key={article.id} to={`/blog/${article.slug}`} className="group flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl bg-ink-100">
                      <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wide">{article.category}</span>
                      <h4 className="text-sm font-semibold text-ink-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 mt-0.5">
                        {article.title}
                      </h4>
                      <span className="text-[11px] text-ink-400 mt-1 block">{formatDate(article.date)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 text-white overflow-hidden">
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary-500/20 blur-3xl" />
              <div className="relative">
                <Newspaper className="h-8 w-8 text-primary-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Restez informé</h3>
                <p className="text-sm text-ink-300 leading-relaxed mb-4">
                  Recevez nos derniers articles directement dans votre boîte mail.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder:text-ink-400 focus:outline-none focus:border-primary-400"
                  />
                  <button className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors flex-shrink-0">
                    OK
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-1 w-8 rounded-full bg-primary-500" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink-900">Catégories</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.filter((c) => c !== 'Tous').map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-ink-900 text-white'
                        : 'bg-ink-50 text-ink-600 border border-ink-100 hover:border-primary-200 hover:text-primary-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useArticleBySlug(slug ?? '');
  const { data: allArticles } = useArticles();

  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadingProgress(Math.min(progress, 100));
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader size={32} /></div>;
  if (!article) return <NotFoundPage />;

  const relatedArticles = allArticles?.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 2) ?? [];
  const otherArticles = allArticles?.filter((a) => a.slug !== article.slug && a.category !== article.category).slice(0, 1) ?? [];
  const suggestions = [...relatedArticles, ...otherArticles].slice(0, 3);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div className="h-full bg-primary-500 transition-all duration-150" style={{ width: `${readingProgress}%` }} />
      </div>

      <section className="relative overflow-hidden bg-ink-900 text-white min-h-[300px] lg:min-h-[380px] flex items-center">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary-600/20 blur-[120px]" />
        <Container size="narrow">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="py-8">
            <nav className="flex items-center gap-2 text-sm text-ink-400 mb-8">
              <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight className="h-3.5 w-3.5 text-ink-600" />
              <Link to="/blog" className="hover:text-white transition-colors">Actualités</Link>
              <ChevronRight className="h-3.5 w-3.5 text-ink-600" />
              <span className="text-ink-300 truncate">{article.category}</span>
            </nav>
            <Badge variant="primary" size="sm" className="bg-primary-500/20 border-primary-500/30 text-primary-300 mb-4">{article.category}</Badge>
            <h1 className="text-display-md font-extrabold text-balance mb-6">{article.title}</h1>
            <p className="text-lg text-ink-300 leading-relaxed mb-8 max-w-2xl">{article.excerpt}</p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-ink-400">
              <span className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold">{getInitials(article.author)}</div>
                <span className="font-medium text-white">{article.author}</span>
                <span className="text-ink-500">· {article.authorRole}</span>
              </span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDateLong(article.date)}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {article.readingTime}</span>
            </div>
          </motion.div>
        </Container>
      </section>

      {article.coverImage && (
        <Container size="narrow" className="-mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-ink-100 shadow-premium-lg"
          >
            <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover" />
          </motion.div>
        </Container>
      )}

      <Section size="narrow" className="!py-16">
        <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

        <div className="flex flex-wrap gap-2 pt-8 mt-8 border-t border-ink-100">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              to="/blog"
              className="text-xs font-medium text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="mt-10 p-6 lg:p-8 rounded-3xl bg-ink-50 border border-ink-100 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 text-white text-lg font-bold flex-shrink-0">
            {getInitials(article.author)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-primary-500" />
              <span className="font-bold text-ink-900">{article.author}</span>
              <span className="text-sm text-ink-400">· {article.authorRole}</span>
            </div>
            <p className="text-sm text-ink-500 leading-relaxed">{article.authorBio}</p>
          </div>
        </div>
      </Section>

      {suggestions.length > 0 && (
        <section className="py-16 bg-ink-50/50">
          <Container>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-8 rounded-full bg-primary-500" />
              <h2 className="text-2xl font-bold text-ink-900">À lire également</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {suggestions.map((a) => (
                <Link key={a.id} to={`/blog/${a.slug}`} className="group rounded-2xl overflow-hidden border border-ink-100 bg-white hover:shadow-premium transition-all duration-500">
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
                    <img src={a.coverImage} alt={a.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <span className="text-[11px] font-bold text-primary-600 uppercase tracking-wide">{a.category}</span>
                    <h3 className="text-base font-bold text-ink-900 mt-2 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{a.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-ink-400">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(a.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readingTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaSection />
    </>
  );
}
