import { useState, useEffect } from "react";
import { useAuth } from "../../ context/AuthContext";
import type {
    AddProgramFormData,
    AddProgramFormDataErrors,
} from "../../types/programTypes";
import programApi from "../../api/programApi";
import type { College } from "../../types/collegeTypes";
import collegeApi from "../../api/collegeApi";

function ProgramForm({
    onSuccess,
    formDataOriginal,
    formType,
}: {
    onSuccess: () => Promise<void>;
    formDataOriginal: AddProgramFormData;
    formType: "add" | "edit";
}) {
    const [formData, setFormData] = useState<AddProgramFormData>({
        code: "",
        name: "",
        college_code: "",
    });
    const [collegeOptions, setCollegeOptions] = useState<College[]>([]);

    useEffect(() => {
        const fetchColleges = async () => {
            const res = await collegeApi.fetchColleges(auth.csrftoken);
            const resjson = await res.json();
            setCollegeOptions(resjson.colleges);
            console.log(resjson);
        };
        fetchColleges();
    });

    useEffect(() => {
        setFormData(formDataOriginal);
    }, [formDataOriginal]);

    const [formDataErrors, setFormDataErrors] =
        useState<AddProgramFormDataErrors>({
            code: [],
            name: [],
            college_code: [],
        });

    const { auth } = useAuth()!;

    function handleChange(
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setFormDataErrors({
            code: [],
            name: [],
            college_code: [],
        });
        let res;

        if (formType == "add") {
            res = await programApi.fetchAddProgram(formData, auth.csrftoken);
        } else {
            res = await programApi.fetchEditProgram(
                formData,
                auth.csrftoken,
                formDataOriginal.code
            );
        }

        const resjson = await res.json();
        console.log(resjson);
        if (!res.ok) {
            setFormDataErrors(resjson.error);
        } else {
            alert(`${formType}ed Program`);
            onSuccess();
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="code">code</label>
            <span>{formDataErrors.code.join(" ")}</span>
            <input
                type="text"
                name="code"
                onChange={handleChange}
                value={formData.code}
                required
            />
            <label htmlFor="name">name</label>
            <span>{formDataErrors.name.join(" ")}</span>
            <input
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                required
            />
            <label htmlFor="college_code">college code</label>
            <span>{formDataErrors.college_code.join(" ")}</span>
            <select
                className="form-select"
                aria-label="college select"
                name="college_code"
                id="college_code"
                value={formData.college_code}
                onChange={handleChange}
            >
                <option value="">None</option>

                {collegeOptions.map((college) => {
                    return <option value={college.code}>{college.code}</option>;
                })}
            </select>

            <button type="submit">{formType} Program</button>
        </form>
    );
}

export default ProgramForm;
