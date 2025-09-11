import { useEffect, useState } from "react";
import ssisApi from "../api/ssisApi";

function Students() {
    const [students, setStudents] = useState<string[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const res = await ssisApi.fetchStudents();
            const resjson = await res.json();
            setStudents(resjson.students);
        };
        fetchStudents();
    }, []);

    return (
        <div>
            <h1>Students</h1>
            {students.length === 0 ? (
                <div>empty</div>
            ) : (
                <div>
                    {students.map((s) => {
                        return <div key={s}>{s}</div>;
                    })}
                </div>
            )}
        </div>
    );
}

export default Students;
