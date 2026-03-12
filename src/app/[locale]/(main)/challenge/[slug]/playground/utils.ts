export interface ChallengeFile {
  filename: string;
  language: string;
  content: string;
}

export interface SandboxConfig {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: 'html' | 'javascript' | 'react' | 'vue';
  importSource: string;
  files: ChallengeFile[];
}

export interface ChallengeConfig {
  id: string;
  title: string;
  description: string;
  initCode: ChallengeFile[];
  importSource: string;
  sandboxType: 'html' | 'javascript' | 'react' | 'vue';
}

export async function getChallengeConfig(slug: string, lang: string = 'en'): Promise<ChallengeConfig | null> {
  try {
    const response = await fetch(`/api/challenges/${slug}?lang=${lang}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch challenge: ${response.statusText}`);
    }
    
    const challenge = await response.json();
    
    if (!challenge) return null;
    
    const sandboxFiles: ChallengeFile[] = challenge.sandboxFiles || [];
    const starterCode: ChallengeFile[] = challenge.starterCode || [];
    
    const initCode = starterCode.length > 0 ? starterCode : sandboxFiles;
    
    return {
      id: challenge.id,
      title: challenge.name,
      description: challenge.description || '',
      initCode,
      importSource: challenge.importSource || '',
      sandboxType: (challenge.sandboxType as 'html' | 'javascript' | 'react' | 'vue') || 'html',
    };
  } catch (error) {
    console.error('Error fetching challenge config:', error);
    return null;
  }
}
