import { Link } from "react-router-dom";
import styles from "./styles/Header.module.css";
import { useState } from "react";
import { useAuth } from "../ context/AuthContext";
import Modal from "./modals/Modal";

function Header() {
    const { logout, auth } = useAuth()!;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <header className={styles.header}>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <div>
                    <h1>Are you sure to log out?</h1>
                    <button
                        onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </Modal>{" "}
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
