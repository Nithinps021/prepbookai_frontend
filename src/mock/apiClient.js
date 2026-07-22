import { auth } from '../firebase'

// Utility to get the current Firebase token
export async function getFirebaseToken() {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
}

/**
 * A wrapper around the standard fetch API that automatically attaches
 * the Firebase ID token as a Bearer token in the Authorization header.
 */
export async function fetchWithAuth(url, options = {}) {
  const token = await getFirebaseToken();
  
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const newOptions = {
    ...options,
    headers,
    cache: 'no-store'
  };

  return fetch(url, newOptions);
}
