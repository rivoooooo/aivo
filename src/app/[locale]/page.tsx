import Link from "next/link";
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TypewriterText } from '@/components/TypewriterText';
import { ModeToggle } from "@/components/mode-toggle";

export default async function Home() {
  const t = await getTranslations('header');
  const tNav = await getTranslations('nav');

  return (
    <main className="min-h-screen">
      <div className="scanlines" />
      
      <nav className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="text-sm font-bold tracking-wider text-glow">
              &gt; AI-ERA_
            </Link>
            <div className="flex items-center gap-4 md:gap-6 text-xs">
              <Link href="/" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [{tNav('home')}]
              </Link>
              <Link href="/challenge" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [{tNav('challenges')}]
              </Link>
              <Link href="/about" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [{tNav('about')}]
              </Link>
              <LanguageSwitcher />
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-glow mb-4 md:mb-6 tracking-tight">
            <TypewriterText
              texts={["AI-Era", "Web Dev Skills"]}
              typingSpeed={120}
              deletingSpeed={80}
              pauseDuration={5000}
              prefix="> "
              suffix="_"
            />
            <span className="animate-blink text-2xl md:text-3xl">█</span>
          </h1>
          <p className="text-sm md:text-base opacity-60 max-w-2xl mx-auto mb-8">
            {`$ ./start_challenge.sh --category=all --difficulty=expert`}
          </p>
          <p className="text-xs md:text-sm opacity-40 max-w-xl mx-auto mb-10">
            {t('description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/challenge" 
              className="btn-terminal text-sm"
            >
              [ START_CHALLENGES ]
            </Link>
            <Link 
              href="/about" 
              className="btn-terminal text-sm border-dashed"
            >
              [ VIEW_DOCS ]
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="card-terminal">
            <div className="card-terminal-header">
              +-- QUICK START --+
            </div>
            <div className="p-4 text-sm font-mono space-y-2">
              <p className="opacity-80">
                <span className="text-primary">$</span> cd challenges/
              </p>
              <p className="opacity-80">
                <span className="text-primary">$</span> ./select.sh --ai
              </p>
              <p className="opacity-80">
                <span className="text-primary">$</span> npm run test
              </p>
            </div>
          </div>

          <div className="card-terminal">
            <div className="card-terminal-header">
              +-- FEATURES --+
            </div>
            <div className="p-4 text-sm font-mono space-y-2">
              <p className="opacity-80">
                <span className="text-primary">[+]</span> AI Prompt Engineering
              </p>
              <p className="opacity-80">
                <span className="text-primary">[+]</span> Code Review Practice
              </p>
              <p className="opacity-80">
                <span className="text-primary">[+]</span> Frontend Fundamentals
              </p>
              <p className="opacity-80">
                <span className="text-primary">[+]</span> Performance Tuning
              </p>
            </div>
          </div>

          <div className="card-terminal">
            <div className="card-terminal-header">
              +-- LATEST --+
            </div>
            <div className="p-4 text-sm font-mono space-y-2">
              <p className="opacity-80">
                <span className="text-secondary">*</span> v2.0.0 - Major Update
              </p>
              <p className="opacity-60 text-xs">
                Added RAG System challenge
              </p>
              <p className="opacity-60 text-xs">
                New AI-powered hints
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-xs opacity-40">
          &gt; root@ai-era-web-dev-skills:~$ _
          <span className="animate-blink">█</span>
        </div>
      </div>
    </main>
  );
}
