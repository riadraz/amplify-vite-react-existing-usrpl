import { useAuth } from './auth/useAuth';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

function App() {
  const { user, signIn, signOut } = useAuth();

  if (!user) {
    return <LoginPage onSignIn={signIn} />;
  }

  return <Dashboard user={user} onSignOut={signOut} />;
}

export default App;