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
import QueryBar from "../components/QueryBar";
import ConfirmPopup from "../components/modals/ConfirmPopup";
import deleteIcon from "../assets/delete.svg";
import editIcon from "../assets/edit.svg";

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
    const [confirmIsOpen, setConfirmIsOpen] = useState<boolean>(false);
    const [targetDelete, setTargetDelete] = useState<string | null>(null);

    const [maxPage, setMaxPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [queryParams, setQueryParams] = useState<QueryParams>({
        search: "",
        sortBy: "none",
        direction: "ASC",
        pageNumber: 1,
        limit: 10,
    });

    const { auth } = useAuth()!;

    const fetchStudents = useCallback(async () => {
        console.log("called");
        const res = await studentApi.fetchStudents(queryParams, auth.csrftoken);
        const resjson = await res.json();
        console.log(resjson);
        setStudents(resjson.students);
        setTotalCount(resjson.total_count);
        setMaxPage(Math.max(1, resjson.total_pages));
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
            <ConfirmPopup
                open={confirmIsOpen}
                onClose={() => setConfirmIsOpen(false)}
                onConfirm={async () => {
                    await studentApi.fetchDeleteStudent(
                        auth.csrftoken,
                        targetDelete as string
                    );
                    fetchStudents();
                    setTargetDelete(null);
                    setConfirmIsOpen(false);
                    if (queryParams.pageNumber > 1 && students?.length === 1) {
                        setQueryParams((prev) => ({
                            ...prev,
                            pageNumber: prev.pageNumber - 1,
                        }));
                    }
                }}
            >
                <p>Are you sure to delete {targetDelete}?</p>
            </ConfirmPopup>
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
                            gender: "m",
                            program_code: "",
                        },
                    });
                    setIsOpen(true);
                }}
                className={styles.addButton}
            >
                add
            </button>
            <QueryBar setQueryParams={setQueryParams} queryParams={queryParams}>
                <option value="">none</option>
                <option value="id">id</option>
                <option value="last_name">last name</option>
                <option value="year_level">year level</option>
                <option value="program_code">program</option>
            </QueryBar>
            {students && <p>total students : {totalCount}</p>}
            <div className={styles.contentContainer}>
                {students == null ? (
                    <div>loading...</div>
                ) : students.length === 0 ? (
                    <div>empty</div>
                ) : (
                    <div className={styles.tableContainer}>
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
                                            <td>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        width: "fit-content",
                                                        marginLeft: "auto",
                                                    }}
                                                >
                                                    <button
                                                        className="buttonIcon"
                                                        onClick={async () => {
                                                            setConfirmIsOpen(
                                                                true
                                                            );
                                                            setTargetDelete(
                                                                s.id
                                                            );
                                                        }}
                                                    >
                                                        <img
                                                            src={deleteIcon}
                                                            alt="delete"
                                                        />
                                                    </button>
                                                    <button
                                                        className="buttonIcon"
                                                        onClick={() => {
                                                            s.program_code =
                                                                s.program_code ||
                                                                "";
                                                            setFormState(
                                                                () => ({
                                                                    formType:
                                                                        "edit",
                                                                    formData: s,
                                                                })
                                                            );
                                                            setIsOpen(true);
                                                        }}
                                                    >
                                                        <img
                                                            src={editIcon}
                                                            alt="edit"
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
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
