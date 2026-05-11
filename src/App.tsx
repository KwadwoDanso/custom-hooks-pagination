// App.tsx — renders both custom hook demos side by side

import PaginationDemo from "./components/PaginationDemo";
import DebounceSearchDemo from "./components/DebounceSearchDemo";

function App() {
  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Custom Hooks Lab
      </h1>
      <p style={{ color: "#64748b", marginBottom: "2rem", fontSize: "0.95rem" }}>
        Two reusable hooks: <code>usePagination</code> and <code>useDebounce</code>
      </p>

      <div style={{ display: "grid", gap: "2.5rem" }}>
        <PaginationDemo />
        <hr style={{ border: "none", borderTop: "1px solid #e2e8f0" }} />
        <DebounceSearchDemo />
      </div>
    </main>
  );
}

export default App;