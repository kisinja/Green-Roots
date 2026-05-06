// app/admin/layout.tsx
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f7fa]">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}