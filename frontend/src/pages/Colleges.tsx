import { useEffect, useState } from "react";
import ssisApi from "../api/ssisApi";
import type { College } from "../types/types";
import styles from "./styles/Pages.module.css";
import PageNav from "../components/PageNav";

function Colleges() {
    const [colleges, setColleges] = useState<College[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(1);

    useEffect(() => {
        const fetchColleges = async () => {
            const res = await ssisApi.fetchColleges();
            const resjson = await res.json();
            setColleges(resjson.colleges);
        };
        fetchColleges();
    }, []);

    return (
        <div className={styles.pageContent}>
            <h1>Colleges</h1>
            <div className={styles.contentContainer}>
                {colleges.length === 0 ? (
                    <div>empty</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {colleges.map((c) => {
                                return (
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.name}</td>
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
