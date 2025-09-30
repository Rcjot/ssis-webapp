const url: string = import.meta.env.VITE_API_URL;
import type { AddProgramFormData } from "../types/programTypes";
import type { QueryParams } from "../types/types";

async function fetchPrograms(
    queryParams: QueryParams,
    csrftoken: string | null
) {
    const query = `?page=${queryParams.pageNumber}&limit=${queryParams.limit}&search=${queryParams.search}&sortBy=${queryParams.sortBy}`;

    return await fetch(url + "/program/" + query, {
        method: "GET",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
    });
}

async function fetchProgramCodes(csrftoken: string | null) {
    return await fetch(url + "/program/codes", {
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
    fetchProgramCodes,
    fetchAddProgram,
    fetchEditProgram,
    fetchDeleteProgram,
};
