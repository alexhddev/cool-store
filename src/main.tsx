import { Amplify } from "aws-amplify";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import outputs from "../amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);
console.log('Amplify.configure(outputs);')

ReactDOM.createRoot(document.getElementById("root")!).render(
  
    <Authenticator>
      <App />
    </Authenticator>

);
