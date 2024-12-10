import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import Places from "./Places";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <BrowserRouter>
    <Places />
  </BrowserRouter>
);