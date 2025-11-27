import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../ context/AuthContext";
import type {
    AddStudentFormData,
    AddStudentFormDataErrors,
} from "../../types/studentTypes";
import studentApi from "../../api/studentApi";
import programApi from "../../api/programApi";
import styles from "./Forms.module.css";
import { toast } from "react-toastify";
import SetProfile from "../profilepic/SetProfile";

function StudentForm({
    onSuccess,
    formDataOriginal,
    formType,
    student_pfp_path,
}: {
    onSuccess: () => Promise<void>;
    formDataOriginal: AddStudentFormData;
    formType: "add" | "edit";
    student_pfp_path: string | null;
}) {
    const [formData, setFormData] =
        useState<AddStudentFormData>(formDataOriginal);
    const [programOptions, setProgramOptions] = useState<string[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showCrop, setShowCrop] = useState<boolean>(false);

    const { auth } = useAuth()!;

    useEffect(() => {
        console.log("original", formDataOriginal);
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
            student_pfp_file: [],
            general: [],
        });

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
            student_pfp_file: [],
            general: [],
        });
        let res;
        const newFormData = formData;

        setIsSubmitting(true);
        console.log(canvasRef);
        if (canvasRef.current) {
            canvasRef.current.toBlob(
                async (blob) => {
                    if (blob) {
                        // const formData = new FormData();
                        newFormData["student_pfp_file"] = blob;
                        // formData.append("image", blob);

                        // await profileApi.sendImage(formData);
                        // await fetchCredentials();
                        if (formType == "add") {
                            res = await studentApi.fetchAddStudent(
                                newFormData,
                                auth.csrftoken
                            );
                        } else {
                            res = await studentApi.fetchEditStudent(
                                newFormData,
                                auth.csrftoken,
                                formDataOriginal.id
                            );
                        }
                        const resjson = await res.json();
                        console.log(resjson);
                        if (res.status == 419) {
                            setFormDataErrors({
                                id: [],
                                first_name: [],
                                last_name: [],
                                year_level: [],
                                gender: [],
                                program_code: [],
                                student_pfp_file: [],
                                general: ["csrf error, expired"],
                            });
                            setIsSubmitting(false);
                            return;
                        }
                        if (!res.ok) {
                            setFormDataErrors({
                                ...resjson.error,
                                general: [],
                            });
                        } else {
                            toast.success(`${formType}ed student`);
                            onSuccess();
                        }
                        setIsSubmitting(false);
                    }
                },
                "image/jpg",
                0.9
            );
        } else {
            console.log(newFormData);
            if (formType == "add") {
                res = await studentApi.fetchAddStudent(
                    newFormData,
                    auth.csrftoken
                );
            } else {
                res = await studentApi.fetchEditStudent(
                    newFormData,
                    auth.csrftoken,
                    formDataOriginal.id
                );
            }
            const resjson = await res.json();
            console.log(resjson);
            if (res.status == 419) {
                setFormDataErrors({
                    id: [],
                    first_name: [],
                    last_name: [],
                    year_level: [],
                    gender: [],
                    program_code: [],
                    student_pfp_file: [],
                    general: ["csrf error, expired"],
                });
                setIsSubmitting(false);
                return;
            }
            if (!res.ok) {
                setFormDataErrors({ ...resjson.error, general: [] });
            } else {
                toast.success(`${formType}ed student`);
                onSuccess();
            }
            setIsSubmitting(false);
        }
    }

    return (
        <form className={styles.formStyle} onSubmit={handleSubmit}>
            <SetProfile
                canvasRef={canvasRef}
                showCrop={showCrop}
                setShowCrop={setShowCrop}
                student_pfp_path={student_pfp_path}
            />
            <div className={`${showCrop ? "d-none" : ""} ${styles.subform}`}>
                <div>
                    <label htmlFor="id">id</label>
                    <span>{formDataErrors.id.join(" ")}</span>
                    <input
                        type="text"
                        name="id"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.id}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="first_name">first name</label>
                    <span>{formDataErrors.first_name.join(" ")}</span>
                    <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.first_name}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="last_name">last name</label>
                    <span>{formDataErrors.last_name.join(" ")}</span>
                    <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.last_name}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="year_level">year level</label>
                    <span>{formDataErrors.year_level.join(" ")}</span>
                    <input
                        type="number"
                        name="year_level"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.year_level}
                        min={1}
                        max={5}
                        required
                    />
                </div>
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
                    <span>{formDataErrors.general?.join(" ")}</span>
                </div>
                <button type="submit">
                    {isSubmitting ? (
                        "loading..."
                    ) : (
                        <>
                            {formType === "edit"
                                ? "save"
                                : `${formType} student`}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

export default StudentForm;
