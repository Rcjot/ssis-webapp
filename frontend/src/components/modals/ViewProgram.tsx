import { useEffect, useState } from "react";
import { useAuth } from "../../ context/AuthContext";
import styles from "../forms/Forms.module.css";
import type { ProgramViewType } from "../../types/programTypes";
import programApi from "../../api/programApi";

function ViewProgram({ program_code }: { program_code: string | null }) {
    const { auth } = useAuth()!;
    const [programDetails, setProgramDetails] =
        useState<ProgramViewType | null>(null);

    useEffect(() => {
        const fetchView = async () => {
            if (!program_code) return;
            const res = await programApi.fetchViewProgram(
                program_code,
                auth.csrftoken
            );
            const resjson = await res.json();

            setProgramDetails(resjson["program"]);
        };

        fetchView();
    }, [program_code, auth]);

    if (!programDetails || !program_code) return <div>loading..</div>;

    return (
        <div
            className={styles.formStyle}
            style={{ minWidth: "30vw", gap: "2px" }}
        >
            <div>
                <label htmlFor="code">code</label>
                <div>{programDetails.code}</div>
            </div>
            <div>
                <label htmlFor="name">name</label>
                <div>{programDetails.name}</div>
            </div>
            <div>
                <label htmlFor="college_code">college</label>
                <div>
                    {programDetails.college ? programDetails.college.name : "-"}
                </div>
            </div>
            <div>
                <label htmlFor="college_code">students count</label>
                <div>{programDetails.student_count}</div>
            </div>
        </div>
    );
}

export default ViewProgram;
