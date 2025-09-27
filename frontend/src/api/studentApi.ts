const url: string = import.meta.env.VITE_API_URL;
import type { AddStudentFormData } from "../types/studentTypes";

async function fetchStudents(csrftoken: string | null) {
    return await fetch(url + "/student/", {
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
    return await fetch(url + "/student/add", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
        body: JSON.stringify({
            id: addStudentFormData.id,
            first_name: addStudentFormData.first_name,
            last_name: addStudentFormData.last_name,
            year_level: addStudentFormData.year_level,
            gender: addStudentFormData.gender,
            program_code: addStudentFormData.program_code,
        }),
    });
}

async function fetchEditStudent(
    addStudentFormData: AddStudentFormData,
    csrftoken: string | null,
    targetId: string
) {
    // console.log(addStudentFormData);
    return await fetch(url + "/student/edit/" + targetId, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
        body: JSON.stringify({
            id: addStudentFormData.id,
            first_name: addStudentFormData.first_name,
            last_name: addStudentFormData.last_name,
            year_level: addStudentFormData.year_level,
            gender: addStudentFormData.gender,
            program_code: addStudentFormData.program_code,
        }),
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
