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
                aria-label="program query"
                name="query"
                id="program_query"
                value={queryParams.sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setQueryParams((prev) => ({
                        ...prev,
                        sortBy: e.target.value,
                    }))
                }
            >
                <option value="">none</option>
                <option value="code">code</option>
                <option value="college_code">college</option>
            </select>
            <div className={styles.contentContainer}>
                {programs == null ? (
                    <div>loading...</div>
                ) : programs.length === 0 ? (
                    <div>empty</div>
                ) : (
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
                                                        prompt("y to confirm");
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
                                                        p.college_code || "";
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
