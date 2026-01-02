import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function Unauthorized() {
  return (
    <>
      <PageMeta
        title="Unauthorized | TailAdmin"
        description="You don't have permission to access this page"
      />
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-brand-500">403</h1>
          <h2 className="mb-4 text-3xl font-semibold text-gray-800 dark:text-white/90">
            Access Denied
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="rounded-lg bg-brand-500 px-6 py-3 text-white transition hover:bg-brand-600"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/signin"
              className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

