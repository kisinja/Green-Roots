import type { Metadata } from 'next'
import { ErrorPage } from "@/components/error/ErrorPage";

export const metadata: Metadata = {
  title: 'Page Not Found | Mkulima Supply Store',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return <ErrorPage type="notFound" />;
}