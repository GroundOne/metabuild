import { useCallback, useState, } from "react";

type AsyncState = "idle" | "pending" | "success" | "error"

// Hook
export const useAsync = <T, I, E = string>(
    asyncFunction: (params?: I) => Promise<T>
) => {
    const [status, setStatus] = useState<AsyncState>("idle");
    const [value, setValue] = useState<T | null>(null);
    const [error, setError] = useState<E | null>(null);
    // The execute function wraps asyncFunction and
    // handles setting state for pending, value, and error.
    // useCallback ensures the below useEffect is not called
    // on every render, but only if asyncFunction changes.
    const execute = useCallback(
        (params?: I) => {
            setStatus("pending");
            setValue(null);
            setError(null);
            return asyncFunction(params)
                .then((response: any) => {
                    setValue(response);
                    setStatus("success");
                    console.log("useAsync: success");
                })
                .catch((error: any) => {
                    setError(error);
                    setStatus("error");
                    console.log("useAsync: error", error);
                });
        },
        [asyncFunction]
    );
    // Call execute if we want to fire it right away.
    // Otherwise execute can be called later, such as
    // in an onClick handler.
    return { execute, status, value, error };
};
