import { useEffect, useState } from "react";
import { useAuth } from "../../ context/AuthContext";
import type {
    AddStudentFormData,
    AddStudentFormDataErrors,
} from "../../types/studentTypes";
import studentApi from "../../api/studentApi";

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

    useEffect(() => {
        setFormData(formDataOriginal);
    }, [formDataOriginal]);

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
            <input
                type="text"
                name="gender"
                onChange={handleChange}
                value={formData.gender}
                required
            />
            <label htmlFor="program_code">program</label>
            <span>{formDataErrors.program_code.join(" ")}</span>
            <input
                type="text"
                name="program_code"
                onChange={handleChange}
                value={formData.program_code}
            />
            <button type="submit">{formType} student</button>
        </form>
    );
}

export default StudentForm;
