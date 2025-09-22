const url: string = import.meta.env.VITE_API_URL;

async function fetchStudents() {
    return await fetch(url + "/student", {
        method: "GET",
    });
}

async function fetchPrograms() {
    return await fetch(url + "/program", {
        method: "GET",
    });
}

async function fetchColleges() {
    return await fetch(url + "/college", {
        method: "GET",
    });
}

export default {
    fetchStudents,
    fetchPrograms,
    fetchColleges,
};
