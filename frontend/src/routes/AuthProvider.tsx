import { useState, useMemo, useEffect, useCallback } from "react";
import { AuthContext } from "../ context/AuthContext";
import type { AuthType } from "../types/types";
import authApi from "../api/authApi";
import type { LoginFormData } from "../types/types";

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<AuthType>({
        status: "loading",
        csrftoken: "",
        user: null,
    });

    const fetchCredentials = async () => {
        try {
            const res = await authApi.fetchCredentials();
            const resjson = await res.json();
            if (res.ok)
                setAuth(() => ({
                    status: resjson.status,
                    csrftoken: res.headers.get("X-CSRFToken"),
                    user: resjson.user,
                }));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCredentials();
    }, []);

    const login = useCallback(
        async (
            loginFormData: LoginFormData,
            setFormDataErrors: React.Dispatch<
                React.SetStateAction<LoginFormData>
            >
        ) => {
            const res = await authApi.fetchLogin(loginFormData, auth.csrftoken);
            const resjson = await res.json();
            console.log(res.status, res.ok);
            if (res.ok) {
                setAuth(() => ({
                    status: "authenticated",
                    csrftoken: auth.csrftoken,
                    user: resjson.user,
                }));
                return true;
            } else {
                setFormDataErrors(resjson.error);
                return false;
            }
        },
        [auth.csrftoken]
    );

    const contextValue = useMemo(
        () => ({
            auth,
            login,
        }),
        [auth, login]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
