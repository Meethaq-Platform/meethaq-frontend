import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { SignupFormValues } from "../schemas/register.schema";

interface RoleSelectionProps {
  register: UseFormRegister<SignupFormValues>;
  errors: FieldErrors<SignupFormValues>;
}

export default function RoleSelection({
  register,
  errors,
}: RoleSelectionProps) {
  return (
    <div className="space-y-3">
      <p className="font-medium text-text-primary text-sm">Role</p>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="freelancer"
            {...register("role")}
            className="w-4 h-4 accent-primary"
          />

          <span className="text-text-primary text-sm">Freelancer</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="client"
            {...register("role")}
            className="w-4 h-4 accent-primary"
          />

          <span className="text-text-primary text-sm">Client</span>
        </label>
      </div>

      {errors.role && (
        <p className="text-danger text-sm">{errors.role.message}</p>
      )}
    </div>
  );
}
