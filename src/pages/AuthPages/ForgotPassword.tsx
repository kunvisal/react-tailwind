import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "../../icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "../../utils/validation/schemas";

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send reset email");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Forgot Password | TailAdmin"
        description="Reset your password"
      />
      <AuthLayout>
        <div className="flex flex-col flex-1">
          <div className="w-full max-w-md pt-10 mx-auto">
            <Link
              to="/signin"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeftIcon className="size-5" />
              Back to sign in
            </Link>
          </div>
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Forgot Password?
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isSubmitted
                    ? "Check your email for reset instructions"
                    : "Enter your email and we'll send you instructions to reset your password"}
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-4 rounded-lg bg-success-50 dark:bg-success-500/10 border border-success-200 dark:border-success-500/20">
                  <p className="text-sm text-success-600 dark:text-success-400">
                    If an account exists with that email, you will receive password reset instructions.
                  </p>
                  <Link
                    to="/signin"
                    className="mt-4 inline-block text-sm text-brand-500 hover:text-brand-600"
                  >
                    Return to sign in
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/20">
                      <p className="text-sm text-error-600 dark:text-error-400">
                        {error}
                      </p>
                    </div>
                  )}
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Email <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        placeholder="info@gmail.com"
                        {...register("email")}
                        error={errors.email?.message}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-error-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Button
                        type="submit"
                        className="w-full"
                        size="sm"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}

