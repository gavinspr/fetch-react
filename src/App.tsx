import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import './App.scss'
import { Login, Match, Search } from "./components/pages"
import ProtectedRoutes from "./components/ProtectedRoutes";

const App = () => {

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Route path="/search" element={<Search />} />
              <Route path="/match" element={<Match />} />
            </ProtectedRoutes>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router >
  )
}

export default App
