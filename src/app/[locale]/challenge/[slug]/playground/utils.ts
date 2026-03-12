export interface ChallengeFile {
  filename: string;
  language: string;
  content: string;
}

export interface ChallengeResource {
  id: string;
  challengeId: string;
  type: string;
  importSource: string;
  initCode: ChallengeFile[];
  codeSource: ChallengeFile[];
}

export interface ChallengeConfig {
  id: string;
  title: string;
  description: string;
  initCode: ChallengeFile[];
  codeSource: ChallengeFile[];
  importSource: string;
}

async function fetchChallengeApi(slug: string, lang: string = 'en'): Promise<any> {
  const response = await fetch(`/api/challenges/${slug}?lang=${lang}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch challenge: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getChallengeConfig(slug: string, lang: string = 'en'): Promise<ChallengeConfig | null> {
  try {
    const challenge = await fetchChallengeApi(slug, lang);
    
    if (!challenge) return null;
    
    const resource = challenge.resources?.[0];
    
    return {
      id: challenge.id,
      title: challenge.name,
      description: challenge.description || '',
      initCode: resource?.initCode || [],
      codeSource: resource?.codeSource || [],
      importSource: resource?.importSource || '',
    };
  } catch (error) {
    console.error('Error fetching challenge config:', error);
    return null;
  }
}
