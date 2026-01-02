import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
  getPasswordStrength,
} from "../../utils/validation/schemas";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null;

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      // Redirect to signin with success message
      navigate("/signin", {
        state: { message: "Password reset successfully! Please sign in." },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reset password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <PageMeta
          title="Reset Password | TailAdmin"
          description="Reset your password"
        />
        <AuthLayout>
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Invalid Reset Link
              </h1>
              <p className="mb-6 text-gray-500 dark:text-gray-400">
                This password reset link is invalid or has expired.
              </p>
              <Link
                to="/forgot-password"
                className="text-brand-500 hover:text-brand-600"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </AuthLayout>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Reset Password | TailAdmin"
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
                  Reset Password
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/20">
                    <p className="text-sm text-error-600 dark:text-error-400">
                      {error}
                    </p>
                  </div>
                )}
                <div className="space-y-6">
                  <input type="hidden" {...register("token")} />
                  <div>
                    <Label>
                      New Password <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        {...register("newPassword")}
                        error={errors.newPassword?.message}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        )}
                      </span>
                    </div>
                    {passwordStrength && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-${passwordStrength.color} transition-all`}
                              style={{
                                width: `${(passwordStrength.score / 6) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span
                            className={`text-xs font-medium text-${passwordStrength.color}`}
                          >
                            {passwordStrength.label}
                          </span>
                        </div>
                      </div>
                    )}
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-error-500">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>
                      Confirm Password <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        {...register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                      />
                      <span
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        )}
                      </span>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-error-500">
                        {errors.confirmPassword.message}
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
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}

