"use client";

import { useEffect, useState } from "react";

export type NetworkStatus = "online" | "offline" | "slow";

export function useNetworkStatus(): NetworkStatus {
    const [status, setStatus] = useState<NetworkStatus>("online");

    useEffect(() => {
        const updateStatus = () => {
            if (!navigator.onLine) {
                setStatus("offline");
                return;
            }

            // Check connection quality if available
            const conn = (navigator as any).connection;
            if (conn) {
                const { effectiveType, downlink } = conn;
                if (effectiveType === "2g" || effectiveType === "slow-2g" || downlink < 0.5) {
                    setStatus("slow");
                    return;
                }
            }

            setStatus("online");
        };

        updateStatus();

        window.addEventListener("online", updateStatus);
        window.addEventListener("offline", updateStatus);

        const conn = (navigator as any).connection;
        conn?.addEventListener("change", updateStatus);

        return () => {
            window.removeEventListener("online", updateStatus);
            window.removeEventListener("offline", updateStatus);
            conn?.removeEventListener("change", updateStatus);
        };
    }, []);

    return status;
}