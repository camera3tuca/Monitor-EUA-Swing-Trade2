// API URL helper to route requests to backend server
// Handles web environments (relative path), Capacitor, and WebIntoApp (file:///android_asset/) runtime.

export const PRODUCTION_BACKEND_URL = 'https://ais-pre-ytsj4kie7lwtur34wzj5nf-45073816214.us-west2.run.app';

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (typeof window !== 'undefined') {
    const isOfflineApp =
      window.location.protocol === 'file:' ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'ionic:' ||
      window.location.origin === 'null' ||
      window.location.origin.startsWith('file:') ||
      Boolean((window as any).Capacitor?.isNativePlatform?.());

    if (isOfflineApp) {
      // In native WebIntoApp or Capacitor app, route to cloud backend server
      const customBackend = (window as any).__BACKEND_URL__;
      const targetBackend = customBackend || PRODUCTION_BACKEND_URL;
      return `${targetBackend.replace(/\/$/, '')}${cleanEndpoint}`;
    }
  }

  return cleanEndpoint;
}

