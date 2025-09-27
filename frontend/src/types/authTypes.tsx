export interface LoginFormData {
    username: string;
    password: string;
    remember: boolean;
}

export interface LoginFormDataErrors {
    username: string;
    password: string;
}

export interface SignupFormData {
    username: string;
    email: string;
    password: string;
    confirm: string;
}

export interface SignupFormDataErrors {
    username: string[];
    email: string[];
    password: string[];
    confirm: string[];
}

export interface AuthType {
    status: "loading" | "authenticated" | "unauthenticated";
    csrftoken: string | null;
    user: User | null;
}

export interface AuthContextType {
    auth: AuthType;
    login: (
        loginFormData: LoginFormData,
        setFormDataErrors: React.Dispatch<
            React.SetStateAction<LoginFormDataErrors>
        >
    ) => Promise<boolean>;
    logout: () => Promise<void>;
}

export interface User {
    id: string;
    username: string;
    email: string;
}
