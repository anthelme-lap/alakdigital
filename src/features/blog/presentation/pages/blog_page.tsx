import { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Calendar, User, ChevronRight,
  Facebook, Twitter, MessageCircle, Link2, Check, Mail,
} from 'lucide-react';
import { Container, Section, Badge, Loader } from '@/shared/ui';
import { useArticles, useArticleBySlug } from '@/features/blog/presentation/queries/use_articles';
import { NotFoundPage } from '@/features/home/presentation/pages/not_found_page';
import { NewsletterSection, blogSocials as socials } from '@/features/blog/presentation/components/newsletter_section';

const PAGE_SIZE = 5;

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
  const [slideIndex, setSlideIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const slides = useMemo(() => {
    if (!articles) return [];
    const featuredArticles = articles.filter((a) => a.featured);
    return (featuredArticles.length > 0 ? featuredArticles : articles).slice(0, 5);
  }, [articles]);

  useEffect(() => {
    setSlideIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  function goToSlide(delta: number) {
    setSlideIndex((i) => (i + delta + slides.length) % slides.length);
  }

  const tags = useMemo(() => {
    if (!articles) return [];
    return Array.from(new Set(articles.flatMap((a) => a.tags))).slice(0, 12);
  }, [articles]);

  const filtered = useMemo(() => {
    if (!articles) return [];
    if (!activeTag) return articles;
    return articles.filter((a) => a.tags.includes(activeTag));
  }, [articles, activeTag]);

  useEffect(() => {
    setPage(1);
  }, [activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const recentSidebar = useMemo(() => {
    if (!articles) return [];
    return [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
  }, [articles]);

  const spotlight = useMemo(() => {
    if (!articles) return [];
    return articles.filter((a) => a.featured).slice(0, 3);
  }, [articles]);

  function handleTagClick(tag: string) {
    setActiveTag((t) => (t === tag ? null : tag));
  }

  const currentSlide = slides[slideIndex];

  return (
    <>
      {currentSlide && (
        <section className="pt-8">
          <div className="container-px w-full">
            <div className="relative min-h-[300px] md:min-h-[360px] lg:min-h-[420px] overflow-hidden rounded-3xl group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Link to={`/blog/${currentSlide.slug}`} className="absolute inset-0">
                    <img
                      src={currentSlide.coverImage}
                      alt={currentSlide.title}
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition duration-700"
                    />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-ink-950/35 to-ink-950/10 pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="max-w-3xl text-center text-white px-6">
                      <div className="flex justify-center flex-wrap gap-2 mb-5">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur text-xs rounded-full font-semibold uppercase tracking-wide">
                          {currentSlide.category}
                        </span>
                        {currentSlide.featured && (
                          <span className="px-3 py-1 bg-primary-500 text-xs rounded-full font-semibold uppercase tracking-wide">
                            À la une
                          </span>
                        )}
                      </div>
                      <Link to={`/blog/${currentSlide.slug}`} className="pointer-events-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.12] hover:text-primary-300 transition-colors">
                          {currentSlide.title}
                        </h1>
                      </Link>
                      <div className="mt-5 flex justify-center flex-wrap gap-3 text-xs md:text-sm text-white/80">
                        <span>{formatDateLong(currentSlide.date)}</span>
                        <span>•</span>
                        <span>{currentSlide.readingTime} de lecture</span>
                        <span>•</span>
                        <span>{currentSlide.author}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {slides.length > 1 && (
                <>
                  <button
                    onClick={() => goToSlide(-1)}
                    aria-label="Article précédent"
                    className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center hover:scale-110 transition"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => goToSlide(1)}
                    aria-label="Article suivant"
                    className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center hover:scale-110 transition"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {slides.map((s, i) => (
                      <button
                        key={s.id}
                        onClick={() => setSlideIndex(i)}
                        aria-label={`Aller à l'article ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${i === slideIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <Section>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-10">
          <section>
            <div className="flex items-center gap-4 mb-7">
              <h2 className="font-display font-extrabold text-2xl text-ink-900">Derniers articles</h2>
              <div className="h-[2px] bg-primary-500 flex-1" />
            </div>

            {isLoading ? (
              <div className="text-center py-20"><Loader size={28} className="mx-auto" /></div>
            ) : paged.length === 0 ? (
              <div className="text-center py-20 text-ink-400">
                {activeTag ? `Aucun article avec le tag « ${activeTag} ».` : 'Aucun article disponible.'}
              </div>
            ) : (
              <div className="space-y-5">
                {paged.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                  >
                    <Link
                      to={`/blog/${article.slug}`}
                      className="group flex flex-col sm:flex-row bg-white border border-ink-100 rounded-2xl overflow-hidden hover:shadow-premium-lg hover:border-primary-200 transition-all duration-300"
                    >
                      <div className="sm:w-[220px] md:w-[240px] shrink-0 overflow-hidden">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-[190px] sm:h-full min-h-[190px] object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      <div className="flex-1 p-5 md:p-6">
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="font-bold uppercase tracking-wider text-primary-600">{article.category}</span>
                          <span className="text-ink-300">•</span>
                          <span className="text-ink-400">{article.readingTime}</span>
                        </div>
                        <h3 className="mt-2 font-display font-extrabold text-[20px] md:text-[23px] leading-[1.25] group-hover:text-primary-600 transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-ink-400">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(article.date)}</span>
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {article.author}</span>
                        </div>
                        <p className="mt-4 text-[13px] leading-6 text-ink-500 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-ink-100">
                          <div className="flex gap-2 flex-wrap">
                            {article.tags.slice(0, 2).map((t) => (
                              <span key={t} className="px-2 py-1 bg-ink-50 text-[10px] text-ink-500 rounded-md">{t}</span>
                            ))}
                          </div>
                          <span className="flex items-center gap-2 text-xs font-semibold whitespace-nowrap group-hover:text-primary-600 transition-colors">
                            Lire <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      page === i + 1 ? 'bg-primary-500 text-white' : 'bg-white border border-ink-200 text-ink-600 hover:border-primary-400 hover:text-primary-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                {page < totalPages && (
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="h-10 px-4 rounded-xl bg-ink-900 text-white text-sm font-semibold flex items-center gap-2 hover:bg-primary-600 transition-colors"
                  >
                    Suivant <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </section>

          <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
            {recentSidebar.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="font-display text-lg font-extrabold whitespace-nowrap">Articles récents</h3>
                  <div className="h-[2px] bg-primary-500 flex-1" />
                </div>
                <div className="space-y-5">
                  {recentSidebar.map((article) => (
                    <Link key={article.id} to={`/blog/${article.slug}`} className="group flex gap-4">
                      <img src={article.coverImage} alt={article.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-display font-bold text-[13px] leading-5 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-[10px] text-ink-400 mt-2">{formatDate(article.date)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {spotlight.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="font-display text-lg font-extrabold whitespace-nowrap">À la une</h3>
                  <div className="h-[2px] bg-primary-500 flex-1" />
                </div>
                <div className="space-y-5">
                  {spotlight.map((article, i) => (
                    <Link key={article.id} to={`/blog/${article.slug}`} className="flex gap-4 group">
                      <span className="font-display text-3xl font-extrabold text-ink-200">{String(i + 1).padStart(2, '0')}</span>
                      <div className="min-w-0">
                        <h4 className="text-[13px] font-semibold leading-5 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <span className="text-[10px] text-ink-400">{article.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="font-display font-extrabold text-lg">Tags</h3>
                  <div className="h-[2px] bg-primary-500 flex-1" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-2 text-[11px] rounded-lg border transition-colors ${
                        activeTag === tag ? 'bg-ink-900 text-white border-ink-900' : 'bg-white border-ink-100 text-ink-600 hover:text-primary-600 hover:border-primary-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-5">
                <h3 className="font-display font-extrabold text-lg whitespace-nowrap">Réseaux sociaux</h3>
                <div className="h-[2px] bg-primary-500 flex-1" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-11 rounded-lg bg-ink-900 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <NewsletterSection />
    </>
  );
}

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useArticleBySlug(slug ?? '');
  const { data: allArticles } = useArticles();

  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);

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

  const sorted = [...(allArticles ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const currentIndex = sorted.findIndex((a) => a.slug === article.slug);
  const previousArticle = currentIndex >= 0 ? sorted[currentIndex + 1] : undefined;
  const nextArticle = currentIndex > 0 ? sorted[currentIndex - 1] : undefined;

  const relatedArticles = (allArticles ?? []).filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 2);
  const recentSidebar = (allArticles ?? [])
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  const spotlight = (allArticles ?? []).filter((a) => a.featured && a.slug !== article.slug).slice(0, 2);
  const sidebarTags = Array.from(new Set((allArticles ?? []).flatMap((a) => a.tags))).slice(0, 8);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // presse-papiers indisponible, rien a faire
    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div className="h-full bg-primary-500 transition-all duration-150" style={{ width: `${readingProgress}%` }} />
      </div>

      <Container className="pt-10">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
          <Link to="/" className="hover:text-primary-600 transition-colors">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/blog" className="hover:text-primary-600 transition-colors">Actualités</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink-500 truncate">{article.category}</span>
        </nav>

        <div className="flex flex-wrap gap-2 mt-8">
          <Badge variant="primary" size="sm">{article.category}</Badge>
          {article.tags.slice(0, 1).map((t) => <Badge key={t} variant="neutral" size="sm">{t}</Badge>)}
        </div>

        <h1 className="text-display-md font-extrabold leading-tight mt-5 text-ink-900">{article.title}</h1>
        <p className="mt-5 max-w-3xl text-base md:text-lg text-ink-500 leading-relaxed">{article.excerpt}</p>

        <div className="mt-7 pb-7 border-b border-ink-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600 font-bold text-sm flex-shrink-0">
              {getInitials(article.author)}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">{article.author}</p>
              <div className="flex flex-wrap gap-2 mt-1 text-[11px] text-ink-400">
                <span>{formatDateLong(article.date)}</span>
                <span>•</span>
                <span>{article.readingTime} de lecture</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {article.coverImage && (
        <Container className="mt-8">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-[260px] sm:h-[400px] lg:h-[520px] object-cover rounded-3xl"
          />
        </Container>
      )}

      <Container size="wide" className="py-12">
        <div className="grid lg:grid-cols-[minmax(0,760px)_300px] justify-center gap-12">
          <article>
            <div className="bg-white border border-ink-100 rounded-3xl shadow-premium p-6 sm:p-8 lg:p-10">
              <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

              {article.tags.length > 0 && (
                <div className="mt-10 pt-7 border-t border-ink-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-ink-900 mr-2">Tags :</span>
                    {article.tags.map((tag) => (
                      <Link
                        key={tag}
                        to="/blog"
                        className="px-3 py-1.5 rounded-lg bg-ink-50 text-[11px] text-ink-500 hover:text-primary-600 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-7 pt-7 border-t border-ink-100">
                <span className="text-sm font-semibold text-ink-900">Partager cet article</span>
                <div className="flex gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Partager sur Facebook"
                    className="w-10 h-10 rounded-lg bg-[#4267B2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Partager sur Twitter"
                    className="w-10 h-10 rounded-lg bg-ink-900 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${article.title} ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Partager sur WhatsApp"
                    className="w-10 h-10 rounded-lg bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    aria-label="Copier le lien"
                    className="w-10 h-10 rounded-lg bg-ink-50 text-ink-700 flex items-center justify-center hover:bg-ink-100 transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-ink-100 rounded-3xl shadow-premium p-6 sm:p-8 mt-6">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 text-white text-xl font-bold flex-shrink-0">
                  {getInitials(article.author)}
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-ink-400">Écrit par</span>
                  <h3 className="font-display font-extrabold text-xl mt-1 text-ink-900">{article.author}</h3>
                  <p className="text-[13px] leading-6 text-ink-500 mt-3">{article.authorBio}</p>
                </div>
              </div>
            </div>

            {(previousArticle || nextArticle) && (
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {previousArticle ? (
                  <Link to={`/blog/${previousArticle.slug}`} className="bg-white border border-ink-100 rounded-2xl p-5 group">
                    <div className="flex items-center gap-2 text-[11px] text-ink-400">
                      <ArrowLeft className="h-3 w-3" /> Article précédent
                    </div>
                    <h3 className="font-display font-bold text-sm leading-5 mt-2 text-ink-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {previousArticle.title}
                    </h3>
                  </Link>
                ) : <div />}
                {nextArticle && (
                  <Link to={`/blog/${nextArticle.slug}`} className="bg-white border border-ink-100 rounded-2xl p-5 text-right group">
                    <div className="flex items-center justify-end gap-2 text-[11px] text-ink-400">
                      Article suivant <ArrowRight className="h-3 w-3" />
                    </div>
                    <h3 className="font-display font-bold text-sm leading-5 mt-2 text-ink-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {nextArticle.title}
                    </h3>
                  </Link>
                )}
              </div>
            )}

            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-display font-extrabold text-2xl whitespace-nowrap text-ink-900">À lire aussi</h2>
                  <div className="h-[2px] bg-primary-500 flex-1" />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {relatedArticles.map((a) => (
                    <Link key={a.id} to={`/blog/${a.slug}`} className="bg-white border border-ink-100 rounded-2xl overflow-hidden group">
                      <div className="overflow-hidden">
                        <img src={a.coverImage} alt={a.title} className="w-full h-44 object-cover group-hover:scale-105 transition duration-500" />
                      </div>
                      <div className="p-5">
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-primary-600">{a.category}</span>
                        <h3 className="font-display text-lg font-extrabold leading-6 mt-2 text-ink-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {a.title}
                        </h3>
                        <p className="text-[11px] text-ink-400 mt-3">{formatDate(a.date)} · {a.readingTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside className="space-y-10">
            {recentSidebar.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="font-display text-lg font-extrabold whitespace-nowrap">Articles récents</h3>
                  <div className="h-[2px] bg-primary-500 flex-1" />
                </div>
                <div className="space-y-5">
                  {recentSidebar.map((a) => (
                    <Link key={a.id} to={`/blog/${a.slug}`} className="group flex gap-4">
                      <img src={a.coverImage} alt={a.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-display font-bold text-[13px] leading-5 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {a.title}
                        </h4>
                        <p className="text-[10px] text-ink-400 mt-2">{formatDate(a.date)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {spotlight.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="font-display text-lg font-extrabold whitespace-nowrap">À la une</h3>
                  <div className="h-[2px] bg-primary-500 flex-1" />
                </div>
                <div className="space-y-5">
                  {spotlight.map((a, i) => (
                    <Link key={a.id} to={`/blog/${a.slug}`} className="flex gap-4 group">
                      <span className="font-display text-3xl font-extrabold text-ink-200">{String(i + 1).padStart(2, '0')}</span>
                      <div className="min-w-0">
                        <h4 className="text-[13px] font-semibold leading-5 group-hover:text-primary-600 transition-colors line-clamp-2">{a.title}</h4>
                        <span className="text-[10px] text-ink-400">{a.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {sidebarTags.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="font-display font-extrabold text-lg">Tags</h3>
                  <div className="h-[2px] bg-primary-500 flex-1" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {sidebarTags.map((tag) => (
                    <Link
                      key={tag}
                      to="/blog"
                      className="px-3 py-2 bg-white border border-ink-100 text-[11px] text-ink-600 hover:text-primary-600 hover:border-primary-300 transition-colors rounded-lg"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-ink-900 text-white rounded-2xl p-6">
              <Mail className="h-8 w-8 text-primary-400" />
              <h3 className="font-display font-extrabold text-xl mt-4">Ne manquez aucun article</h3>
              <p className="text-[12px] text-white/60 leading-5 mt-2">Recevez les dernières publications directement par email.</p>
              <form className="mt-5" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full h-11 px-4 text-xs text-ink-900 rounded-lg outline-none"
                />
                <button
                  type="submit"
                  className="w-full h-11 bg-primary-500 text-white text-xs font-semibold mt-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  S'abonner
                </button>
              </form>
            </div>
          </aside>
        </div>
      </Container>

      <NewsletterSection />
    </>
  );
}
