// PaginationDemo.tsx — demonstrates usePagination hook

import { useState, useMemo } from "react";
import type React from "react";
import type { ChangeEvent } from "react";
import usePagination from "../hooks/usePagination";

const PER_PAGE_OPTIONS = [5, 10, 15, 25, 50] as const;
const DEFAULT_TOTAL = 47;
const DEFAULT_PER_PAGE = 10;

function PaginationDemo() {
    const [totalItemCount, setTotalItemCount] = useState(DEFAULT_TOTAL);
    const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

    const {
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        itemsOnCurrentPage,
        setPage,
        nextPage,
        prevPage,
        canNextPage,
        canPrevPage,
    } = usePagination(totalItemCount, perPage);

    // Generate sample data based on totalItemCount
    const sampleData = useMemo(
        () => Array.from({ length: totalItemCount }, (_, i) => `Item ${i + 1}`),
        [totalItemCount]
    );

    // Slice the data for the current page
    // When startIndex is -1 (no items), Math.max ensures slice(0, 0) → []
    const pageItems = useMemo(
        () => sampleData.slice(Math.max(startIndex, 0), endIndex + 1),
        [sampleData, startIndex, endIndex]
    );

    // Generate an array of page numbers for the page buttons
    const pageNumbers = useMemo(
        () => Array.from({ length: totalPages }, (_, i) => i + 1),
        [totalPages]
    );

    const handleTotalChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        setTotalItemCount(isNaN(val) ? 0 : Math.max(0, val));
    };

    const handlePerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setPerPage(Number(e.target.value));
    };
    // console.log("PaginationDemo render:", { currentPage, totalPages, startIndex, endIndex, itemsOnCurrentPage });

    return (
        <section style={{ padding: "1.5rem", maxWidth: "700px" }}>
            <h2 style={{ marginBottom: "1rem" }}>Pagination Demo</h2>

            {/* Controls — user can change total items and items per page */}
            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.85rem" }}>
                    Total items
                    <input
                        type="number"
                        value={totalItemCount}
                        onChange={handleTotalChange}
                        min={0}
                        style={{ padding: "0.5rem", width: "6rem", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.85rem" }}>
                    Per page
                    <select
                        value={perPage}
                        onChange={handlePerPageChange}
                        style={{ padding: "0.5rem", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ccc" }}
                    >
                        {PER_PAGE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Stats bar — shows hook return values */}
            <div style={{ background: "#f1f5f9", padding: "0.85rem 1rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem", lineHeight: 1.7 }}>
                <strong>Page {currentPage}</strong> of {totalPages}
                {" · "}Items {totalItemCount > 0 ? `${startIndex + 1}–${endIndex + 1}` : "none"} of {totalItemCount}
                {" · "}{itemsOnCurrentPage} on this page
            </div>

            {/* Navigation — Prev, page numbers, Next */}
            <nav aria-label="Pagination" style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                <button onClick={prevPage} disabled={!canPrevPage} style={navBtnStyle}>
                    Prev
                </button>

                {pageNumbers.map((num) => (
                    <button
                        key={num}
                        onClick={() => setPage(num)}
                        disabled={num === currentPage}
                        aria-current={num === currentPage ? "page" : undefined}
                        style={{
                            ...navBtnStyle,
                            background: num === currentPage ? "#3b82f6" : "#fff",
                            color: num === currentPage ? "#fff" : "#1e293b",
                            fontWeight: num === currentPage ? 700 : 400,
                        }}
                    >
                        {num}
                    </button>
                ))}

                <button onClick={nextPage} disabled={!canNextPage} style={navBtnStyle}>
                    Next
                </button>
            </nav>

            {/* Items list — the sliced data for this page */}
            {pageItems.length > 0 ? (
                <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.5rem" }}>
                    {pageItems.map((item) => (
                        <li key={item} style={{ padding: "0.6rem 0.85rem", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}>
                            {item}
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ color: "#94a3b8", fontStyle: "italic" }}>No items to display.</p>
            )}
        </section>
    );
}

// Shared button styles for the nav bar
const navBtnStyle: React.CSSProperties = {
    padding: "0.45rem 0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    background: "#fff",
    color: "#1e293b",
    fontSize: "0.85rem",
    cursor: "pointer",
};

export default PaginationDemo;