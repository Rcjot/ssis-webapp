import type React from "react";
import ReactDom from "react-dom";
import styles from "./Modal.module.css";

function ConfirmPopup({
    open,
    children,
    onConfirm,
    onClose,
}: {
    open: boolean;
    children: React.ReactNode;
    onConfirm: () => void;
    onClose: () => void | (() => Promise<void>);
}) {
    if (!open) return null;
    return ReactDom.createPortal(
        <>
            <div className={styles.overlayStyles} />
            <div className={styles.modalStyles}>
                <div className={styles.modalContent}>
                    {children}
                    <div className="d-flex gap-4">
                        <button onClick={onClose}>cancel</button>
                        <button onClick={onConfirm}>confirm</button>
                    </div>
                </div>
            </div>
        </>,
        document.getElementById("portal")!
    );
}

export default ConfirmPopup;
