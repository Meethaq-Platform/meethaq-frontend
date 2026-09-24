"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AuthCard } from "./AuthCard";
import { AuthHeader } from "./AuthHeader";
import Button from "@/src/shared/components/Button";
import Input from "@/src/shared/components/Input";
import PasswordInput from "@/src/shared/components/PasswordInput";
import { createLoginSchema, type LoginFormValues } from "../schemas/login.schema";
import { useLogin } from "../hooks/useLogin";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputError from "@/src/shared/components/InputError";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tValidation = useTranslations("auth.validation");
  const loginSchema = useMemo(() => createLoginSchema(tValidation), [tValidation]);

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
      <AuthHeader title={t("title")} />

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="emailOrFullName"
          {...register("emailOrFullName")}
          name="emailOrFullName"
          label={t("identifierLabel")}
          type="email"
          placeholder={t("identifierPlaceholder")}
        />
        <InputError message={errors.emailOrFullName?.message} />
        <PasswordInput
          id="password"
          {...register("password")}
          name="password"
          label={t("passwordLabel")}
          placeholder="••••••••"
        />
        <InputError message={errors.password?.message} />

        {isError && (
          <InputError
            message={
              error instanceof Error
                ? error.message
                : t("failed")
            }
          />
        )}
        <Button
          type="submit"
          className="mt-6 w-full"
          loading={isPending}
          loadingText={t("submitting")}
        >
          {t("submit")}
        </Button>
      </form>

      <p className="mt-6 text-text-secondary text-sm text-center">
        {t.rich("noAccount", {
          link: (chunks) => (
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </AuthCard>
  );
}
