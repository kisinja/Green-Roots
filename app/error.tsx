"use client";

import {useEffect} from 'react'
import {ErrorPage} from '@/components/error/ErrorPage';
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

interface ErrorProps {
    error: Error & {digest?:string};
    reset:() => void;
}

const Error = ({error, reset}: ErrorProps) => {
    const network = useNetworkStatus();

    useEffect(() => {
    // Log to your error tracking service (Sentry, etc.)
    console.error("[App Error]", error);
  }, [error]);

  // Determine error type from network status or error message
  if (network === "offline") {
    return <ErrorPage type="offline" reset={reset} />;
  }
 
  if (network === "slow") {
    return <ErrorPage type="network" reset={reset} />;
  }

  // Detect server/fetch errors
  const msg = error?.message?.toLowerCase() ?? "";
  if (
    msg.includes("fetch") ||
    msg.includes("network") ||
    msg.includes("failed to fetch") ||
    msg.includes("load failed")
  ) {
    return <ErrorPage type="network" reset={reset} />;
  }
 
  if (msg.includes("500") || msg.includes("internal server")) {
    return <ErrorPage type="serverError" reset={reset} />;
  }

  return <ErrorPage type="generic" reset={reset} />
}

export default Error
