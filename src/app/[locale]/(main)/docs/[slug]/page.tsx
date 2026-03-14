import { notFound } from 'next/navigation'
import { getDocBySlug, getDocCategories } from '@/lib/docs'
import DocsLayout from '@/components/docs/DocsLayout'
import DocContent from '@/components/docs/DocContent'

interface DocsSlugPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function DocsSlugPage({ params }: DocsSlugPageProps) {
  const { locale, slug } = await params
  const [doc, categories] = await Promise.all([
    getDocBySlug(locale, slug),
    getDocCategories(locale)
  ])

  if (!doc) {
    notFound()
  }

  return (
    <DocsLayout
      categories={categories}
      currentSlug={doc.slug}
      headings={doc.headings}
      prevDoc={doc.prev}
      nextDoc={doc.next}
      locale={locale}
    >
      <DocContent doc={doc} locale={locale} />
    </DocsLayout>
  )
}

export async function generateStaticParams() {
  const locales = ['en', 'zh', 'ja']
  const slugs: { locale: string; slug: string }[] = []

  for (const locale of locales) {
    const categories = await getDocCategories(locale)
    for (const group of categories) {
      for (const doc of group.docs) {
        slugs.push({ locale, slug: doc.slug })
      }
    }
  }

  return slugs
}
