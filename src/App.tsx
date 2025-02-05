import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.scss";
import { LoginPage, Match, DogSearchPage } from "./components/pages";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { ToastContainer } from "react-toastify";
import Layout from "./components/Layout/Layout";
import { AuthProvider } from "./contexts";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Navigate to="/search" replace />} />
              <Route path="/search" element={<DogSearchPage />} />
              <Route path="/match" element={<Match />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <ToastContainer
          position="bottom-right"
          theme="colored"
          hideProgressBar
          autoClose={2000}
        />
      </AuthProvider>
    </Router>
  );
};

export default App;
