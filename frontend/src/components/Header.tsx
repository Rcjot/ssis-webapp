import { Link } from "react-router-dom";
import styles from "./styles/Header.module.css";
import { useState } from "react";
import { useAuth } from "../ context/AuthContext";
import ConfirmPopup from "./modals/ConfirmPopup";
import homeIcon from "../assets/home.svg";
import { useLocation } from "react-router-dom";

function Header() {
    const { logout, auth } = useAuth()!;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const location = useLocation();

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

            {auth.status === "authenticated" && (
                <>
                    <Link to={"/home"}>
                        <img
                            style={{ height: "32px", width: "32px" }}
                            src={homeIcon}
                            alt="home"
                        />
                    </Link>
                    <div>
                        <Link
                            className={
                                location.pathname === "/students"
                                    ? styles.current
                                    : ""
                            }
                            to={"/students"}
                        >
                            Students
                        </Link>
                        <Link
                            className={
                                location.pathname === "/programs"
                                    ? styles.current
                                    : ""
                            }
                            to={"/programs"}
                        >
                            Programs
                        </Link>
                        <Link
                            className={
                                location.pathname === "/colleges"
                                    ? styles.current
                                    : ""
                            }
                            to={"/colleges"}
                        >
                            Colleges
                        </Link>
                    </div>
                </>
            )}
            {auth.status === "authenticated" ? (
                <button onClick={() => setIsOpen(true)}>logout</button>
            ) : (
                <Link to="/login" style={{ marginLeft: "auto" }}>
                    Login
                </Link>
            )}
        </header>
    );
}

export default Header;
