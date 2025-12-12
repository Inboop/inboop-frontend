import { InboopLogo } from '../InboopLogo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <InboopLogo />
            <span className="text-xl text-gray-900">Inboop</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <a href="#integrations" className="text-gray-600 hover:text-gray-900 transition-colors">
              Integrations
            </a>
            <a href="#blog" className="text-gray-600 hover:text-gray-900 transition-colors">
              Blog
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </button>
            <button
              className="px-6 py-2.5 text-white rounded-full hover:opacity-90 transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#2F5D3E' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
