import { useState, useEffect } from "react";
import { useAuth } from "../../ context/AuthContext";
import type {
    AddProgramFormData,
    AddProgramFormDataErrors,
} from "../../types/programTypes";
import programApi from "../../api/programApi";
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
    const [collegeOptions, setCollegeOptions] = useState<string[]>([]);
    const { auth } = useAuth()!;

    useEffect(() => {
        const fetchColleges = async () => {
            const res = await collegeApi.fetchCollegeCodes(auth.csrftoken);
            const resjson = await res.json();

            setCollegeOptions(
                resjson.codes.map((college: { code: string }) => college.code)
            );
            console.log(resjson);
        };
        fetchColleges();
    }, [auth.csrftoken]);

    useEffect(() => {
        setFormData(formDataOriginal);
    }, [formDataOriginal]);

    const [formDataErrors, setFormDataErrors] =
        useState<AddProgramFormDataErrors>({
            code: [],
            name: [],
            college_code: [],
        });

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
                className="form-control"
                onChange={handleChange}
                value={formData.code}
                required
            />
            <label htmlFor="name">name</label>
            <span>{formDataErrors.name.join(" ")}</span>
            <input
                type="text"
                name="name"
                className="form-control"
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

                {collegeOptions.map((collegeCode) => {
                    return (
                        <option key={collegeCode} value={collegeCode}>
                            {collegeCode}
                        </option>
                    );
                })}
            </select>

            <button type="submit">{formType} Program</button>
        </form>
    );
}

export default ProgramForm;
