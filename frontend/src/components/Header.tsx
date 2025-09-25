import { Link } from "react-router-dom";
import styles from "./styles/Header.module.css";

function Header() {
    return (
        <header className={styles.header}>
            <Link to={"/home"}>Home</Link>
            <div>
                <Link to={"/students"}>Students</Link>
                <Link to={"/programs"}>Programs</Link>
                <Link to={"/colleges"}>Colleges</Link>
            </div>
            <button>login/logout</button>
        </header>
    );
}

export default Header;
