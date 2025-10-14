import ReactDom from "react-dom";
import styles from "./Modal.module.css";
import closeIcon from "../../assets/close.svg";
import homeIcon from "../../assets/home.svg";
import { Link } from "react-router-dom";

function SideBar({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null;
    return ReactDom.createPortal(
        <>
            <div className={styles.overlayStyles} onClick={onClose} />
            <div className={styles.sideBarStyles}>
                <div className="d-flex justify-content-end">
                    <img
                        className="ms-auto"
                        onClick={onClose}
                        src={closeIcon}
                        alt="close"
                    />
                </div>
                <div className="d-flex flex-column gap-4 p-4">
                    <Link to={"/home"}>
                        <div className="d-flex align-items-center gap-1">
                            <img src={homeIcon} alt="home" />
                            <p className="m-0">Home</p>
                        </div>
                    </Link>
                    <Link to={"/students"}>Students</Link>
                    <Link to={"/programs"}>Programs</Link>
                    <Link to={"/colleges"}>Colleges</Link>
                </div>
            </div>
        </>,
        document.getElementById("portal")!
    );
}

export default SideBar;
