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
    const [maxPage, setMaxPage] = useState<number>(1);
    const [queryParams, setQueryParams] = useState<QueryParams>({
        search: "",
        sortBy: "none",
        direction: "ASC",
        pageNumber: 1,
        limit: 5,
    });

    const { auth } = useAuth()!;
    const fetchPrograms = useCallback(async () => {
        const res = await programApi.fetchPrograms(queryParams, auth.csrftoken);
        const resjson = await res.json();
        console.log(resjson.programs);
        setPrograms(resjson.programs);
        setMaxPage(resjson.total_pages);
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
                                            <td style={{ width: "10px" }}>
                                                <button
                                                    onClick={async () => {
                                                        const response =
                                                            prompt(
                                                                "y to confirm"
                                                            );
                                                        if (response == "y") {
                                                            await programApi.fetchDeleteProgram(
                                                                auth.csrftoken,
                                                                p.code
                                                            );
                                                            fetchPrograms();
                                                        }
                                                    }}
                                                >
                                                    delete
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        p.college_code =
                                                            p.college_code ||
                                                            "";
                                                        setFormState(() => ({
                                                            formType: "edit",
                                                            formData: p,
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
