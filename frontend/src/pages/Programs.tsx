import { useCallback, useEffect, useState } from "react";
import programApi from "../api/programApi";
import type { Program } from "../types/programTypes";
import styles from "./styles/Pages.module.css";
import PageNav from "../components/PageNav";
import { useAuth } from "../ context/AuthContext";
import ProgramModal from "../components/modals/ProgramModal";
import type { ProgramModalType } from "../types/programTypes";

function Programs() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [modalState, setModalState] = useState<ProgramModalType>({
        formType: "add",
        formData: {
            code: "",
            name: "",
            college_code: "",
        },
    });
    const { auth } = useAuth()!;
    const fetchPrograms = useCallback(async () => {
        const res = await programApi.fetchPrograms(auth.csrftoken);
        const resjson = await res.json();
        console.log(resjson.programs);
        setPrograms(resjson.programs);
    }, [auth.csrftoken]);
    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    return (
        <div className={styles.pageContent}>
            <ProgramModal onSuccess={fetchPrograms} modalState={modalState} />
            {/* <ProgramForm onSuccess={fetchPrograms} /> */}
            <h1>Programs</h1>
            <button
                onClick={() => {
                    setModalState({
                        formType: "add",
                        formData: {
                            code: "",
                            name: "",
                            college_code: "",
                        },
                    });
                }}
            >
                add
            </button>
            <div className={styles.contentContainer}>
                {programs.length === 0 ? (
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
                                        <td>{p.college_code}</td>
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
                                                    setModalState(() => ({
                                                        formType: "edit",
                                                        formData: p,
                                                    }));
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

export default Programs;
