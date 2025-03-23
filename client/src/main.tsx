import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Firebase is initialized in the firebase.ts file, so we don't need to do it here

createRoot(document.getElementById("root")!).render(<App />);
