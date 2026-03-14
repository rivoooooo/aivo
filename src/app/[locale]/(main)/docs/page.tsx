import { redirect } from 'next/navigation'

interface DocsPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { locale } = await params
  redirect(`/${locale}/docs/getting-started`)
}
