"use client";

import { AuthHeader } from "./AuthHeader";
import { AuthCard } from "./AuthCard";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createSignupSchema,
  type SignupFormValues,
} from "../schemas/register.schema";
import RoleSelection from "./RoleSelection";
import { useRegister } from "../hooks/useRegister";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/src/shared/components/Button";
import Input from "@/src/shared/components/Input";
import InputError from "@/src/shared/components/InputError";
import PasswordInput from "@/src/shared/components/PasswordInput";
import SuccessfulRegister from "./SuccessfulRegister";

export function SignupForm() {
  const t = useTranslations("auth.signup");
  const tValidation = useTranslations("auth.validation");
  const signupSchema = useMemo(() => createSignupSchema(tValidation), [tValidation]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "freelancer",
    },
  });

  const role = useWatch({ control, name: "role" });
  const { mutate, isPending, isError, error } = useRegister();
  const [isRegistered, setIsRegistered] = useState(false);

  const onSubmit = (data: SignupFormValues) => {
    mutate(data, {
      onSuccess: () => {
        setIsRegistered(true);
      },
    });
  };

  return (
    <AuthCard>
      {isRegistered ? (
        <SuccessfulRegister />
      ) : (
        <>
          {" "}
          <AuthHeader title={t("title")} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Name */}
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
              <div>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  label={t("firstNameLabel")}
                  type="text"
                  placeholder={t("firstNamePlaceholder")}
                />
                <InputError message={errors.firstName?.message} />
              </div>

              <div>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  label={t("lastNameLabel")}
                  type="text"
                  placeholder={t("lastNamePlaceholder")}
                />
                <InputError message={errors.lastName?.message} />
              </div>
            </div>

            {/* Email */}
            <div>
              <Input
                id="email"
                {...register("email")}
                label={t("emailLabel")}
                type="email"
                placeholder={t("emailPlaceholder")}
              />
              <InputError message={errors.email?.message} />
            </div>

            {/* Password */}
            <div>
              <PasswordInput
                id="password"
                {...register("password")}
                label={t("passwordLabel")}
                placeholder="••••••••"
              />
              <InputError message={errors.password?.message} />
            </div>
            <div className="bottom-0 sticky flex flex-wrap justify-between items-center gap-8 bg-surface mt-6 pt-3 border-t border-border">
              {/* Role */}
              <RoleSelection
                value={role}
                onChange={(role) =>
                  setValue("role", role, { shouldValidate: true })
                }
                error={errors.role?.message}
              />
              {/* API errors */}
              {isError && (
                <InputError
                  message={
                    error instanceof Error
                      ? error.message
                      : t("failed")
                  }
                />
              )}

              {/* Submit */}
              <Button
                type="submit"
                loading={isPending}
                loadingText={t("submitting")}
              >
                {t("submit")}
              </Button>
            </div>
          </form>
        </>
      )}
    </AuthCard>
  );
}
