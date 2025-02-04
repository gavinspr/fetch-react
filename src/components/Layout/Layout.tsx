import { Outlet, Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils";
import styles from "./Layout.module.scss";
import { useAuth } from "../../contexts";

const Layout = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const currentYear: number = new Date().getFullYear();

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err: any) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <div className={styles.wrap}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link to="/">Fetch A Friend</Link>
        </div>
        <div className={styles.navRight}>
          {isAuthenticated && (
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          )}
        </div>
      </nav>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>&copy; Fetch A Friend {currentYear}</p>
      </footer>
    </div>
  );
};

export default Layout;
