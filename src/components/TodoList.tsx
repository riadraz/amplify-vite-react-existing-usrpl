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

  const handleDeleteTodo = async (id: string) => {
    await client.models.Todo.delete({ id });
  };

  return (
    <div>
      <div style={{ height: '60px', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start' }}>
        {isAdding ? (
          <div>
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
          <button onClick={() => setIsAdding(true)}>
            + new
          </button>
        )}
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', padding: '4px 0' }}>
            <span>{todo.content}</span>
            <button 
              onClick={() => handleDeleteTodo(todo.id)}
              style={{ 
                background: '#ff4444', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                padding: '4px 4px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}