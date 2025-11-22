import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export default function CreateTodo() {
  const [content, setContent] = useState("");
  
  async function createTodo() {
    if (!content.trim()) return;
    await client.models.Todo.create({ content });
    setContent("");
  }
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

