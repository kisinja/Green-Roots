import type { Metadata } from "next";
import { AuthForm } from "@/components/ui/AuthForm";

export const metadata: Metadata = {
  title: "Sign In | Mkulima Supply Store",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-[#163e16] mb-1">
            Welcome back
          </h1>

          <p className="text-gray-500">
            Sign in to your Mkulima Supply account
          </p>

          <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-800">
            Use your registered phone number as your password.
          </div>
        </div>
        <AuthForm mode="login" />
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-green-700 font-semibold hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
