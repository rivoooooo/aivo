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
  displayOrder: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  displayOrder: number;
  createdAt: string;
}

export interface Challenge {
  id: string;
  categoryId: string;
  slug: string;
  name: string;
  description: string | null;
  difficulty: string;
  language: string;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    icon: string;
  };
  resources?: ChallengeResource[];
}

export interface ChallengeWithResources extends Challenge {
  resources: ChallengeResource[];
}

export interface CategoryWithChallenges {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  displayOrder: number;
  challenges: {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    difficulty: string;
    language: string;
  }[];
}

export interface ChallengesListParams {
  language?: string;
  category?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ChallengesListResponse {
  data: Challenge[];
  pagination: PaginationInfo;
}

export interface ApiError {
  error: string;
  message?: string;
  code?: string;
}

export interface FetchOptions {
  retry?: number;
  retryDelay?: number;
  timeout?: number;
}

const DEFAULT_RETRY = 3;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_TIMEOUT = 10000;

async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  fetchOptions: FetchOptions = {}
): Promise<T> {
  const {
    retry = DEFAULT_RETRY,
    retryDelay = DEFAULT_RETRY_DELAY,
    timeout = DEFAULT_TIMEOUT
  } = fetchOptions;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, timeout);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Challenge not found');
        }
        if (response.status >= 500) {
          throw new Error(`Server error: ${response.status}`);
        }
        const errorData = await response.json().catch(() => ({})) as ApiError;
        throw new Error(errorData.error || errorData.message || `HTTP error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < retry && (
        lastError.message.includes('Request timeout') ||
        lastError.message.includes('Server error') ||
        lastError.message.includes('Failed to fetch') ||
        lastError.message.includes('Network')
      )) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }
      
      throw lastError;
    }
  }

  throw lastError || new Error('Unknown error');
}

export async function fetchChallenge(
  slug: string,
  lang: string = 'en',
  type?: string,
  fetchOptions?: FetchOptions
): Promise<ChallengeWithResources> {
  const params = new URLSearchParams({ lang });
  if (type) {
    params.set('type', type);
  }
  
  const url = `/api/challenges/${slug}?${params.toString()}`;
  
  return fetchWithRetry<ChallengeWithResources>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }, fetchOptions);
}

export async function fetchChallengesList(
  params: ChallengesListParams,
  fetchOptions?: FetchOptions
): Promise<ChallengesListResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.language) searchParams.set('lang', params.language);
  if (params.category) searchParams.set('category', params.category);
  if (params.difficulty) searchParams.set('difficulty', params.difficulty);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  
  const url = `/api/challenges?${searchParams.toString()}`;
  
  return fetchWithRetry<ChallengesListResponse>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }, fetchOptions);
}

export async function fetchCategories(
  lang: string = 'en',
  fetchOptions?: FetchOptions
): Promise<CategoryWithChallenges[]> {
  const url = `/api/categories?lang=${lang}`;
  
  return fetchWithRetry<CategoryWithChallenges[]>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }, fetchOptions);
}

export async function fetchAllCategories(
  fetchOptions?: FetchOptions
): Promise<Category[]> {
  const url = '/api/categories/all';
  
  return fetchWithRetry<Category[]>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }, fetchOptions);
}

export function buildChallengeUrl(slug: string, lang?: string, type?: string): string {
  const params = new URLSearchParams();
  if (lang) params.set('lang', lang);
  if (type) params.set('type', type);
  
  const queryString = params.toString();
  return `/api/challenges/${slug}${queryString ? `?${queryString}` : ''}`;
}
