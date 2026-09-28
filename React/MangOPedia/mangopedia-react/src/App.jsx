import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRouter";
import { Bounce, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

function App() {
  const [currentTheme, setCurrentTheme] = useState(
    () => localStorage.getItem("bs-theme-fusion") || "light",
  );

  const toggleTheme = () => {
    setCurrentTheme((theme) => (theme === "light" ? "dark" : "light"));
  };

  const getThemeStyle = () => {
    if (currentTheme === "dark") {
      return {
        background: `linear-gradient(135deg, #434343 0%, #000000 25%, #2d1b69 50%, #11998e 75%, #38ef7d 100%)`,
      };
    } else {
      return {
        background: `linear-gradient(135deg, #a8edea 0%, #fed6e3 25%, #d299c2 50%, #fef9d7 75%, #a8edea 100%)`,
      };
    }
  };

  useEffect(() => {
    localStorage.setItem("bs-theme-fusion", currentTheme);
    document.body.setAttribute("data-bs-theme", currentTheme);
  }, [currentTheme]);

  return (
    <div
      className="d-flex flex-column min-vh-100 bg-body"
      style={getThemeStyle()}
    >
      <Header currentTheme={currentTheme} onToggleTheme={toggleTheme} />
      <main className="flex-grow-1">
        <AppRoutes />
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={currentTheme}
        transition={Bounce}
      />
    </div>
  );
}

export default App;
