function PageNav({
    pageNumber,
    setPageNumber,
}: {
    pageNumber: number;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPageNumber(Number(e.target.value));
    }

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className="page-item">
                    <button
                        className="page-link"
                        onClick={() => {
                            setPageNumber((prev) => prev - 1);
                        }}
                    >
                        Previous
                    </button>
                </li>
                <li className="page-item">
                    <input
                        type="text"
                        className="page-link text-center"
                        onChange={handleChange}
                        value={pageNumber}
                    />
                </li>
                <li className="page-item">
                    <button
                        className="page-link"
                        onClick={() => {
                            setPageNumber((prev) => prev + 1);
                        }}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default PageNav;
