export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // Log event in console for developer transparency
  console.log(`[Analytics Event]: ${eventName}`, params);

  // Send event to Google Analytics (gtag) if installed
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }

  // Push event to Google Tag Manager dataLayer if installed
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...params,
    });
  }
};
