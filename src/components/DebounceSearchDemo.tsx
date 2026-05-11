// DebounceSearchDemo.tsx — demonstrates useDebounce hook
//
// User can:
//   - Type in a search input (value changes on every keystroke)
//   - Adjust the debounce delay via a number input
// Displays: the raw input value, the debounced value, and filtered results
// The "API call" only fires when debouncedValue changes — simulated by
// filtering a sample dataset

import { useState, useMemo, useEffect } from "react";
import type { ChangeEvent } from "react";
import useDebounce from "../hooks/useDebounce";

const DEFAULT_DELAY = 500;
const DELAY_STEP = 100;

// Sample dataset — simulates what an API might return
const SAMPLE_ITEMS = [
    "React Hooks", "TypeScript Generics", "CSS Grid Layout", "Flexbox Alignment",
    "JavaScript Promises", "Async Await Patterns", "Node.js Streams", "REST API Design",
    "GraphQL Queries", "WebSocket Connections", "Three.js Scenes", "GSAP Animations",
    "Leaflet Maps", "Vite Build Tool", "ESLint Config", "Prettier Formatting",
    "Git Branching", "Docker Containers", "AWS Lambda", "Firebase Auth",
    "MongoDB Aggregation", "PostgreSQL Joins", "Redis Caching", "Nginx Proxy",
] as const;

function DebounceSearchDemo() {
    const [query, setQuery] = useState("");
    const [delay, setDelay] = useState(DEFAULT_DELAY);
    const [searchCount, setSearchCount] = useState(0);

    const debouncedQuery = useDebounce(query, delay);

    // Simulate an API call whenever debouncedValue changes
    // In a real app this would be a fetch() — here we just filter and count
    const filteredResults = useMemo(() => {
        if (!debouncedQuery.trim()) return [...SAMPLE_ITEMS];
        const lower = debouncedQuery.toLowerCase();
        return SAMPLE_ITEMS.filter((item) => item.toLowerCase().includes(lower));
    }, [debouncedQuery]);

    // Track how many "API calls" have been made — shows debouncing in action
    useEffect(() => {
        if (debouncedQuery !== "") {
            setSearchCount((prev) => prev + 1);
            console.log("Searching for:", debouncedQuery);
        }
    }, [debouncedQuery]);

    const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleDelayChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        setDelay(isNaN(val) ? 0 : Math.max(0, val));
    };
