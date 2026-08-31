import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function SuccessfulRegister() {
  return (
    <div className="flex flex-col items-center w-full max-w-md text-center">
      {/* Success icon */}
      <div className="flex justify-center items-center bg-success-muted mb-6 rounded-full w-16 h-16">
        <CheckCircle2 className="w-8 h-8 text-success" strokeWidth={2} />
      </div>

      {/* Heading */}
      <h1 className="font-bold text-text-primary text-2xl sm:text-3xl tracking-tight">
        Account created!
      </h1>

      {/* Description */}
      <p className="mt-3 max-w-sm text-text-secondary text-sm sm:text-base leading-6">
        Your account has been created successfully. You can now sign in and
        start using Meethaq.
      </p>

      {/* CTA */}
      <Link
        href="/login"
        className="flex justify-center items-center gap-2 bg-primary hover:opacity-90 mt-8 px-5 rounded-xl w-full h-11 font-semibold text-white text-sm transition"
      >
        Go to Sign in
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
