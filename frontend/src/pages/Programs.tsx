import { useCallback, useEffect, useState } from "react";
import programApi from "../api/programApi";
import type { Program } from "../types/programTypes";
import styles from "./styles/Pages.module.css";
import PageNav from "../components/PageNav";
import { useAuth } from "../ context/AuthContext";
import type { ProgramModalType } from "../types/programTypes";
import ProgramForm from "../components/forms/ProgramForms";
import Modal from "../components/modals/Modal";
import type { QueryParams } from "../types/types";
import QueryBar from "../components/QueryBar";
import ConfirmPopup from "../components/modals/ConfirmPopup";
import deleteIcon from "../assets/delete.svg";
import editIcon from "../assets/edit.svg";

function Programs() {
    const [programs, setPrograms] = useState<Program[] | null>(null);
    const [formState, setFormState] = useState<ProgramModalType>({
        formType: "add",
        formData: {
            code: "",
            name: "",
            college_code: "",
        },
    });
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [confirmIsOpen, setConfirmIsOpen] = useState<boolean>(false);
    const [targetDelete, setTargetDelete] = useState<string | null>(null);

    const [maxPage, setMaxPage] = useState<number>(1);
    const [queryParams, setQueryParams] = useState<QueryParams>({
        search: "",
        sortBy: "none",
        direction: "ASC",
        pageNumber: 1,
        limit: 10,
    });

    const { auth } = useAuth()!;
    const fetchPrograms = useCallback(async () => {
        const res = await programApi.fetchPrograms(queryParams, auth.csrftoken);
        const resjson = await res.json();
        console.log(resjson.programs);
        setPrograms(resjson.programs);
        setMaxPage(Math.max(1, resjson.total_pages));
    }, [queryParams, auth.csrftoken]);

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    return (
        <div className={styles.pageContent}>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <ProgramForm
                    onSuccess={async () => {
                        await fetchPrograms();
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
                    await programApi.fetchDeleteProgram(
                        auth.csrftoken,
                        targetDelete as string
                    );
                    fetchPrograms();
                    setTargetDelete(null);
                    setConfirmIsOpen(false);
                    if (queryParams.pageNumber > 1 && programs?.length === 1) {
                        setQueryParams((prev) => ({
                            ...prev,
                            pageNumber: prev.pageNumber - 1,
                        }));
                    }
                }}
            >
                <p>Are you sure to delete {targetDelete}?</p>
            </ConfirmPopup>
            <h1>Programs</h1>
            <button
                onClick={() => {
                    setFormState({
                        formType: "add",
                        formData: {
                            code: "",
                            name: "",
                            college_code: "",
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
                <option value="code">code</option>
                <option value="name">name</option>
                <option value="college_code">college</option>
            </QueryBar>
            <div className={styles.contentContainer}>
                {programs == null ? (
                    <div>loading...</div>
                ) : programs.length === 0 ? (
                    <div>empty</div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>code</th>
                                    <th>name</th>
                                    <th>college</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.map((p) => {
                                    return (
                                        <tr key={p.code}>
                                            <td>{p.code}</td>
                                            <td>{p.name}</td>
                                            <td>{p.college_code || "null"}</td>
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
                                                                p.code
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
                                                            p.college_code =
                                                                p.college_code ||
                                                                "";
                                                            setFormState(
                                                                () => ({
                                                                    formType:
                                                                        "edit",
                                                                    formData: p,
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

export default Programs;
