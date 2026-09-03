import Image from "next/image";

export function AuthIllustration() {
  return (
    <div className="hidden z-10 relative lg:flex justify-center items-center">
      <Image
        src="/illustrations/signing-contract.gif"
        alt="Signing a contract"
        className="w-17.5 h-137.5"
        width={300}
        height={300}
        priority
      />
    </div>
  );
}
