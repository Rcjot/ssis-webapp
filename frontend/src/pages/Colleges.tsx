import { useEffect, useState } from "react";
import ssisApi from "../api/ssisApi";
import type { College } from "../types/types";

function Colleges() {
    const [colleges, setColleges] = useState<College[]>([]);

    useEffect(() => {
        const fetchColleges = async () => {
            const res = await ssisApi.fetchColleges();
            const resjson = await res.json();
            setColleges(resjson.colleges);
        };
        fetchColleges();
    }, []);

    return (
        <table>
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
    );
}

export default Colleges;
