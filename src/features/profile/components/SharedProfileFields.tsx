import { useTranslations } from "next-intl";
import type { FieldErrors, Path, UseFormRegister } from "react-hook-form";

import Input from "@/src/shared/components/Input";
import InputError from "@/src/shared/components/InputError";

interface SharedProfileFieldValues {
  fullName: string;
  phoneNumber: string;
  country: string;
}

interface SharedProfileFieldsProps<T extends SharedProfileFieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export function SharedProfileFields<T extends SharedProfileFieldValues>({
  register,
  errors,
}: SharedProfileFieldsProps<T>) {
  const t = useTranslations("profile.fields");

  return (
    <div className="gap-x-6 gap-y-4 grid grid-cols-1 sm:grid-cols-3">
      <div>
        <Input label={t("fullName")} {...register("fullName" as Path<T>)} />
        <InputError message={errors.fullName?.message as string} />
      </div>

      <div>
        <Input label={t("phone")} dir="ltr" {...register("phoneNumber" as Path<T>)} />
        <InputError message={errors.phoneNumber?.message as string} />
      </div>

      <div>
        <Input label={t("country")} {...register("country" as Path<T>)} />
        <InputError message={errors.country?.message as string} />
      </div>
    </div>
  );
}
