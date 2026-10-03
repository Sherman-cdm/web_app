export function ErrorMessage({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="my-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      {message}
    </p>
  );
}
