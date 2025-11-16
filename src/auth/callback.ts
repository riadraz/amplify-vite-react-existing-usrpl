const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const domain = import.meta.env.VITE_COGNITO_DOMAIN;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

export async function handleCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return null;

  const codeVerifier = sessionStorage.getItem("pkce_verifier");
  if (!codeVerifier) throw new Error("Missing PKCE verifier.");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const tokenRes = await fetch(`${domain}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const tokenJson = await tokenRes.json();

  localStorage.setItem("id_token", tokenJson.id_token);
  localStorage.setItem("access_token", tokenJson.access_token);
  localStorage.setItem("refresh_token", tokenJson.refresh_token);

  return tokenJson;
}
