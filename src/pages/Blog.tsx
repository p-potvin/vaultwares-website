import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../store/blogData';
import { Calendar, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function Blog() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-vw-console-bg text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-white/5 pb-8">
          <h1 className="mb-4 font-mono text-4xl font-bold tracking-tight text-white">
            {t('blog.title')}
          </h1>
          <p className="max-w-2xl text-violet-100/55">
            {t('blog.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`}
              className="group flex flex-col justify-between rounded-[28px] border border-white/5 bg-vw-console-raised/55 p-6 transition-all hover:border-vw-console-violet/30 hover:bg-vw-console-elevated"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full border border-white/5 bg-vw-console-bg px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-vw-console-gold">
                    {t(`posts.${post.id}.category`, { defaultValue: post.category })}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-xs text-violet-100/40">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                <h2 className="mb-3 font-sans text-xl font-semibold leading-tight text-white group-hover:text-vw-console-gold transition-colors">
                  {t(`posts.${post.id}.title`, { defaultValue: post.title })}
                </h2>
                <p className="mb-6 text-sm text-violet-100/55 line-clamp-3">
                  {t(`posts.${post.id}.excerpt`, { defaultValue: post.excerpt })}
                </p>
              </div>
              <div className="flex items-center gap-2 border-t border-white/5 pt-4 font-mono text-xs text-violet-100/40">
                <User className="h-3 w-3" />
                {post.author}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
