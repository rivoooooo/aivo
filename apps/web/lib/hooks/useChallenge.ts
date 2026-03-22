'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  fetchChallenge, 
  fetchChallengesList, 
  fetchCategories,
  type ChallengeWithResources,
  type ChallengesListParams,
  type ChallengesListResponse,
  type CategoryWithChallenges,
  type FetchOptions 
} from '@/lib/api/challenge';

export interface UseChallengeState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
}

export interface UseChallengeActions {
  refetch: () => void;
  clearError: () => void;
}

export interface UseChallengeReturn<T> extends UseChallengeState<T>, UseChallengeActions {}

export interface UseChallengeOptions extends FetchOptions {
  enabled?: boolean;
  onSuccess?: (data: ChallengeWithResources) => void;
  onError?: (error: string) => void;
}

export function useChallenge(
  slug: string | undefined,
  lang: string = 'en',
  type?: string,
  options: UseChallengeOptions = {}
): UseChallengeReturn<ChallengeWithResources> {
  const {
    retry = 3,
    retryDelay = 1000,
    timeout = 10000,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<ChallengeWithResources | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (!slug || !enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchChallenge(slug, lang, type, {
        retry,
        retryDelay,
        timeout,
      });
      
      setData(result);
      setRetryCount(0);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load challenge';
      setError(errorMessage);
      setRetryCount(prev => prev + 1);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [slug, lang, type, enabled, retry, retryDelay, timeout, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    setRetryCount(0);
    fetchData();
  }, [fetchData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    retryCount,
    refetch,
    clearError,
  };
}

export interface UseChallengesListOptions extends FetchOptions {
  enabled?: boolean;
  onSuccess?: (data: ChallengesListResponse) => void;
  onError?: (error: string) => void;
}

export function useChallengesList(
  params: ChallengesListParams,
  options: UseChallengesListOptions = {}
): UseChallengeReturn<ChallengesListResponse> & { 
  pagination: ChallengesListResponse['pagination'] | null 
} {
  const {
    retry = 3,
    retryDelay = 1000,
    timeout = 10000,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<ChallengesListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchChallengesList(params, {
        retry,
        retryDelay,
        timeout,
      });
      
      setData(result);
      setRetryCount(0);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load challenges';
      setError(errorMessage);
      setRetryCount(prev => prev + 1);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [params, enabled, retry, retryDelay, timeout, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    setRetryCount(0);
    fetchData();
  }, [fetchData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    retryCount,
    refetch,
    clearError,
    pagination: data?.pagination || null,
  };
}

export interface UseCategoriesOptions extends FetchOptions {
  enabled?: boolean;
  onSuccess?: (data: CategoryWithChallenges[]) => void;
  onError?: (error: string) => void;
}

export function useCategories(
  lang: string = 'en',
  options: UseCategoriesOptions = {}
): UseChallengeReturn<CategoryWithChallenges[]> {
  const {
    retry = 3,
    retryDelay = 1000,
    timeout = 10000,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<CategoryWithChallenges[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchCategories(lang, {
        retry,
        retryDelay,
        timeout,
      });
      
      setData(result);
      setRetryCount(0);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load categories';
      setError(errorMessage);
      setRetryCount(prev => prev + 1);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [lang, enabled, retry, retryDelay, timeout, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    setRetryCount(0);
    fetchData();
  }, [fetchData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    retryCount,
    refetch,
    clearError,
  };
}
