import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import {
  getAllCategories,
  getChallengesByLanguage,
  getUserProgress,
  getCurrentUser,
} from '@/server/lib/db/queries';
import { ChallengesMapWrapper } from './ChallengesMapWrapper';

const localeToLanguage: Record<string, string> = {
  zh: 'zh',
  en: 'en',
  ja: 'ja',
};

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const language = localeToLanguage[locale] || 'en';

  const t = await getTranslations('challenge');

  const [categories, challenges, user] = await Promise.all([
    getAllCategories(),
    getChallengesByLanguage(language),
    getCurrentUser(),
  ]);

  const userProgress = user ? await getUserProgress(user.id) : null;

  return (
    <div className="w-full">
      <div className="text-center mb-8 pt-8 md:pt-16">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-glow mb-4 md:mb-6 tracking-tight">
          &gt; CHALLENGES_
          <span className="animate-blink text-xl md:text-2xl">█</span>
        </h1>
        <p className="text-sm md:text-base opacity-60 max-w-2xl mx-auto mb-6">
          $ skill-tree --render --interactive
        </p>
        <p className="text-xs md:text-sm opacity-40 max-w-xl mx-auto">
          Select a challenge to start your learning journey
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-20">
            <p className="text-sm opacity-60">&gt; loading...</p>
          </div>
        }
      >
        <ChallengesMapWrapper
          categories={categories}
          challenges={challenges}
          user={user}
          userProgress={userProgress}
        />
      </Suspense>
    </div>
  );
}
