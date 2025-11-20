import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export function TodoList() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await client.models.Todo.create({ content: newTodo.trim() });
      setNewTodo("");
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    } else if (e.key === 'Escape') {
      setNewTodo("");
      setIsAdding(false);
    }
  };

  return (
    <div>
      {isAdding ? (
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter todo content..."
            autoFocus
            style={{ 
              padding: '8px', 
              marginRight: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              minWidth: '200px'
            }}
          />
          <button onClick={handleAddTodo} style={{ marginRight: '4px' }}>Add</button>
          <button onClick={() => { setNewTodo(""); setIsAdding(false); }}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)} style={{ marginBottom: '1rem' }}>
          + new
        </button>
      )}
      
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
    </div>
  );
}