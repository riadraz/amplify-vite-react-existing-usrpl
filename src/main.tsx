import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { handleCallback } from './auth/callback';

function Root() {
  useEffect(() => {
    if (window.location.search.includes("code=")) {
      handleCallback().finally(() => {
        window.history.replaceState({}, "", "/");
      });
    }
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
