import Spinner from "@/src/shared/components/Spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center">
      <Spinner size={32} />
    </div>
  );
}
