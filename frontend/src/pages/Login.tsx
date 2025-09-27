import type { LoginFormData, LoginFormDataErrors } from "../types/authTypes";
import { useState } from "react";
import styles from "./styles/Pages.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../ context/AuthContext";

function Login() {
    const [formData, setFormData] = useState<LoginFormData>({
        username: "",
        password: "",
        remember: false,
    });

    const [formDataErrors, setFormDataErrors] = useState<LoginFormDataErrors>({
        username: "",
        password: "",
    });

    const navigate = useNavigate();
    //put some errors

    const { login, auth } = useAuth()!;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setFormDataErrors({
            username: "",
            password: "",
        });

        const success = await login(formData, setFormDataErrors);
        if (success) {
            navigate("/", { replace: true });
        }
    }

    return (
        <div className={styles.pageContent}>
            <div>{auth.status}</div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">username</label>
                <span>{formDataErrors.username}</span>
                <input
                    type="text"
                    name="username"
                    onChange={handleChange}
                    value={formData.username}
                    required
                />
                <label htmlFor="password">password</label>
                <span>{formDataErrors.password}</span>
                <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    required
                />
                <div>
                    <input
                        type="checkbox"
                        name="rememberme"
                        defaultChecked={formData.remember}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData((prev) => ({
                                ...prev,
                                remember: e.target.checked,
                            }))
                        }
                    />
                    <label htmlFor="rememberme">remember me</label>
                </div>

                <button type="submit">login</button>
            </form>
            <p>
                dont have account yet? <Link to="/signup">signup</Link>
            </p>
        </div>
    );
}

export default Login;
