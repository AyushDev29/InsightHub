/**
 * News Panel Component
 * Displays financial news articles in a scrollable list
 */

import { ExternalLink, Calendar, Newspaper } from 'lucide-react'
import { NewsArticle } from '../../types/financial'

interface NewsPanelProps {
  articles: NewsArticle[]
  isLoading?: boolean
  onArticleClick?: (article: NewsArticle) => void
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function NewsPanel({
  articles,
  isLoading,
  onArticleClick,
}: NewsPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-dark-700 border border-dark-600 rounded-lg p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-dark-600 rounded w-3/4 mb-2" />
            <div className="h-3 bg-dark-600 rounded w-full mb-2" />
            <div className="h-3 bg-dark-600 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="bg-dark-700 border border-dark-600 rounded-lg p-6 text-center">
        <Newspaper size={32} className="mx-auto text-gray-500 mb-3" />
        <p className="text-gray-400">No news articles available</p>
      </div>
    )
  }

  return (
    <div className="bg-dark-700 border border-dark-600 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-dark-600 bg-dark-800">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Newspaper size={20} className="text-primary-400" />
          Latest Financial News
        </h3>
      </div>

      {/* Articles List */}
      <div className="divide-y divide-dark-600 max-h-96 overflow-y-auto">
        {articles.map((article, idx) => (
          <article
            key={idx}
            onClick={() => onArticleClick?.(article)}
            className="p-4 hover:bg-dark-600/50 transition-colors cursor-pointer group"
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Source and Time */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary-400 truncate">
                    {article.source.name}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(article.publishedAt)}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2 mb-1">
                  {article.title}
                </h4>

                {/* Description */}
                {article.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                    {article.description}
                  </p>
                )}

                {/* Read More Link */}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Read more <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
