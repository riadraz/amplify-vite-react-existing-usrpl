import { useState,useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../../amplify/data/resource";


const client = generateClient<Schema>();

export default function CreateTodo() {
  const [content, setContent] = useState("");
  //const [user, setUser] = useState<any>(null);
  //const [text, setText] = useState("");
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  async function createTodo() {
    if (!content.trim()) return;
    await client.models.Todo.create({ content });
    setContent("");
  }

  useEffect(() => {
      if (user) {
        client.models.Todo.observeQuery().subscribe({
          next: (data) => setTodos([...data.items]),
        });
        <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      }
    }, [user]);
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <input
        type="text"
        placeholder="Write your todo..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={createTodo}>Add</button>
    </div>
  );
}

