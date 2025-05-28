import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const useStripeApi = () => {
  const [loading, setLoading] = useState(false);

  const makeRequest = async <T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const url = `${baseUrl}${endpoint}`;

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Request failed');
      }

      return result;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setLoading(false);
    }
  };

  const get = <T = any>(endpoint: string) => makeRequest<T>('GET', endpoint);
  const post = <T = any>(endpoint: string, data?: any) => makeRequest<T>('POST', endpoint, data);
  const put = <T = any>(endpoint: string, data?: any) => makeRequest<T>('PUT', endpoint, data);
  const del = <T = any>(endpoint: string) => makeRequest<T>('DELETE', endpoint);

  return {
    loading,
    get,
    post,
    put,
    delete: del,
  };
}; 