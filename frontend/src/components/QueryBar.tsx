import type { QueryParams } from "../types/types";
import { useState } from "react";
import styles from "./styles/QueryBar.module.css";

function QueryBar({
    setQueryParams,
    children,
    queryParams,
}: {
    setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>;
    children: React.ReactNode;
    queryParams: QueryParams;
}) {
    const [queryFormData, setQueryFormData] =
        useState<QueryParams>(queryParams);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setQueryParams((prev) => ({
            ...prev,
            search: queryFormData.search,
            sortBy: queryFormData.sortBy,
            direction: queryFormData.direction,
        }));
    }

    return (
        <div className={styles.queryBarContainer}>
            <form className={styles.searchForm} onSubmit={handleSubmit}>
                <label htmlFor="search"></label>
                <input
                    type="text"
                    name="search"
                    value={queryFormData.search}
                    className="form-control"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setQueryFormData((prev) => ({
                            ...prev,
                            search: e.target.value,
                        }))
                    }
                />
                <button>search</button>
            </form>
            <form className={styles.sortForm}>
                <label htmlFor="sort_query">sort by</label>
                <select
                    className="form-select"
                    aria-label="sort query"
                    name="query"
                    id="sort_query"
                    value={queryParams.sortBy}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setQueryParams((prev) => ({
                            ...prev,
                            sortBy: e.target.value,
                        }))
                    }
                >
                    {children}
                </select>
                <select
                    className="form-select"
                    aria-label="direction select"
                    name="direction"
                    id="direction_select"
                    value={queryParams.direction}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setQueryParams((prev) => ({
                            ...prev,
                            direction: e.target.value as "ASC" | "DESC",
                        }))
                    }
                >
                    <option value="ASC">ascending</option>
                    <option value="DESC">descending</option>
                </select>
            </form>
        </div>
    );
}

export default QueryBar;
