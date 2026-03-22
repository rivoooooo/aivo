import { notFound } from 'next/navigation';
import { getChallengeWithResources } from '@/server/lib/db/queries';
import { localeToLanguage } from '@/types/challenge';
import PlaygroundClient from './components/PlaygroundClient';

interface PlaygroundPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function PlaygroundPage({ params }: PlaygroundPageProps) {
  const { locale, slug } = await params;
  const language = localeToLanguage(locale);

  // 直接在服务端获取数据，不走 API
  const challenge = await getChallengeWithResources(slug, language);

  if (!challenge) {
    notFound();
  }

  // data.resources[0].initCode 已经是 ChallengeFile[] 格式
  // 直接传给 Client Component，不需要转换

  return <PlaygroundClient challenge={challenge} locale={locale} />;
}
