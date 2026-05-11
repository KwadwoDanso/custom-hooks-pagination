// useDebounce.ts — debounces a rapidly changing value
// Inputs: value (generic T), delay in ms (default 500)
// Returns: debouncedValue — updates only after `delay` ms of no changes
import { useState, useEffect } from "react";

const DEFAULT_DELAY = 500;

function useDebounce<T>(value: T, delay: number = DEFAULT_DELAY): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set a timer to update debouncedValue after the delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup: if value or delay changes before the timer fires,
        // clear the old timer — this is the core of debouncing
        return () => clearTimeout(timer);
    }, [value, delay]);

    // console.log("useDebounce debug:", { value, debouncedValue, delay });

    return debouncedValue;
}

export default useDebounce;