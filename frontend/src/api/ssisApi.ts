const url: string = import.meta.env.VITE_API_URL;

async function fetchStudents() {
    return await fetch(url + "/students", {
        method: "GET",
    });
}

async function fetchPrograms() {
    return await fetch(url + "/programs", {
        method: "GET",
    });
}

async function fetchColleges() {
    return await fetch(url + "/colleges", {
        method: "GET",
    });
}

export default {
    fetchStudents,
    fetchPrograms,
    fetchColleges,
};
