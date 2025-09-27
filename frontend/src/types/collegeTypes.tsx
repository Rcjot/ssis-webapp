export interface College {
    code: string;
    name: string;
}

export interface AddCollegeFormData {
    code: string;
    name: string;
}

export interface AddCollegeFormDataErrors {
    code: string[];
    name: string[];
}
// add and update types would be the same as the college type though?
export interface CollegeModalType {
    formType: "edit" | "add";
    formData: AddCollegeFormData;
}
