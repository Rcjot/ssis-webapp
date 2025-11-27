import { useEffect, useState } from "react";
import type { QueryParams } from "../types/types";
import styles from "./styles/PageNav.module.css";

function PageNav({
    pageNumber,
    maxPage,
    limit,
    setQueryParams,
}: {
    pageNumber: number;
    maxPage: number;
    limit: number;
    setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>;
}) {
    const [inputPageNumber, setInputPageNumber] = useState<string>(
        pageNumber.toString()
    );
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        pageNumber = Number(e.target.value);

        if (isNaN(pageNumber)) {
            setInputPageNumber("");
            return;
        }

        setInputPageNumber(e.target.value);
    }

    useEffect(() => {
        setInputPageNumber(pageNumber.toString());
    }, [pageNumber]);

    function handlePageSubmit(e: React.FormEvent<HTMLFormElement>) {
        pageNumber = Number(inputPageNumber);
        e.preventDefault();
        if (pageNumber > maxPage) {
            pageNumber = maxPage;
        }
        if (pageNumber <= 0) {
            pageNumber = 1;
        }
        setInputPageNumber(pageNumber.toString());

        setQueryParams((prev) => ({
            ...prev,
            pageNumber: pageNumber,
        }));
    }

    return (
        <div className={styles.pageNavContainer}>
            <nav
                aria-label="Page navigation example"
                className="d-flex flex-row align-items-center"
            >
                <ul className="pagination m-0">
                    <li className="page-item">
                        <button
                            className={`page-link ${
                                pageNumber === 1 ? "disabled" : ""
                            }`}
                            onClick={() => {
                                if (pageNumber == 1) return;
                                setQueryParams((prev) => ({
                                    ...prev,
                                    pageNumber: prev.pageNumber - 1,
                                }));
                            }}
                        >
                            Previous
                        </button>
                    </li>
                    <li className={`page-item ${styles.liInput}`}>
                        <form
                            style={{ margin: "0px" }}
                            onSubmit={handlePageSubmit}
                        >
                            <input
                                type="text"
                                className="page-link text-center"
                                onChange={handleChange}
                                value={inputPageNumber}
                            />
                        </form>
                    </li>
                    <li className="page-item">
                        <button
                            className={`page-link ${
                                pageNumber === maxPage ? "disabled" : ""
                            }`}
                            onClick={() => {
                                if (pageNumber == maxPage) return;
                                setQueryParams((prev) => ({
                                    ...prev,
                                    pageNumber: prev.pageNumber + 1,
                                }));
                            }}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>

            <div className="d-flex flex-row align-items-center">
                <label htmlFor="display_limit">display</label>
                <select
                    className="form-select"
                    aria-label="display limit select"
                    name="display_limit"
                    id="display_limit"
                    value={limit}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setQueryParams((prev) => ({
                            ...prev,
                            limit: Number(e.target.value),
                            pageNumber: 1,
                        }))
                    }
                >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>
        </div>
    );
}

export default PageNav;
