import React, { useEffect, useState } from "react";
import { useAuth } from "../../ context/AuthContext";
import type {
    AddStudentFormData,
    AddStudentFormDataErrors,
} from "../../types/studentTypes";
import studentApi from "../../api/studentApi";
import programApi from "../../api/programApi";

function StudentForm({
    onSuccess,
    formDataOriginal,
    formType,
}: {
    onSuccess: () => Promise<void>;
    formDataOriginal: AddStudentFormData;
    formType: "add" | "edit";
}) {
    const [formData, setFormData] =
        useState<AddStudentFormData>(formDataOriginal);
    const [programOptions, setProgramOptions] = useState<string[]>([]);

    const { auth } = useAuth()!;

    useEffect(() => {
        setFormData(formDataOriginal);
    }, [formDataOriginal]);

    useEffect(() => {
        const fetchPrograms = async () => {
            const res = await programApi.fetchProgramCodes(auth.csrftoken);
            const resjson = await res.json();
            console.log(resjson);
            setProgramOptions(
                resjson.codes.map((program: { code: string }) => program.code)
            );
        };
        fetchPrograms();
    }, [auth.csrftoken]);

    const [formDataErrors, setFormDataErrors] =
        useState<AddStudentFormDataErrors>({
            id: [],
            first_name: [],
            last_name: [],
            year_level: [],
            gender: [],
            program_code: [],
        });
    console.log(formType);

    //put some errors

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
            id: [],
            first_name: [],
            last_name: [],
            year_level: [],
            gender: [],
            program_code: [],
        });
        let res;
        if (formType == "add") {
            res = await studentApi.fetchAddStudent(formData, auth.csrftoken);
        } else {
            res = await studentApi.fetchEditStudent(
                formData,
                auth.csrftoken,
                formDataOriginal.id
            );
        }

        const resjson = await res.json();
        console.log(resjson);
        if (!res.ok) {
            setFormDataErrors(resjson.error);
        } else {
            alert(`${formType}ed student`);
            onSuccess();
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="id">id</label>
            <span>{formDataErrors.id.join(" ")}</span>
            <input
                type="text"
                name="id"
                onChange={handleChange}
                value={formData.id}
                required
            />
            <label htmlFor="first_name">first name</label>
            <span>{formDataErrors.first_name.join(" ")}</span>
            <input
                type="text"
                name="first_name"
                onChange={handleChange}
                value={formData.first_name}
                required
            />
            <label htmlFor="last_name">last name</label>
            <span>{formDataErrors.last_name.join(" ")}</span>
            <input
                type="text"
                name="last_name"
                onChange={handleChange}
                value={formData.last_name}
                required
            />
            <label htmlFor="year_level">year level</label>
            <span>{formDataErrors.year_level.join(" ")}</span>
            <input
                type="number"
                name="year_level"
                onChange={handleChange}
                value={formData.year_level}
                min={1}
                max={5}
                required
            />
            <label htmlFor="gender">gender</label>
            <span>{formDataErrors.gender.join(" ")}</span>
            <select
                className="form-select"
                aria-label="gender select"
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
            >
                <option value="m">m</option>
                <option value="f">f</option>
            </select>
            <label htmlFor="program_code">program</label>
            <span>{formDataErrors.program_code.join(" ")}</span>
            <select
                className="form-select"
                aria-label="program select"
                name="program_code"
                id="program_code"
                value={formData.program_code}
                onChange={handleChange}
            >
                <option value="">None</option>

                {programOptions.map((programCode) => {
                    return (
                        <option key={programCode} value={programCode}>
                            {programCode}
                        </option>
                    );
                })}
            </select>
            <button type="submit">{formType} student</button>
        </form>
    );
}

export default StudentForm;
