"use client";

import { AuthHeader } from "./AuthHeader";
import { AuthCard } from "./AuthCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  signupSchema,
  type SignupFormValues,
} from "../schemas/register.schema";
import RoleSelection from "./RoleSelection";
import { useRegister } from "../hooks/useRegister";
import { useState } from "react";
import Button from "@/src/shared/components/Button";
import Input from "@/src/shared/components/Input";
import InputError from "@/src/shared/components/InputError";
import PasswordInput from "@/src/shared/components/PasswordInput";
import SuccessfulRegister from "./SuccessfulRegister";

export function SignupForm() {
  const {
    register,
    handleSubmit,
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
          <AuthHeader
            title="Create your account"
            description="Join Meethaq and get started today."
          />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Name */}
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
              <div>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  label="First name"
                  type="text"
                  placeholder="John"
                />
                <InputError message={errors.firstName?.message} />
              </div>

              <div>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  label="Last name"
                  type="text"
                  placeholder="Doe"
                />
                <InputError message={errors.lastName?.message} />
              </div>
            </div>

            {/* Email */}
            <div>
              <Input
                id="email"
                {...register("email")}
                label="Email"
                type="email"
                placeholder="you@example.com"
              />
              <InputError message={errors.email?.message} />
            </div>

            {/* Password */}
            <div>
              <PasswordInput
                id="password"
                {...register("password")}
                label="Password"
                placeholder="••••••••"
              />
              <InputError message={errors.password?.message} />
            </div>
            <div className="flex flex-wrap justify-between items-center gap-8 mt-6">
              {/* Role */}
              <RoleSelection register={register} errors={errors} />
              {/* API errors */}
              {isError && (
                <InputError
                  message={
                    error instanceof Error
                      ? error.message
                      : "Registration failed. Please try again."
                  }
                />
              )}

              {/* Submit */}
              <Button
                type="submit"
                loading={isPending}
                loadingText="Creating account..."
              >
                Create account
              </Button>
            </div>
          </form>
        </>
      )}
    </AuthCard>
  );
}
