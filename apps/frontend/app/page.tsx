import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-6">
      <h1 className="text-4xl font-bold">Handydraw</h1>
      <p className="text-gray-400 max-w-md text-center">
        A simple collaborative whiteboard. Sign in to create or join a room
        and start drawing with others in real time.
      </p>
      <div className="flex gap-4">
        <Link
          href="/signin"
          className="px-5 py-2 rounded bg-white text-black font-medium"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="px-5 py-2 rounded border border-white font-medium"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}