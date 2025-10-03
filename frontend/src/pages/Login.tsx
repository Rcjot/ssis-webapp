import type { LoginFormData, LoginFormDataErrors } from "../types/authTypes";
import { useState } from "react";
import styles from "./styles/Pages.module.css";
import formStyles from "../components/forms/Forms.module.css";
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
            <form className={formStyles.formStyle} onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">username</label>
                    <span>{formDataErrors.username}</span>
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
                    <label htmlFor="password">password</label>
                    <span>{formDataErrors.password}</span>
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
                    <div style={{ display: "flex", gap: "3px" }}>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            name="rememberme"
                            defaultChecked={formData.remember}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    remember: e.target.checked,
                                }))
                            }
                        />
                        <label htmlFor="rememberme">remember me</label>
                    </div>
                </div>

                <button type="submit">login</button>
            </form>
            <p style={{ margin: "0px auto" }}>
                dont have account yet?{" "}
                <Link style={{ color: "#646cff" }} to="/signup">
                    signup
                </Link>
            </p>
        </div>
    );
}

export default Login;
