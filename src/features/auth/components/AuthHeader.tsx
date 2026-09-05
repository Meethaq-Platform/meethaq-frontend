interface AuthHeaderProps {
  title: string;
  description?: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="font-bold text-text-primary text-3xl tracking-tight">
        {title}
      </h1>

      <p className="mt-2 text-text-secondary text-sm leading-6">
        {description}
      </p>
    </div>
  );
}
