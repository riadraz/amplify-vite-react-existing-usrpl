import { useState, useEffect } from 'react';
import { signInWithRedirect, signOut } from 'aws-amplify/auth';

export interface User {
  username: string;
  authenticated: boolean;
  tokens?: any;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    
    if (authCode && !user) {
      try {
        const clientId = '2pn88vv1jgsuspp50q0vfc9gf1';
        const clientSecret = '15odpmro74nm6767e1g1u28f3dlna9ak7osp95o6fjoh7051n0v4';
        const credentials = btoa(`${clientId}:${clientSecret}`);
        
        const response = await fetch(`https://us-east-1yozx9xjpn.auth.us-east-1.amazoncognito.com/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: clientId,
            code: authCode,
            redirect_uri: 'http://localhost:5173/'
          })
        });
        
        const tokens = await response.json();
        
        if (response.ok && tokens.access_token) {
          localStorage.setItem('access_token', tokens.access_token);
          localStorage.setItem('id_token', tokens.id_token);
          localStorage.setItem('refresh_token', tokens.refresh_token);
          
          const payload = JSON.parse(atob(tokens.id_token.split('.')[1]));
          
          setUser({ 
            username: payload.email || payload.sub, 
            authenticated: true,
            tokens: tokens
          });
        } else {
          setUser({ username: 'OAuth User', authenticated: true });
        }
      } catch (error) {
        console.error('Token exchange error:', error);
        setUser({ username: 'OAuth User', authenticated: true });
      }
      
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const signIn = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Sign in error:', error);
      const domain = "us-east-1yozx9xjpn.auth.us-east-1.amazoncognito.com";
      const clientId = "2pn88vv1jgsuspp50q0vfc9gf1";
      const redirectUri = encodeURIComponent("http://localhost:5173/");
      const url = `https://${domain}/login?client_id=${clientId}&response_type=code&scope=openid&redirect_uri=${redirectUri}`;
      window.location.href = url;
    }
  };

  const signOutUser = async () => {
    await signOut();
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return { user, signIn, signOut: signOutUser };
}