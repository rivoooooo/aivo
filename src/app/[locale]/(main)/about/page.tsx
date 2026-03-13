import { getTranslations } from 'next-intl/server';
import { SyncedTypewriter } from '@/components/SyncedTypewriter';
import { asciiLogoList } from '@/data/asciiLogo';

export default async function AboutPage() {
  const t = await getTranslations('about');

  const infoItems = [
    { label: t('project'), value: t('name') },
    { label: t('version'), value: t('versionNumber') },
    { label: t('description'), value: t('descriptionContent') },
  ];

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-7xl">
        <SyncedTypewriter 
          logoLines={asciiLogoList[0].split('\n')}
          infoItems={infoItems}
          logoDelay={50}
          textDelay={100}
        />
      </div>
    </div>
  );
}
