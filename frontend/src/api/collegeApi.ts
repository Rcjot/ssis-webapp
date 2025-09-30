const url: string = import.meta.env.VITE_API_URL;
import type { AddCollegeFormData } from "../types/collegeTypes";
import type { QueryParams } from "../types/types";

async function fetchColleges(
    queryParams: QueryParams,
    csrftoken: string | null
) {
    const query = `?page=${queryParams.pageNumber}&limit=${queryParams.limit}&search=${queryParams.search}&sortBy=${queryParams.sortBy}&direction=${queryParams.direction}`;

    return await fetch(url + "/college/" + query, {
        method: "GET",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
    });
}

async function fetchCollegeCodes(csrftoken: string | null) {
    return await fetch(url + "/college/codes", {
        method: "GET",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
    });
}

async function fetchAddCollege(
    addCollegeFormData: AddCollegeFormData,
    csrftoken: string | null
) {
    return await fetch(url + "/college/add", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
        body: JSON.stringify({
            code: addCollegeFormData.code,
            name: addCollegeFormData.name,
        }),
    });
}

async function fetchEditCollege(
    addCollegeFormData: AddCollegeFormData,
    csrftoken: string | null,
    targetCode: string
) {
    // console.log(addCollegeFormData);
    return await fetch(url + "/college/edit/" + targetCode, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
        body: JSON.stringify({
            code: addCollegeFormData.code,
            name: addCollegeFormData.name,
        }),
    });
}

async function fetchDeleteCollege(
    csrftoken: string | null,
    targetCode: string
) {
    return await fetch(url + "/college/delete/" + targetCode, {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken ? csrftoken : "",
        },
    });
}

export default {
    fetchColleges,
    fetchCollegeCodes,
    fetchAddCollege,
    fetchEditCollege,
    fetchDeleteCollege,
};
