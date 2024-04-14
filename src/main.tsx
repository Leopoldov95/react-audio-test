import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

// Dependencies
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="55572557731-i05ib3omrrpdgdmpr6lej3ejp2mvd80v.apps.googleusercontent.com">
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
