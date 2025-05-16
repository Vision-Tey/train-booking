import { Suspense } from "react";
import { useRoutes, Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./components/home";
import SearchPage from "./components/search/SearchPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminPanel from "./components/admin/AdminPanel";
import { AuthProvider, RequireAuth, RequireAdmin } from "./lib/auth.tsx";
import routes from "tempo-routes";

function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/bookings"
            element={
              <RequireAuth>
                <div>My Bookings</div>
              </RequireAuth>
            }
          />
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <AdminPanel />
              </RequireAdmin>
            }
          />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
