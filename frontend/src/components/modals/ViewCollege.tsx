import { useEffect, useState } from "react";
import { useAuth } from "../../ context/AuthContext";
import styles from "../forms/Forms.module.css";
import type { CollegeViewType } from "../../types/collegeTypes";
import collegeApi from "../../api/collegeApi";

function ViewCollege({ college_code }: { college_code: string | null }) {
    const { auth } = useAuth()!;
    const [collegeDetails, setCollegeDetails] =
        useState<CollegeViewType | null>(null);

    useEffect(() => {
        const fetchView = async () => {
            if (!college_code) return;
            const res = await collegeApi.fetchViewCollege(
                college_code,
                auth.csrftoken
            );
            const resjson = await res.json();

            setCollegeDetails(resjson["college"]);
        };

        fetchView();
    }, [college_code, auth]);

    if (!collegeDetails || !college_code) return <div>loading..</div>;

    return (
        <div
            className={styles.formStyle}
            style={{ minWidth: "30vw", gap: "2px" }}
        >
            <div>
                <label htmlFor="code">code</label>
                <div>{collegeDetails.code}</div>
            </div>
            <div>
                <label htmlFor="name">name</label>
                <div>{collegeDetails.name}</div>
            </div>

            <div>
                <label htmlFor="student_count">students count</label>
                <div>{collegeDetails.student_count}</div>
            </div>
            <div>
                <label htmlFor="program_count">programs count</label>
                <div>{collegeDetails.program_count}</div>
            </div>
        </div>
    );
}

export default ViewCollege;
