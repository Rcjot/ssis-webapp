import { useCallback, useEffect, useState } from "react";
import studentApi from "../api/studentApi";
import type { Student } from "../types/studentTypes";
import styles from "./styles/Pages.module.css";
import PageNav from "../components/PageNav";
import { useAuth } from "../ context/AuthContext";
import type { StudentModalType } from "../types/studentTypes";
import Modal from "../components/modals/Modal";
import StudentForm from "../components/forms/StudentForms";
import type { QueryParams } from "../types/types";

function Students() {
    const [students, setStudents] = useState<Student[] | null>(null);
    const [formState, setFormState] = useState<StudentModalType>({
        formType: "add",
        formData: {
            id: "",
            first_name: "",
            last_name: "",
            year_level: 1,
            gender: "m",
            program_code: "",
        },
    });
    // query params here?
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [maxPage, setMaxPage] = useState<number>(1);
    const [queryParams, setQueryParams] = useState<QueryParams>({
        search: "",
        sortBy: "none",
        pageNumber: 1,
        limit: 5,
    });

    const { auth } = useAuth()!;

    const fetchStudents = useCallback(async () => {
        console.log("called");
        const res = await studentApi.fetchStudents(queryParams, auth.csrftoken);
        const resjson = await res.json();
        console.log(resjson);
        setStudents(resjson.students);
        setMaxPage(resjson.total_pages);
    }, [queryParams, auth.csrftoken]);

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
            <label htmlFor="search"></label>
            <input
                type="text"
                name="search"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setQueryParams((prev) => ({
                        ...prev,
                        search: e.target.value,
                    }))
                }
            />
            <label htmlFor="sortBy">sort by</label>
            <select
                className="form-select"
                aria-label="student query"
                name="query"
                id="student_query"
                value={queryParams.sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setQueryParams((prev) => ({
                        ...prev,
                        sortBy: e.target.value,
                    }))
                }
            >
                <option value="">none</option>
                <option value="last_name">last name</option>
                <option value="program">program</option>
            </select>
            <div className={styles.contentContainer}>
                {students == null ? (
                    <div>loading...</div>
                ) : students.length === 0 ? (
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
                    pageNumber={queryParams.pageNumber}
                    maxPage={maxPage}
                    limit={queryParams.limit}
                    setQueryParams={setQueryParams}
                />
            </div>
        </div>
    );
}

export default Students;
