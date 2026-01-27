import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-16 px-6 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/SolidLogo.png"
                alt="Inboop"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl text-gray-900">Inboop</span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              AI-powered CRM for social commerce. Manage all your customer conversations in one place.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#integrations" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2026 Inboop. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-600 hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
