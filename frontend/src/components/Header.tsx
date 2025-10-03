import { Link } from "react-router-dom";
import styles from "./styles/Header.module.css";
import { useState } from "react";
import { useAuth } from "../ context/AuthContext";
import ConfirmPopup from "./modals/ConfirmPopup";

function Header() {
    const { logout, auth } = useAuth()!;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <header className={styles.header}>
            <ConfirmPopup
                open={isOpen}
                onConfirm={() => {
                    logout();
                    setIsOpen(false);
                }}
                onClose={() => {
                    setIsOpen(false);
                }}
            >
                <p className="text-center">Are you sure to log out?</p>
            </ConfirmPopup>
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
                <button onClick={() => setIsOpen(true)}>logout</button>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </header>
    );
}

export default Header;
