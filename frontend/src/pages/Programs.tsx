import { useEffect, useState } from "react";
import ssisApi from "../api/ssisApi";
import type { Program } from "../types/types";
import styles from "./styles/Pages.module.css";
import PageNav from "../components/PageNav";

function Programs() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(1);

    useEffect(() => {
        const fetchPrograms = async () => {
            const res = await ssisApi.fetchPrograms();
            const resjson = await res.json();
            setPrograms(resjson.programs);
        };
        fetchPrograms();
    }, []);

    return (
        <div className={styles.pageContent}>
            <h1>Programs</h1>
            <div className={styles.contentContainer}>
                {programs.length === 0 ? (
                    <div>empty</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>name</th>
                                <th>college</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programs.map((p) => {
                                return (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>{p.name}</td>
                                        <td>{p.college}</td>
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
