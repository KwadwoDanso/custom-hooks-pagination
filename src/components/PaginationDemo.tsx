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
