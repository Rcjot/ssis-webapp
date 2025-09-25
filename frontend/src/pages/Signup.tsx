import type { SignupFormData, SignupFormDataErrors } from "../types/types";
import { useState } from "react";
import styles from "./styles/Pages.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../ context/AuthContext";
import authApi from "../api/authApi";

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
            alert("registered");
        }
    }

    return (
        <div className={styles.pageContent}>
            <div>{auth.status}</div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">username</label>
                <span>{formDataErrors.username.join(" ")}</span>
                <input
                    type="text"
                    name="username"
                    onChange={handleChange}
                    value={formData.username}
                    required
                />
                <label htmlFor="email">email</label>
                <span>{formDataErrors.email.join(" ")}</span>
                <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    required
                />
                <label htmlFor="password">password</label>
                <span>{formDataErrors.password.join(" ")}</span>
                <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    required
                />
                <label htmlFor="confirm">confirm password</label>
                <span>{formDataErrors.confirm.join(" ")}</span>
                <input
                    type="password"
                    name="confirm"
                    onChange={handleChange}
                    value={formData.confirm}
                    required
                />
                <button type="submit">sign up</button>
            </form>
            <p>
                alr have an account? <Link to="/login">login</Link>
            </p>
        </div>
    );
}

export default Signup;
