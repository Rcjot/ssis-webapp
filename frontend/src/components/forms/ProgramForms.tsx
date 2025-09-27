import { useState, useEffect } from "react";
import { useAuth } from "../../ context/AuthContext";
import type {
    AddProgramFormData,
    AddProgramFormDataErrors,
} from "../../types/programTypes";
import programApi from "../../api/programApi";

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

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
            <input
                type="text"
                name="college_code"
                onChange={handleChange}
                value={formData.college_code}
            />

            <button type="submit">{formType} Program</button>
        </form>
    );
}

export default ProgramForm;
