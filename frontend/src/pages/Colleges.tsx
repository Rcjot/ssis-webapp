import { useEffect, useState } from "react";
import ssisApi from "../api/ssisApi";

function Colleges() {
    const [colleges, setColleges] = useState<string[]>([]);

    useEffect(() => {
        const fetchColleges = async () => {
            const res = await ssisApi.fetchColleges();
            const resjson = await res.json();
            setColleges(resjson.colleges);
        };
        fetchColleges();
    }, []);

    return (
        <div>
            <h1>Colleges</h1>
            {colleges.length === 0 ? (
                <div>empty</div>
            ) : (
                <div>
                    {colleges.map((c) => {
                        return <div key={c}>{c}</div>;
                    })}
                </div>
            )}
        </div>
    );
}

export default Colleges;
