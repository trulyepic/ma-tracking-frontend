import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/header/Header";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Header />
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
