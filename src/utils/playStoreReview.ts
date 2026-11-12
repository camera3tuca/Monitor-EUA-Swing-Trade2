/**
 * Google Play Store & WhatsApp Deep-Link Helper
 *
 * Ensures links open cleanly across:
 * 1. Android WebView / WebIntoApp
 * 2. Mobile browsers (Android / iOS)
 * 3. Desktop browsers & preview iframes
 */

export const PLAY_STORE_PACKAGE_ID = 'com.sciencebit.wallstreetscanner';
export const PLAY_STORE_WEB_URL = `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE_ID}`;
export const PLAY_STORE_MARKET_URI = `market://details?id=${PLAY_STORE_PACKAGE_ID}`;

export const WHATSAPP_PHONE = '5562942632021';
export const WHATSAPP_DISPLAY = '+55 (62) 94263-2021';
export const WHATSAPP_DEFAULT_TEXT = 'Olá, estou usando o Wall Street Scanner e gostaria de tirar uma dúvida';
export const WHATSAPP_WEB_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(WHATSAPP_DEFAULT_TEXT)}`;

declare global {
  interface Window {
    AndroidReview?: {
      requestInAppReview?: () => void;
    };
    WebIntoApp?: {
      rateApp?: () => void;
      showRatingDialog?: () => void;
    };
    AndroidApp?: {
      rate?: () => void;
    };
  }
}

export const isAndroidDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /android/i.test(navigator.userAgent || '');
};

/**
 * Always return the official https:// URL for <a href="..."> attributes
 * so target="_blank" never fails with ERR_UNKNOWN_URL_SCHEME in WebViews.
 * Android App Links automatically open the Play Store app from this URL.
 */
export const getPlayStoreHref = (): string => {
  return PLAY_STORE_WEB_URL;
};

/**
 * Triggers the Google Play Review flow safely
 */
export const openPlayStoreReview = (): void => {
  if (typeof window === 'undefined') return;

  if (window.AndroidReview && typeof window.AndroidReview.requestInAppReview === 'function') {
    try {
      window.AndroidReview.requestInAppReview();
      return;
    } catch (e) {
      console.warn('AndroidReview bridge error:', e);
    }
  }

  if (window.WebIntoApp && typeof window.WebIntoApp.rateApp === 'function') {
    try {
      window.WebIntoApp.rateApp();
      return;
    } catch (e) {
      console.warn('WebIntoApp rateApp error:', e);
    }
  }

  window.open(PLAY_STORE_WEB_URL, '_blank', 'noopener,noreferrer');
};
