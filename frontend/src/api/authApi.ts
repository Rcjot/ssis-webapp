const url: string = import.meta.env.VITE_API_URL;
import type { LoginFormData, SignupFormData } from "../types/types";

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
            remember: loginFormData.remember,
        }),
    });
}

async function fetchSignup(
    signupFormData: SignupFormData,
    csrftoken: string | null
) {
    return await fetch(url + "/signup", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
        body: JSON.stringify({
            username: signupFormData.username,
            email: signupFormData.email,
            password: signupFormData.password,
            confirm: signupFormData.confirm,
        }),
    });
}

async function fetchLogout() {
    return await fetch(url + "/logout", {
        method: "GET",
        credentials: "include",
    });
}

export default {
    fetchCredentials,
    fetchLogin,
    fetchSignup,
    fetchLogout,
};
