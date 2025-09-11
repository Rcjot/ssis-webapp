export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    year: number;
    gender: string;
    program: string;
}

export interface Program {
    id: string;
    name: string;
    college: string;
}

export interface College {
    id: string;
    name: string;
}
