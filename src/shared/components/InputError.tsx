interface InputErrorProps {
  message?: string;
}

export default function InputError({ message }: InputErrorProps) {
  if (!message) {
    return null;
  }

  return <p className="text-danger text-sm">{message}</p>;
}
