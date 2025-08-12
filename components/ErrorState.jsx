export default function ErrorState({ message = 'Something went wrong.' }) {
  return (
    <div className="p-6 text-center text-red-300 bg-red-500/10 ring-1 ring-red-500/20 rounded-lg">
      {message}
    </div>
  );
}