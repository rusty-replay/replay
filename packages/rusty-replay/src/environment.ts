export function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = 'unknown',
    os = 'unknown';

  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('SamsungBrowser')) browser = 'Samsung Browser';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  else if (ua.includes('Trident')) browser = 'IE';
  else if (ua.includes('Edge')) browser = 'Edge (Legacy)';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('like Mac')) os = 'iOS';

  return { browser, os, userAgent: ua };
}

export function getEnvironment(): 'development' | 'staging' | 'production' {
  if (process.env.NODE_ENV === 'development') return 'development';
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') return 'staging';
  return 'production';
}
