import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Image
              src="/images/SimpleLogo.png"
              alt="Inboop"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl text-white">Inboop</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#integrations" className="text-gray-300 hover:text-white transition-colors">
              Integrations
            </a>
            <a href="#blog" className="text-gray-300 hover:text-white transition-colors">
              Blog
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 text-white rounded-full hover:opacity-90 transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#2F5D3E' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
