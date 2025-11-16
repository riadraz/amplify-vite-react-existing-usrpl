import { generateCodeVerifier, generateCodeChallenge } from './pkce';

const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const domain = import.meta.env.VITE_COGNITO_DOMAIN;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

export async function startLogin() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  sessionStorage.setItem("pkce_verifier", codeVerifier);

  const url =
    `${domain}/oauth2/authorize?` +
    `response_type=code&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  window.location.href = url;
}
