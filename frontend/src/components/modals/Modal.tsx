import type React from "react";
import ReactDom from "react-dom";
import styles from "./Modal.module.css";
import closeIcon from "../../assets/close.svg";

function Modal({
    open,
    onClose,
    children,
}: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    if (!open) return null;
    return ReactDom.createPortal(
        <>
            <div className={styles.overlayStyles} />
            <div className={styles.modalStyles}>
                <button
                    className="buttonIcon"
                    style={{ margin: "12px 0px 0px 12px", padding: "3px" }}
                    onClick={onClose}
                >
                    <img
                        style={{ width: "32px", height: "32px" }}
                        src={closeIcon}
                        alt="close"
                    />
                </button>
                <div className={styles.modalContent}>{children}</div>
            </div>
        </>,
        document.getElementById("portal")!
    );
}

export default Modal;
