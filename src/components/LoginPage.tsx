interface LoginPageProps {
  onSignIn: () => void;
}

export function LoginPage({ onSignIn }: LoginPageProps) {
  return (
    <main>
      <h1>Welcome to My Todos</h1>
      <button onClick={onSignIn}>Sign In with Hosted UI</button>
    </main>
  );
}