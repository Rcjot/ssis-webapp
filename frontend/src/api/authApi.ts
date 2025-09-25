const url: string = import.meta.env.VITE_API_URL;
import type { LoginFormData } from "../types/types";

async function fetchCredentials() {
    return await fetch(url + "/csrf", {
        method: "GET",
        credentials: "include",
    });
}

async function fetchLogin(
    loginFormData: LoginFormData,
    csrftoken: string | null
) {
    return await fetch(url + "/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
        body: JSON.stringify({
            username: loginFormData.username,
            password: loginFormData.password,
        }),
    });
}

export default { fetchCredentials, fetchLogin };
