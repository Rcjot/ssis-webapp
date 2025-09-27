const url: string = import.meta.env.VITE_API_URL;

async function fetchPrograms() {
    return await fetch(url + "/program", {
        method: "GET",
        credentials: "include",
    });
}

async function fetchColleges() {
    return await fetch(url + "/college", {
        method: "GET",
        credentials: "include",
    });
}

export default {
    fetchPrograms,
    fetchColleges,
};
