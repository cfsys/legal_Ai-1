/**
 * Google OAuth 2.0 Integration Utility for Legal AI
 * Uses Google Identity Services (GSI) via official token client & userinfo API
 */

export const DEFAULT_GOOGLE_CLIENT_ID = '223188447894-egelai42blktp0t05ji89jlthm6pqpmb.apps.googleusercontent.com';

export const hasCustomGoogleClientId = () => {
  const customId = localStorage.getItem('legal_google_client_id');
  return !!(customId && customId.trim() && !customId.includes('placeholder'));
};

export const getGoogleClientId = () => {
  const customId = localStorage.getItem('legal_google_client_id');
  if (customId && customId.trim() && !customId.includes('placeholder')) return customId.trim();

  const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (envId && envId.trim() && !envId.includes('placeholder')) {
    return envId.trim();
  }

  return DEFAULT_GOOGLE_CLIENT_ID;
};

export const setCustomGoogleClientId = (clientId) => {
  if (clientId && clientId.trim()) {
    localStorage.setItem('legal_google_client_id', clientId.trim());
  } else {
    localStorage.removeItem('legal_google_client_id');
  }
};

/**
 * Ensures the Google Identity Services client script is loaded in the DOM
 */
export const ensureGoogleGsiScript = () => {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      return resolve(true);
    }

    let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.google?.accounts?.oauth2) {
        clearInterval(interval);
        resolve(true);
      } else if (attempts >= 20) {
        clearInterval(interval);
        resolve(false);
      }
    }, 150);
  });
};

/**
 * Triggers the official Google Sign-In popup with strict timeout protection
 * @returns {Promise<{ email: string, name: string, googleId: string, picture?: string }>}
 */
export const triggerGoogleSignIn = () => {
  return new Promise(async (resolve, reject) => {
    const clientId = getGoogleClientId();

    if (!clientId) {
      return reject(new Error('NO_CLIENT_ID'));
    }

    // Ensure script is loaded
    await ensureGoogleGsiScript();

    if (!window.google?.accounts?.oauth2) {
      return reject(new Error('Google Identity Services could not load. Please check your internet connection or ad-blocker.'));
    }

    let settled = false;
    // Set 12-second timeout protection so promise never hangs if popup is blocked or closed by user
    const timeoutId = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error('POPUP_TIMEOUT_OR_BLOCKED'));
      }
    }, 12000);

    const safeResolve = (data) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeoutId);
        resolve(data);
      }
    };

    const safeReject = (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeoutId);
        reject(err);
      }
    };

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            return safeReject(new Error(tokenResponse.error_description || tokenResponse.error || 'Google login was cancelled or failed.'));
          }

          if (!tokenResponse.access_token) {
            return safeReject(new Error('No access token received from Google.'));
          }

          try {
            // Fetch verified user profile from Google's userinfo endpoint
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!res.ok) {
              throw new Error(`Failed to fetch Google profile: ${res.statusText}`);
            }

            const profile = await res.json();
            safeResolve({
              email: profile.email,
              name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || 'Google User',
              googleId: profile.sub,
              picture: profile.picture,
            });
          } catch (fetchErr) {
            safeReject(fetchErr);
          }
        },
        error_callback: (err) => {
          safeReject(new Error(err?.message || 'Google OAuth client error'));
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      safeReject(err);
    }
  });
};
