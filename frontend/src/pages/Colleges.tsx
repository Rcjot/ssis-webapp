import { useCallback, useEffect, useState } from "react";
import type { College } from "../types/collegeTypes";
import styles from "./styles/Pages.module.css";
import PageNav from "../components/PageNav";
import collegeApi from "../api/collegeApi";
import { useAuth } from "../ context/AuthContext";
import type { CollegeModalType } from "../types/collegeTypes";
import Modal from "../components/modals/Modal";
import CollegeForm from "../components/forms/CollegeForms";

function Colleges() {
    const [colleges, setColleges] = useState<College[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [formState, setFormState] = useState<CollegeModalType>({
        formType: "add",
        formData: {
            code: "",
            name: "",
        },
    });
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { auth } = useAuth()!;
    const fetchColleges = useCallback(async () => {
        const res = await collegeApi.fetchColleges(auth.csrftoken);
        const resjson = await res.json();
        setColleges(resjson.colleges);
        console.log(resjson);
    }, [auth.csrftoken]);
    useEffect(() => {
        fetchColleges();
    }, [fetchColleges]);

    return (
        <div className={styles.pageContent}>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <CollegeForm
                    onSuccess={async () => {
                        await fetchColleges();
                        setIsOpen(false);
                    }}
                    formDataOriginal={formState.formData}
                    formType={formState.formType}
                />
            </Modal>
            <h1>Colleges</h1>
            <button
                onClick={() => {
                    setFormState({
                        formType: "add",
                        formData: {
                            code: "",
                            name: "",
                        },
                    });
                    setIsOpen(true);
                }}
            >
                add
            </button>
            <div className={styles.contentContainer}>
                {colleges.length === 0 ? (
                    <div>empty</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {colleges.map((c) => {
                                return (
                                    <tr key={c.code}>
                                        <td>{c.code}</td>
                                        <td>{c.name}</td>
                                        <td style={{ width: "10px" }}>
                                            <button
                                                onClick={async () => {
                                                    const response =
                                                        prompt("y to confirm");
                                                    if (response == "y") {
                                                        await collegeApi.fetchDeleteCollege(
                                                            auth.csrftoken,
                                                            c.code
                                                        );
                                                        fetchColleges();
                                                    }
                                                }}
                                            >
                                                delete
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setFormState(() => ({
                                                        formType: "edit",
                                                        formData: c,
                                                    }));
                                                    setIsOpen(true);
                                                }}
                                            >
                                                edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                <PageNav
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                />
            </div>
        </div>
    );
}

export default Colleges;
