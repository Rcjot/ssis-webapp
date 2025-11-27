export interface College {
    code: string;
    name: string;
}

export interface CollegeViewType extends College {
    student_count: number;
    program_count: number;
}

export interface AddCollegeFormData {
    code: string;
    name: string;
}

export interface AddCollegeFormDataErrors {
    code: string[];
    name: string[];
    general: string[];
}
// add and update types would be the same as the college type though?
export interface CollegeModalType {
    formType: "edit" | "add";
    formData: AddCollegeFormData;
}
