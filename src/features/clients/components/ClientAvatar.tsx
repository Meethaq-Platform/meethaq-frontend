interface ClientAvatarProps {
  fullName: string;
  profileImage: string | null;
}

const palette = [
  "bg-primary-muted text-primary",
  "bg-accent-value-muted text-accent-value",
  "bg-info-muted text-info",
  "bg-success-muted text-success",
];

function colorFor(name: string) {
  const index = name.charCodeAt(0) % palette.length;
  return palette[index];
}

export function ClientAvatar({ fullName, profileImage }: ClientAvatarProps) {
  const initial = fullName.charAt(0).toUpperCase();

  if (profileImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profileImage}
        alt={fullName}
        className="rounded-full w-10 h-10 object-cover shrink-0"
      />
    );
  }

  return (
    <div
      className={`flex justify-center items-center rounded-full w-10 h-10 shrink-0 font-semibold text-sm ${colorFor(fullName)}`}
    >
      {initial}
    </div>
  );
}
