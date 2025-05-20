// OpenAPI client for DocRouter using openapi-fetch and generated types
// Usage example:
//   import client, { setAuthToken } from './openapi-client';
//   setAuthToken('your-token');
//   const { data, error } = await client.GET('/v0/orgs/{organization_id}/documents', { params: { path: { organization_id: '...' } } });

import createClient from 'openapi-fetch';
import type { paths } from '../../types/openapi';
import { getDocRouterApiBaseUrl } from './docRouterService';

let authToken: string | undefined = undefined;

export function setAuthToken(token: string) {
  authToken = token;
}

// Wrap fetch to inject Authorization header if token is set
const fetchWithAuth: typeof fetch = (input, init = {}) => {
  const headers = new Headers(init.headers || {});
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }
  return fetch(input, { ...init, headers });
};

const client = createClient<paths>({
  baseUrl: getDocRouterApiBaseUrl(),
  fetch: fetchWithAuth,
});

/**
 * Test the DocRouter API connection and token/org validity using OpenAPI client
 * @param organizationId - The organization ID to test with
 * @returns true if connection and token are valid, false otherwise
 */
export async function testDocRouterConnection(organizationId: string): Promise<boolean> {
  try {
    const { data, error } = await client.GET('/v0/orgs/{organization_id}/documents', {
      params: {
        path: { organization_id: organizationId },
        query: { skip: 0, limit: 10 }
      }
    });
    if (error) throw error;
    return Array.isArray(data?.documents);
  } catch (err) {
    console.error('DocRouter connection test failed:', err);
    return false;
  }
}

export default client;
