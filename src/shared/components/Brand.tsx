import Image from "next/image";

export default function Brand() {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Image src="/logo.webp" alt="meethaq" width={70} height={70} priority />

      <span className="font-bold text-text-primary text-3xl">Meethaq</span>
    </div>
  );
}
