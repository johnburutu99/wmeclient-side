
import dynamic from 'next/dynamic';
const AuthForm = dynamic(() => import('../../components/AuthForm'), { ssr: false });

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-900 border border-gold">
        <h1 className="text-3xl font-bold mb-6 text-gold">WME Client Portal Login</h1>
        <AuthForm />
        <div className="mt-4 flex flex-col gap-2">
          <button className="w-full p-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Login with Google</button>
          <button className="w-full p-2 rounded bg-blue-800 text-white font-semibold hover:bg-blue-900 transition">Login with Microsoft</button>
        </div>
        <p className="mt-4 text-xs text-gray-400">© {new Date().getFullYear()} William Morris Endeavor</p>
      </div>
    </main>
  );
}
