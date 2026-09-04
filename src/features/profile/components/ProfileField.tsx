interface ProfileFieldProps {
  label: string;
  value: string;
}

export function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-text-secondary text-sm">{label}</p>
      <p className="font-semibold text-text-primary text-sm">{value}</p>
    </div>
  );
}
