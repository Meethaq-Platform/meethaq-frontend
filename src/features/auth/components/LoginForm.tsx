"use client";

import Link from "next/link";
import { AuthCard } from "./AuthCard";
import { AuthHeader } from "./AuthHeader";
import Button from "@/src/shared/components/Button";
import Input from "@/src/shared/components/Input";
import { LoginFormValues, loginSchema } from "../schemas/login.schema";
import { useLogin } from "../hooks/useLogin";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputError from "@/src/shared/components/InputError";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrFullName: "",
      password: "",
    },
  });

  const { mutate, isPending, isError, error } = useLogin();
  const router = useRouter();

  const onSubmit = (data: LoginFormValues) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  return (
    <AuthCard>
      <AuthHeader title="Welcome back" description="Sign in to your account." />

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="emailOrFullName"
          {...register("emailOrFullName")}
          name="emailOrFullName"
          label="Email or Username"
          type="email"
          placeholder="you@example.com"
        />
        <InputError message={errors.emailOrFullName?.message} />
        <Input
          id="password"
          {...register("password")}
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
        />
        <InputError message={errors.password?.message} />

        {isError && (
          <InputError
            message={
              error instanceof Error
                ? error.message
                : "Registration failed. Please try again."
            }
          />
        )}
        <Button
          type="submit"
          className="mt-6 w-full"
          loading={isPending}
          loadingText="Signing in..."
        >
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-text-secondary text-sm text-center">
        Don&apos;t have an account?
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    </AuthCard>
  );
}
