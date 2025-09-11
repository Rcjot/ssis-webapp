import { useEffect, useState } from "react";
import ssisApi from "../api/ssisApi";
import type { Program } from "../types/types";

function Programs() {
    const [programs, setPrograms] = useState<Program[]>([]);

    useEffect(() => {
        const fetchPrograms = async () => {
            const res = await ssisApi.fetchPrograms();
            const resjson = await res.json();
            setPrograms(resjson.programs);
        };
        fetchPrograms();
    }, []);

    return (
        <div>
            <h1>Programs</h1>
            {programs.length === 0 ? (
                <div>empty</div>
            ) : (
                <table>
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
        </div>
    );
}

export default Programs;
