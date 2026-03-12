import { getTranslations } from 'next-intl/server';
import { AsciiArtTypewriter } from '@/components/AsciiArtTypewriter';

const ASCII_LOGO = `
  :%@@:.#@@@@@@@@@@= 
  .*@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  .*@@@* .#@@@@@@@@@%: 
    .... .#@@@@@@@@@+: 
  :%@@@@:.#@@@@@@@@=  
  -@@@@@:.#@@@@@@*: 
  -@@@@@:.#@@@#-`;

const INFO_TEXT = `关于信息

AI-Era Web Dev Skills
版本: 1.0.0
描述: AI 时代前端开发者技能挑战平台`;

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="min-h-screen flex  justify-center p-4">
      <div className="flex flex-col md:flex-row gap-px w-full max-w-7xl items-start">
        <div className="flex-shrink-0">
          <AsciiArtTypewriter 
            lines={ASCII_LOGO.split('\n')}
            totalDuration={8000}
            className="text-primary"
          />
        </div>
        <div className="flex-1 font-mono text-sm text-foreground">
          <AsciiArtTypewriter 
            lines={INFO_TEXT.split('\n')}
            totalDuration={8000}
            className="text-primary"
          />
        </div>
      </div>
    </div>
  );
}
