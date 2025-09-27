export interface Program {
    code: string;
    name: string;
    college_code: string;
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
}

export interface ProgramModalType {
    formType: "edit" | "add";
    formData: AddProgramFormData;
}
