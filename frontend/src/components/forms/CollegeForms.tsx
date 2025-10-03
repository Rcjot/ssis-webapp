import { useState, useEffect } from "react";
import { useAuth } from "../../ context/AuthContext";
import type {
    AddCollegeFormData,
    AddCollegeFormDataErrors,
} from "../../types/collegeTypes";
import collegeApi from "../../api/collegeApi";
import styles from "./Forms.module.css";

function CollegeForm({
    onSuccess,
    formDataOriginal,
    formType,
}: {
    onSuccess: () => Promise<void>;
    formDataOriginal: AddCollegeFormData;
    formType: "add" | "edit";
}) {
    const [formData, setFormData] = useState<AddCollegeFormData>({
        code: "",
        name: "",
    });

    useEffect(() => {
        setFormData(formDataOriginal);
    }, [formDataOriginal]);

    const [formDataErrors, setFormDataErrors] =
        useState<AddCollegeFormDataErrors>({
            code: [],
            name: [],
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
        });
        let res;
        if (formType == "add") {
            res = await collegeApi.fetchAddCollege(formData, auth.csrftoken);
        } else {
            res = await collegeApi.fetchEditCollege(
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
            alert(`${formType}ed College`);
            onSuccess();
        }
    }

    return (
        <form className={styles.formStyle} onSubmit={handleSubmit}>
            <div>
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
            </div>
            <div>
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
            </div>

            <button type="submit">
                {formType === "edit" ? "save" : `${formType} college`}
            </button>
        </form>
    );
}

export default CollegeForm;
