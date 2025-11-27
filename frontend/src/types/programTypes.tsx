import type { College } from "./collegeTypes";

export interface Program {
    code: string;
    name: string;
    college_code: string;
}

export interface ProgramViewType extends Program {
    college: College;
    student_count: number;
}

export interface AddProgramFormData {
    code: string;
    name: string;
    college_code: string;
}

export interface AddProgramFormDataErrors {
    code: string[];
    name: string[];
    college_code: string[];
    general: string[];
}

export interface ProgramModalType {
    formType: "edit" | "add";
    formData: AddProgramFormData;
}
