import { useCallback, useEffect, useState } from "react";
import type { College } from "../types/collegeTypes";
import styles from "./styles/Pages.module.css";
import PageNav from "../components/PageNav";
import collegeApi from "../api/collegeApi";
import { useAuth } from "../ context/AuthContext";
import type { CollegeModalType } from "../types/collegeTypes";
import Modal from "../components/modals/Modal";
import CollegeForm from "../components/forms/CollegeForms";
import type { QueryParams } from "../types/types";
import QueryBar from "../components/QueryBar";
import ConfirmPopup from "../components/modals/ConfirmPopup";
import deleteIcon from "../assets/delete.svg";
import editIcon from "../assets/edit.svg";
import { toast } from "react-toastify";
import ViewCollege from "../components/modals/ViewCollege";

function Colleges() {
    const [colleges, setColleges] = useState<College[] | null>(null);
    const [formState, setFormState] = useState<CollegeModalType>({
        formType: "add",
        formData: {
            code: "",
            name: "",
        },
    });
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [viewIsOpen, setViewIsOpen] = useState<boolean>(false);

    const [confirmIsOpen, setConfirmIsOpen] = useState<boolean>(false);
    const [targetDelete, setTargetDelete] = useState<string | null>(null);

    const [maxPage, setMaxPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [queryParams, setQueryParams] = useState<QueryParams>({
        search: "",
        sortBy: "none",
        direction: "ASC",
        pageNumber: 1,
        limit: 10,
    });

    const [viewCollegeCode, setViewCollegeCode] = useState<string | null>(null);

    const { auth } = useAuth()!;

    const fetchColleges = useCallback(async () => {
        const res = await collegeApi.fetchColleges(queryParams, auth.csrftoken);
        const resjson = await res.json();
        setColleges(resjson.colleges);
        setTotalCount(resjson.total_count);
        setMaxPage(Math.max(1, resjson.total_pages));
    }, [queryParams, auth.csrftoken]);

    useEffect(() => {
        fetchColleges();
    }, [fetchColleges]);

    return (
        <div className={styles.pageContent}>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <CollegeForm
                    onSuccess={async () => {
                        await fetchColleges();
                        setIsOpen(false);
                    }}
                    formDataOriginal={formState.formData}
                    formType={formState.formType}
                />
            </Modal>
            <Modal open={viewIsOpen} onClose={() => setViewIsOpen(false)}>
                <ViewCollege college_code={viewCollegeCode} />
            </Modal>
            <ConfirmPopup
                open={confirmIsOpen}
                onConfirm={async () => {
                    const res = await collegeApi.fetchDeleteCollege(
                        auth.csrftoken,
                        targetDelete as string
                    );
                    if (res.status == 419) {
                        toast.error(
                            `delete ${targetDelete} unsuccessful (csrf expired)`
                        );
                        setTargetDelete(null);
                        setConfirmIsOpen(false);
                        return;
                    }
                    fetchColleges();
                    toast.success(`delete ${targetDelete} successful`);
                    setTargetDelete(null);
                    setConfirmIsOpen(false);
                    if (queryParams.pageNumber > 1 && colleges?.length === 1) {
                        setQueryParams((prev) => ({
                            ...prev,
                            pageNumber: prev.pageNumber - 1,
                        }));
                    }
                }}
                onClose={() => setConfirmIsOpen(false)}
            >
                <p>Are you sure to delete {targetDelete}?</p>
            </ConfirmPopup>
            <h1>Colleges</h1>
            <button
                onClick={() => {
                    setFormState({
                        formType: "add",
                        formData: {
                            code: "",
                            name: "",
                        },
                    });
                    setIsOpen(true);
                }}
                className={styles.addButton}
            >
                add
            </button>
            <QueryBar setQueryParams={setQueryParams} queryParams={queryParams}>
                <option value="">none</option>
                <option value="code">code</option>
                <option value="name">name</option>
            </QueryBar>
            {colleges && <p>total count : {totalCount}</p>}
            <div className={styles.contentContainer}>
                {colleges == null ? (
                    <div>loading...</div>
                ) : colleges.length === 0 ? (
                    <div>empty</div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {colleges.map((c) => {
                                    return (
                                        <tr key={c.code}>
                                            <td>{c.code}</td>
                                            <td>{c.name}</td>
                                            <td style={{ width: "10px" }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        width: "fit-content",
                                                        marginLeft: "auto",
                                                    }}
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setViewCollegeCode(
                                                                c.code
                                                            );
                                                            setViewIsOpen(true);
                                                        }}
                                                    >
                                                        view
                                                    </button>
                                                    <button
                                                        className="buttonIcon"
                                                        onClick={async () => {
                                                            setConfirmIsOpen(
                                                                true
                                                            );
                                                            setTargetDelete(
                                                                c.code
                                                            );
                                                        }}
                                                    >
                                                        <img
                                                            src={deleteIcon}
                                                            alt="delete"
                                                        />
                                                    </button>
                                                    <button
                                                        className="buttonIcon"
                                                        onClick={() => {
                                                            setFormState(
                                                                () => ({
                                                                    formType:
                                                                        "edit",
                                                                    formData: c,
                                                                })
                                                            );
                                                            setIsOpen(true);
                                                        }}
                                                    >
                                                        <img
                                                            src={editIcon}
                                                            alt="edit"
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                <PageNav
                    pageNumber={queryParams.pageNumber}
                    maxPage={maxPage}
                    limit={queryParams.limit}
                    setQueryParams={setQueryParams}
                />
            </div>
        </div>
    );
}

export default Colleges;
