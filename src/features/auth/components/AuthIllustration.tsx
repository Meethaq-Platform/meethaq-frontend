import Image from "next/image";

export function AuthIllustration() {
  return (
    <div className="hidden z-10 relative lg:flex justify-center items-center">
      <Image
        src="/illustrations/signing-contract.gif"
        alt="Signing a contract"
        className="dark:rounded-2xl w-[550px] h-[550px]"
        width={300}
        height={300}
        priority
      />
    </div>
  );
}
