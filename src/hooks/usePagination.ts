// usePagination.ts — client-side pagination logic
//
// Inputs: totalItems, itemsPerPage (default 10), initialPage (default 1)
// Returns: currentPage, totalPages, startIndex, endIndex, itemsOnCurrentPage,
//          setPage, nextPage, prevPage, canNextPage, canPrevPage
//
// Edge cases handled:
//   - totalItems = 0 → totalPages = 0, currentPage = 0, empty indices
//   - Page set below 1 or above totalPages → clamped to valid range
//   - Last page may have fewer items than itemsPerPage

import { useState, useMemo, useCallback } from "react";

const DEFAULT_PER_PAGE = 10;
const DEFAULT_INITIAL_PAGE = 1;

function usePagination(
    totalItems: number,
    itemsPerPage: number = DEFAULT_PER_PAGE,
    initialPage: number = DEFAULT_INITIAL_PAGE
) {
    const [currentPage, setCurrentPage] = useState(initialPage);

    // Total pages — ceil division, minimum 0 for empty datasets
    const totalPages = useMemo(
        () => (totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 0),
        [totalItems, itemsPerPage]
    );

    // Clamp currentPage to valid range whenever totalPages changes
    // (e.g. user changes itemsPerPage and the current page no longer exists)
    const clampedPage = useMemo(() => {
        if (totalPages === 0) return 0;
        if (currentPage < 1) return 1;
        if (currentPage > totalPages) return totalPages;
        return currentPage;
    }, [currentPage, totalPages]);

    // 0-based start and end indices for slicing an array
    // Returns -1 for both when there are no items (no valid index exists)
    const startIndex = useMemo(
        () => (clampedPage > 0 ? (clampedPage - 1) * itemsPerPage : -1),
        [clampedPage, itemsPerPage]
    );

    const endIndex = useMemo(
        () => (clampedPage > 0 ? Math.min(startIndex + itemsPerPage, totalItems) - 1 : -1),
        [clampedPage, startIndex, itemsPerPage, totalItems]
    );

    // How many items are actually on this page (last page might be shorter)
    const itemsOnCurrentPage = useMemo(
        () => (clampedPage > 0 ? endIndex - startIndex + 1 : 0),
        [clampedPage, startIndex, endIndex]
    );
    