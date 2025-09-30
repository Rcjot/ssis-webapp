import { useEffect, useState } from "react";
import type { QueryParams } from "../types/types";

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
        console.log(pageNumber);
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
        console.log(pageNumber);

        setQueryParams((prev) => ({
            ...prev,
            pageNumber: pageNumber,
        }));
    }

    return (
        <>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item">
                        <button
                            className="page-link"
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
                    <li className="page-item">
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
                            className="page-link"
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
                    }))
                }
            >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
            </select>
        </>
    );
}

export default PageNav;
