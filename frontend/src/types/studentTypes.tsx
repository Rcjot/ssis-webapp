export interface Student {
    id: string;
    first_name: string;
    last_name: string;
    year_level: number;
    gender: string;
    program_code: string;
}

export interface AddStudentFormData {
    id: string;
    first_name: string;
    last_name: string;
    year_level: number;
    gender: string;
    program_code: string;
}

export interface AddStudentFormDataErrors {
    id: string[];
    first_name: string[];
    last_name: string[];
    year_level: string[];
    gender: string[];
    program_code: string[];
}

export interface StudentModalType {
    formType: "edit" | "add";
    formData: AddStudentFormData;
}
