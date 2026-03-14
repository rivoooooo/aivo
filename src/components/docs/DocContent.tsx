'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Doc, DocMeta } from '@/types/docs'

interface DocContentProps {
  doc: Doc
  locale?: string
}

export default function DocContent({ doc, locale = 'en' }: DocContentProps) {
  const [MdxContent, setMdxContent] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    const loadMdx = async () => {
      try {
        const mdxModule = await import(`@/docs/${locale}/${doc.category}/${doc.slug}.mdx`)
        setMdxContent(() => mdxModule.default)
      } catch (error) {
        console.error('Failed to load MDX:', error)
      }
    }
    loadMdx()
  }, [doc.slug, doc.category, locale])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="doc-frontmatter">
        <span>category: {doc.category}</span>
        <span className="border-l border-border pl-4">read: {doc.readTime} min</span>
        <span className="border-l border-border pl-4">updated: {doc.updatedAt}</span>
      </div>

      <article className="doc-content">
        {MdxContent ? (
          <MdxContent />
        ) : (
          <div className="text-muted-foreground">Loading...</div>
        )}
      </article>

      {(doc.prev || doc.next) && (
        <div className="doc-pagination">
          <hr className="border-t border-border mb-6" />
          <div className="flex justify-between gap-4">
            {doc.prev ? (
              <Link
                href={`/${locale}/docs/${doc.prev.slug}`}
                className="pagination-card flex-1 group"
              >
                <span className="pagination-label">
                  ← PREV
                </span>
                <span className="pagination-title">{doc.prev.title}</span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {doc.next ? (
              <Link
                href={`/${locale}/docs/${doc.next.slug}`}
                className="pagination-card flex-1 text-right group"
              >
                <span className="pagination-label">
                  NEXT →
                </span>
                <span className="pagination-title">{doc.next.title}</span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
          <p className="text-center text-[11px] text-muted-foreground mt-3">
            Press [ for prev, ] for next
          </p>
        </div>
      )}
    </div>
  )
}
