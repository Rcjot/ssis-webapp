import { useState, useEffect } from "react";
import { useAuth } from "../../ context/AuthContext";
import type {
    AddCollegeFormData,
    AddCollegeFormDataErrors,
} from "../../types/collegeTypes";
import collegeApi from "../../api/collegeApi";
import styles from "./Forms.module.css";
import { toast } from "react-toastify";

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
            general: [],
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
            general: [],
        });
        console.log(auth.csrftoken);
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

        if (res.status == 419) {
            setFormDataErrors({
                code: [],
                name: [],
                general: ["csrf error, expired"],
            });
            return;
        }
        if (!res.ok) {
            setFormDataErrors({ ...resjson.error, general: [] });
        } else {
            toast.success(`${formType}ed College`);
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
                <span>{formDataErrors.name.join(" ")}</span>
                <label htmlFor="name">name</label>
                <input
                    type="text"
                    name="name"
                    className="form-control"
                    onChange={handleChange}
                    value={formData.name}
                    required
                />
            </div>
            <div>
                <span>{formDataErrors.general.join(" ")}</span>
            </div>
            <button type="submit">
                {formType === "edit" ? "save" : `${formType} college`}
            </button>
        </form>
    );
}

export default CollegeForm;
