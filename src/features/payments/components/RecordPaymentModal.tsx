"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet } from "lucide-react";

import {
  recordPaymentFormSchema,
  type RecordPaymentFormInput,
  type RecordPaymentFormValues,
} from "../schemas/record-payment.schema";
import { useRecordPayment } from "../hooks/useRecordPayment";
import { PAYMENT_METHOD_OPTIONS } from "../types/payment";
import Button from "@/src/shared/components/Button";
import Modal from "@/src/shared/components/Modal";
import Input from "@/src/shared/components/Input";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import FileAttachmentInput from "@/src/shared/components/FileAttachmentInput";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface RecordPaymentModalProps {
  projectId: string;
  milestoneId: string;
  defaultAmount: number;
  currency: string;
}

// Client-only action, shown on a milestone once its payment status is
// Eligible. Amount/Currency default to the approved milestone allocation
// (including any approved amendment) but amount stays editable in case the
// two drift — the backend is the source of truth and will reject a mismatch.
export function RecordPaymentModal({
  projectId,
  milestoneId,
  defaultAmount,
  currency,
}: RecordPaymentModalProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RecordPaymentFormInput, unknown, RecordPaymentFormValues>({
    resolver: zodResolver(recordPaymentFormSchema),
    defaultValues: {
      paymentMethod: 0,
      paymentDate: new Date().toISOString().slice(0, 10),
      amount: defaultAmount,
      transactionReference: "",
      paymentNotes: "",
      receiptFiles: [],
    },
  });

  const receiptFiles = watch("receiptFiles") ?? [];
  const { mutate, isPending, isError, error } = useRecordPayment(projectId, milestoneId);

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = (values: RecordPaymentFormValues) => {
    mutate(
      {
        paymentMethod: values.paymentMethod,
        paymentDate: values.paymentDate,
        amount: values.amount,
        currency,
        transactionReference: values.transactionReference || undefined,
        paymentNotes: values.paymentNotes || undefined,
        receiptFiles: values.receiptFiles,
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} className="flex items-center gap-1.5 h-9">
        <Wallet size={14} />
        Record Payment
      </Button>

      <Modal open={open} onClose={handleClose} title="Record milestone payment" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium text-text-primary text-sm">
              Payment Method
            </label>
            <select
              {...register("paymentMethod", { valueAsNumber: true })}
              className="bg-surface px-4 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full h-11 text-text-primary text-sm transition"
            >
              {PAYMENT_METHOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <InputError message={errors.paymentMethod?.message} />
          </div>

          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <div>
              <Input type="date" label="Payment Date" {...register("paymentDate")} />
              <InputError message={errors.paymentDate?.message} />
            </div>
            <div>
              <Input
                type="number"
                step="0.01"
                label={`Amount (${currency})`}
                {...register("amount")}
              />
              <InputError message={errors.amount?.message} />
            </div>
          </div>

          <div>
            <Input
              label="Transaction Reference"
              placeholder="e.g. wire confirmation number"
              {...register("transactionReference")}
            />
            <InputError message={errors.transactionReference?.message} />
          </div>

          <div>
            <Textarea
              label="Payment Notes (optional)"
              rows={3}
              {...register("paymentNotes")}
            />
          </div>

          <div>
            <FileAttachmentInput
              files={receiptFiles}
              onChange={(next) => setValue("receiptFiles", next, { shouldValidate: true })}
              label="Attach Receipt"
            />
          </div>

          {isError && (
            <InputError message={getErrorMessage(error, "Failed to record payment.")} />
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="hover:bg-surface-muted disabled:opacity-60 px-4 rounded-xl h-11 font-semibold text-text-secondary text-sm transition disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <Button type="submit" loading={isPending} loadingText="Recording...">
              Record Payment
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
