import { TodoList } from './TodoList';
import { User } from '../auth/useAuth';

interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

export function Dashboard({ user, onSignOut }: DashboardProps) {
  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My todos</h1>
        <button onClick={onSignOut}>Sign Out</button>
      </div>
      <p>Welcome, {user.username}!</p>
      
      <TodoList />
      
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