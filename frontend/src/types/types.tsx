export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    year: number;
    gender: string;
    program: string;
}

export interface Program {
    id: string;
    name: string;
    college: string;
}

export interface College {
    id: string;
    name: string;
}

export interface LoginFormData {
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
        setFormDataErrors: React.Dispatch<React.SetStateAction<LoginFormData>>
    ) => Promise<boolean>;
}

export interface User {
    id: string;
    username: string;
    email: string;
}
