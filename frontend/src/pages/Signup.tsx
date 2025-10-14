import type { SignupFormData, SignupFormDataErrors } from "../types/authTypes";
import { useState } from "react";
import styles from "./styles/Pages.module.css";
import formStyles from "../components/forms/Forms.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../ context/AuthContext";
import authApi from "../api/authApi";
import { toast } from "react-toastify";

function Signup() {
    const [formData, setFormData] = useState<SignupFormData>({
        username: "",
        email: "",
        password: "",
        confirm: "",
    });

    const [formDataErrors, setFormDataErrors] = useState<SignupFormDataErrors>({
        username: [],
        email: [],
        password: [],
        confirm: [],
    });

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
            username: [],
            email: [],
            password: [],
            confirm: [],
        });

        const res = await authApi.fetchSignup(formData, auth.csrftoken);
        const resjson = await res.json();
        console.log(resjson);
        if (!res.ok) {
            setFormDataErrors(resjson.error);
        } else {
            toast.success("registered");
            setFormData({ username: "", email: "", password: "", confirm: "" });
        }
    }

    return (
        <div className={styles.pageContent}>
            <div>{auth.status}</div>
            <form className={formStyles.formStyle} onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">username</label>
                    <span>{formDataErrors.username.join(" ")}</span>
                    <input
                        type="text"
                        name="username"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.username}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">email</label>
                    <span>{formDataErrors.email.join(" ")}</span>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.email}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">password</label>
                    <span>{formDataErrors.password.join(" ")}</span>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        onChange={handleChange}
                        autoComplete="off"
                        value={formData.password}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirm">confirm password</label>
                    <span>{formDataErrors.confirm.join(" ")}</span>
                    <input
                        type="password"
                        name="confirm"
                        className="form-control"
                        autoComplete="off"
                        onChange={handleChange}
                        value={formData.confirm}
                        required
                    />
                </div>

                <button type="submit">sign up</button>
            </form>
            <p style={{ margin: "0px auto" }}>
                alr have an account?{" "}
                <Link style={{ color: "#646cff" }} to="/login">
                    login
                </Link>
            </p>
        </div>
    );
}

export default Signup;
