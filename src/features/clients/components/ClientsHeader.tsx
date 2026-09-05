import { AddClientButton } from "./AddClientButton";

export function ClientsHeader() {
  return (
    <div className="flex justify-between items-center gap-4">
      <div>
        <h1 className="font-bold text-text-primary text-2xl">Clients</h1>
        <p className="text-text-secondary text-sm">
          Manage the people and companies you work with.
        </p>
      </div>

      <AddClientButton />
    </div>
  );
}
