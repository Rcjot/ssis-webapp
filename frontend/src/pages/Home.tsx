import { useAuth } from "../ context/AuthContext";
import collegeApi from "../api/collegeApi";
import programApi from "../api/programApi";
import studentApi from "../api/studentApi";
import type { QueryParams } from "../types/types";
import styles from "./styles/Pages.module.css";
import { useCallback, useEffect, useState } from "react";
import university from "../assets/university.jpg";

function Home() {
    const { auth } = useAuth()!;
    const [totalStudentsCount, setTotalStudentsCount] = useState<number | null>(
        null
    );
    const [totalProgramsCount, setTotalProgramsCount] = useState<number | null>(
        null
    );
    const [totalCollegesCount, setTotalCollegesCount] = useState<number | null>(
        null
    );

    const fetchCounts = useCallback(async () => {
        const queryParams: QueryParams = {
            search: "",
            sortBy: "none",
            direction: "ASC",
            pageNumber: 1,
            limit: 10,
        };
        const collegeres = await collegeApi.fetchColleges(
            queryParams,
            auth.csrftoken
        );
        const collegeresjson = await collegeres.json();
        const programres = await programApi.fetchPrograms(
            queryParams,
            auth.csrftoken
        );
        const programresjson = await programres.json();
        const studentres = await studentApi.fetchStudents(
            queryParams,
            auth.csrftoken
        );
        const studentresjson = await studentres.json();

        setTotalCollegesCount(collegeresjson.total_count);
        setTotalProgramsCount(programresjson.total_count);
        setTotalStudentsCount(studentresjson.total_count);
    }, [auth.csrftoken]);

    useEffect(() => {
        fetchCounts();
    }, [fetchCounts]);

    return (
        <div
            className={styles.pageContent}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5em",
            }}
        >
            <h4 style={{ textAlign: "center" }}>
                welcome back <br /> {auth.user?.username} !
            </h4>
            <img src={university} style={{ height: "300px", width: "390px" }} />
            <div
                className="d-flex justify-content-between align-items-center flex-wrap"
                style={{
                    gap: "3em",
                    margin: "auto",
                }}
            >
                <h1>students: {totalStudentsCount}</h1>
                <h1>programs: {totalProgramsCount}</h1>
                <h1>colleges: {totalCollegesCount}</h1>
            </div>
        </div>
    );
}

export default Home;
