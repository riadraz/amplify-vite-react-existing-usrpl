import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";


Amplify.configure({
  ...outputs,
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_yoZX9xJPN",
      userPoolClientId: "2pn88vv1jgsuspp50q0vfc9gf1",
      userPoolClientSecret: "15odpmro74nm6767e1g1u28f3dlna9ak7osp95o6fjoh7051n0v4", // Replace with your actual client secret
      identityPoolId: "us-east-1:517cc24f-b02d-4754-a7e8-f555cfa6c205",
      loginWith: {
        oauth: {
          domain: "us-east-1yozx9xjpn.auth.us-east-1.amazoncognito.com",
          scopes: ["openid"],
          redirectSignIn: ["http://localhost:5173/"],
          redirectSignOut: ["http://localhost:5173/"],
          responseType: "code"
        }
      }
    }
  }
} as any);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
