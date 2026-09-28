import Spinner from "@/src/shared/components/Spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center py-16">
      <Spinner size={28} />
    </div>
  );
}
