const url: string = import.meta.env.VITE_API_URL;
import type { AddProgramFormData } from "../types/programTypes";

async function fetchPrograms(csrftoken: string | null) {
    return await fetch(url + "/program/", {
        method: "GET",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
    });
}
async function fetchAddProgram(
    addProgramFormData: AddProgramFormData,
    csrftoken: string | null
) {
    return await fetch(url + "/program/add", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
        body: JSON.stringify({
            code: addProgramFormData.code,
            name: addProgramFormData.name,
            college_code: addProgramFormData.college_code,
        }),
    });
}

async function fetchEditProgram(
    addProgramFormData: AddProgramFormData,
    csrftoken: string | null,
    targetCode: string
) {
    // console.log(addProgramFormData);
    return await fetch(url + "/program/edit/" + targetCode, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
        body: JSON.stringify({
            code: addProgramFormData.code,
            name: addProgramFormData.name,
            college_code: addProgramFormData.college_code,
        }),
    });
}

async function fetchDeleteProgram(
    csrftoken: string | null,
    targetCode: string
) {
    return await fetch(url + "/program/delete/" + targetCode, {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
    });
}

export default {
    fetchPrograms,
    fetchAddProgram,
    fetchEditProgram,
    fetchDeleteProgram,
};
