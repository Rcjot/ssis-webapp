import { Link } from "react-router-dom";
import styles from "./styles/Header.module.css";
import { useAuth } from "../ context/AuthContext";

function Header() {
    const { logout, auth } = useAuth()!;
    return (
        <header className={styles.header}>
            <Link to={"/home"}>Home</Link>
            {auth.status === "authenticated" && (
                <>
                    <div>
                        <Link to={"/students"}>Students</Link>
                        <Link to={"/programs"}>Programs</Link>
                        <Link to={"/colleges"}>Colleges</Link>
                    </div>
                </>
            )}
            {auth.status === "authenticated" ? (
                <button onClick={logout}>logout</button>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </header>
    );
}

export default Header;
