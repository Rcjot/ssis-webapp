import { useEffect, useState } from "react";
import ssisApi from "../api/ssisApi";
import type { Student } from "../types/types";

function Students() {
    const [students, setStudents] = useState<Student[]>([]);

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
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>firstName</th>
                            <th>lastName</th>
                            <th>year</th>
                            <th>gender</th>
                            <th>program</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s) => {
                            return (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.firstName}</td>
                                    <td>{s.lastName}</td>
                                    <td>{s.year}</td>
                                    <td>{s.gender}</td>
                                    <td>{s.program}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Students;
