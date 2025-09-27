import { useState, useMemo, useEffect, useCallback } from "react";
import { AuthContext } from "../ context/AuthContext";
import type { AuthType, LoginFormDataErrors } from "../types/authTypes";
import authApi from "../api/authApi";
import type { LoginFormData } from "../types/authTypes";

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<AuthType>({
        status: "loading",
        csrftoken: "",
        user: null,
    });

    const fetchCredentials = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchCredentials();
        console.log("fetched creds");
    }, [fetchCredentials]);

    const login = useCallback(
        async (
            loginFormData: LoginFormData,
            setFormDataErrors: React.Dispatch<
                React.SetStateAction<LoginFormDataErrors>
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
                alert("login successful");
                return true;
            } else {
                setFormDataErrors(resjson.error);
                return false;
            }
        },
        [auth.csrftoken]
    );

    const logout = useCallback(async () => {
        const res = await authApi.fetchLogout();
        if (res.ok) {
            setAuth((prev) => ({
                ...prev,
                status: "unauthenticated",
                user: null,
            }));
            alert("logout successful");
        }
    }, []);

    const contextValue = useMemo(
        () => ({
            auth,
            login,
            logout,
        }),
        [auth, login, logout]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
