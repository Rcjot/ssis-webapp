const url: string = import.meta.env.VITE_API_URL;
import type { AddStudentFormData } from "../types/studentTypes";
import type { QueryParams } from "../types/types";

async function fetchStudents(
    queryParams: QueryParams,
    csrftoken: string | null
) {
    const query = `?page=${queryParams.pageNumber}&limit=${queryParams.limit}&search=${queryParams.search}&sortBy=${queryParams.sortBy}&direction=${queryParams.direction}`;
    return await fetch(url + "/student/" + query, {
        method: "GET",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
    });
}

async function fetchAddStudent(
    addStudentFormData: AddStudentFormData,
    csrftoken: string | null
) {
    console.log(addStudentFormData);
    const formData = new FormData();
    formData.append("id", addStudentFormData.id);
    formData.append("first_name", addStudentFormData.first_name);
    formData.append("last_name", addStudentFormData.last_name);
    formData.append("year_level", String(addStudentFormData.year_level));
    formData.append("gender", String(addStudentFormData.gender));
    formData.append("program_code", String(addStudentFormData.program_code));
    if (addStudentFormData.student_pfp_file) {
        formData.append(
            "student_pfp_file",
            addStudentFormData.student_pfp_file
        );
    }
    console.log(formData);

    return await fetch(url + "/student/add", {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
        body: formData,
    });
}

async function fetchEditStudent(
    addStudentFormData: AddStudentFormData,
    csrftoken: string | null,
    targetId: string
) {
    // console.log(addStudentFormData);
    console.log(addStudentFormData);
    const formData = new FormData();
    formData.append("id", addStudentFormData.id);
    formData.append("first_name", addStudentFormData.first_name);
    formData.append("last_name", addStudentFormData.last_name);
    formData.append("year_level", String(addStudentFormData.year_level));
    formData.append("gender", String(addStudentFormData.gender));
    formData.append("program_code", String(addStudentFormData.program_code));
    if (addStudentFormData.student_pfp_file) {
        formData.append(
            "student_pfp_file",
            addStudentFormData.student_pfp_file
        );
    }
    return await fetch(url + "/student/edit/" + targetId, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
        body: formData,
    });
}

async function fetchDeleteStudent(csrftoken: string | null, targetId: string) {
    return await fetch(url + "/student/delete/" + targetId, {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
    });
}

export default {
    fetchStudents,
    fetchAddStudent,
    fetchEditStudent,
    fetchDeleteStudent,
};
