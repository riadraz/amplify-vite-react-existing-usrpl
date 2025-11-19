import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
//import { signInWithRedirect, signOut, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { signInWithRedirect, signOut,} from "aws-amplify/auth";
//import { Hub } from "aws-amplify/utils";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [user, setUser] = useState<any>(null);
  
  // Check for OAuth callback immediately
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get('code');
  
  if (authCode && !user) {
    // Exchange code for tokens with client secret
    setTimeout(async () => {
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
        console.log('🎉 Token exchange response:', tokens);
        
        if (response.ok && tokens.access_token) {
          // Store tokens
          localStorage.setItem('access_token', tokens.access_token);
          localStorage.setItem('id_token', tokens.id_token);
          localStorage.setItem('refresh_token', tokens.refresh_token);
          
          // Decode ID token to get user info
          const payload = JSON.parse(atob(tokens.id_token.split('.')[1]));
          
          setUser({ 
            username: payload.email || payload.sub, 
            authenticated: true,
            tokens: tokens
          });
        } else {
          console.error('Token exchange failed:', tokens);
          setUser({ username: 'OAuth User', authenticated: true });
        }
      } catch (error) {
        console.error('Token exchange error:', error);
        setUser({ username: 'OAuth User', authenticated: true });
      }
      
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 0);
  }

  useEffect(() => {
    if (user) {
      client.models.Todo.observeQuery().subscribe({
        next: (data) => setTodos([...data.items]),
      });
    }
  }, [user]);

  async function handleSignIn() {
    try {
      console.log('Attempting sign in with redirect...');
      await signInWithRedirect();
    } catch (error) {
      console.error('Sign in error:', error);
      // Fallback to direct URL redirect
      const domain = "us-east-1yozx9xjpn.auth.us-east-1.amazoncognito.com";
      const clientId = "2pn88vv1jgsuspp50q0vfc9gf1";
      const redirectUri = encodeURIComponent("http://localhost:5173/");
      const url = `https://${domain}/login?client_id=${clientId}&response_type=code&scope=openid&redirect_uri=${redirectUri}`;
      window.location.href = url;
    }
  }

  async function handleSignOut() {
    await signOut();
    setUser(null);
  }

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }


  
  if (!user) {
    return (
      <main>
        <h1>Welcome to My Todos</h1>
        <button onClick={handleSignIn}>Sign In with Hosted UI</button>

      </main>
    );
  }

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My todos</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      <p>Welcome, {user.username}!</p>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
