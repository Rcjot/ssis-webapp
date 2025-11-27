import { useEffect, useState } from "react";
import type { StudentViewType } from "../../types/studentTypes";
import studentApi from "../../api/studentApi";
import { useAuth } from "../../ context/AuthContext";
import styles from "../forms/Forms.module.css";
import stylesProfile from "../profilepic/profile.module.css";

const baseurl: string = import.meta.env.VITE_SUPABASE_BASEURL;
import defaultpfp from "@/assets/defaultpfp.png";

function ViewStudent({ student_id }: { student_id: string | null }) {
    const { auth } = useAuth()!;
    const [studentDetails, setStudentDetails] =
        useState<StudentViewType | null>(null);

    useEffect(() => {
        const fetchView = async () => {
            if (!student_id) return;
            const res = await studentApi.fetchViewStudent(
                student_id,
                auth.csrftoken
            );
            const resjson = await res.json();
            console.log(resjson["student"]);

            setStudentDetails(resjson["student"]);
        };

        fetchView();
    }, [student_id, auth]);

    if (!studentDetails || !student_id) return <div>loading..</div>;

    return (
        <div
            className={styles.formStyle}
            style={{ minWidth: "30vw", gap: "5em" }}
        >
            <img
                src={
                    studentDetails.student_pfp_path
                        ? `${baseurl}${studentDetails.student_pfp_path}`
                        : defaultpfp
                }
                alt="choose photo"
                className={`${stylesProfile.profileImage} rounded-circle`}
                style={{ alignSelf: "center" }}
            />

            <div className={styles.subformView}>
                <div>
                    <label htmlFor="id">id</label>
                    <div>{studentDetails.id}</div>
                </div>
                <div>
                    <label htmlFor="full_name">Full Name</label>
                    <div>
                        {studentDetails.first_name} {studentDetails.last_name}
                    </div>
                </div>

                <div>
                    <label htmlFor="year_level">year level</label>
                    <div>{studentDetails.year_level}</div>
                </div>
                <div>
                    <label htmlFor="gender">gender</label>
                    <div>{studentDetails.gender}</div>
                </div>
                <div>
                    <label htmlFor="program">program</label>
                    <div>
                        {studentDetails.program
                            ? studentDetails.program.name
                            : "-"}
                    </div>
                </div>
                <div>
                    <label htmlFor="college">college</label>
                    <div>
                        {studentDetails.college
                            ? studentDetails.college.name
                            : "-"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewStudent;
