// DebounceSearchDemo.tsx — demonstrates useDebounce hook


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
    // console.log("DebounceSearchDemo render:", { query, debouncedQuery, delay, searchCount });

    return (
        <section style={{ padding: "1.5rem", maxWidth: "700px" }}>
            <h2 style={{ marginBottom: "1rem" }}>Debounce Search Demo</h2>

            {/* Controls — search input and delay adjustment */}
            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "flex-end" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.85rem", flex: 1, minWidth: "200px" }}>
                    Search
                    <input
                        type="search"
                        value={query}
                        onChange={handleQueryChange}
                        placeholder="Type to search..."
                        autoComplete="off"
                        style={{ padding: "0.65rem 1rem", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
                    />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.85rem" }}>
                    Delay (ms)
                    <input
                        type="number"
                        value={delay}
                        onChange={handleDelayChange}
                        min={0}
                        step={DELAY_STEP}
                        style={{ padding: "0.65rem", width: "6rem", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
                    />
                </label>
            </div>

            {/* Live comparison — raw vs debounced value */}
            <div style={{ background: "#f1f5f9", padding: "0.85rem 1rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem", lineHeight: 1.8 }}>
                <div>
                    <strong>Raw value:</strong>{" "}
                    <code style={{ background: "#e2e8f0", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                        {query || "(empty)"}
                    </code>
                </div>
                <div>
                    <strong>Debounced value:</strong>{" "}
                    <code style={{ background: "#dbeafe", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                        {debouncedQuery || "(empty)"}
                    </code>
                </div>
                <div>
                    <strong>Simulated API calls:</strong> {searchCount}
                    {" · "}<strong>Delay:</strong> {delay}ms
                    {" · "}<strong>Results:</strong> {filteredResults.length}
                </div>
            </div>

            {/* Filtered results */}
            <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.5rem" }}>
                {filteredResults.map((item) => (
                    <li key={item} style={{ padding: "0.6rem 0.85rem", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.85rem" }}>
                        {item}
                    </li>
                ))}
            </ul>

            {filteredResults.length === 0 && (
                <p style={{ color: "#94a3b8", fontStyle: "italic", marginTop: "0.5rem" }}>No matches found.</p>
            )}
        </section>
    );
}

export default DebounceSearchDemo;
