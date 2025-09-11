import { useEffect, useState } from "react";
import ssisApi from "../api/ssisApi";

function Programs() {
    const [programs, setPrograms] = useState<string[]>([]);

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
                <div>
                    {programs.map((p) => {
                        return <div key={p}>{p}</div>;
                    })}
                </div>
            )}
        </div>
    );
}

export default Programs;
