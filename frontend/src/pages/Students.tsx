import { useCallback, useEffect, useState } from "react";
import studentApi from "../api/studentApi";
import type { Student } from "../types/studentTypes";
import styles from "./styles/Pages.module.css";
import PageNav from "../components/PageNav";
import { useAuth } from "../ context/AuthContext";
import type { StudentModalType } from "../types/studentTypes";
import Modal from "../components/modals/Modal";
import StudentForm from "../components/forms/StudentForms";

function Students() {
    const [students, setStudents] = useState<Student[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [formState, setFormState] = useState<StudentModalType>({
        formType: "add",
        formData: {
            id: "",
            first_name: "",
            last_name: "",
            year_level: 1,
            gender: "",
            program_code: "",
        },
    });
    // query params here?
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { auth } = useAuth()!;

    const fetchStudents = useCallback(async () => {
        console.log("called");
        const res = await studentApi.fetchStudents(auth.csrftoken);
        const resjson = await res.json();
        console.log(resjson);
        setStudents(resjson.students);
    }, [auth.csrftoken]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]); //include here dependency for queries

    return (
        <div className={styles.pageContent}>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <StudentForm
                    onSuccess={async () => {
                        await fetchStudents();
                        setIsOpen(false);
                    }}
                    formDataOriginal={formState.formData}
                    formType={formState.formType}
                />
            </Modal>
            <h1>Students</h1>
            <button
                onClick={() => {
                    setFormState({
                        formType: "add",
                        formData: {
                            id: "",
                            first_name: "",
                            last_name: "",
                            year_level: 1,
                            gender: "",
                            program_code: "",
                        },
                    });
                    setIsOpen(true);
                }}
            >
                add
            </button>
            <div className={styles.contentContainer}>
                {students.length === 0 ? (
                    <div>empty</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>firstName</th>
                                <th>lastName</th>
                                <th>year</th>
                                <th>gender</th>
                                <th>program</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => {
                                return (
                                    <tr key={s.id}>
                                        <td>{s.id}</td>
                                        <td>{s.first_name}</td>
                                        <td>{s.last_name}</td>
                                        <td>{s.year_level}</td>
                                        <td>{s.gender}</td>
                                        <td>{s.program_code || "null"}</td>
                                        <td style={{ width: "10px" }}>
                                            <button
                                                onClick={async () => {
                                                    const response =
                                                        prompt("y to confirm");
                                                    if (response == "y") {
                                                        await studentApi.fetchDeleteStudent(
                                                            auth.csrftoken,
                                                            s.id
                                                        );
                                                        fetchStudents();
                                                    }
                                                }}
                                            >
                                                delete
                                            </button>
                                            <button
                                                onClick={() => {
                                                    s.program_code =
                                                        s.program_code || "";
                                                    setFormState(() => ({
                                                        formType: "edit",
                                                        formData: s,
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

export default Students;
