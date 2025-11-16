import React from "react";
import { startLogin } from "./auth/login";

function App() {
  const accessToken = localStorage.getItem("access_token");

  async function createItem() {
    const res = await fetch(import.meta.env.VITE_API_URL + "/items", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: "1", name: "hello" }),
    });

    console.log(await res.json());
  }

  if (!accessToken) {
    return (
      <div className="login-page">
        <button onClick={startLogin}>
          Login with Cognito
        </button>
      </div>
    );
  }

  return (
    <div className="align-center">
      <h2>Welcome</h2>
      <button onClick={createItem}>Create DynamoDB Item</button>
    </div>
  );
}

export default App;
