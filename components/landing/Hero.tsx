import { Play } from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative py-20 px-6 overflow-hidden" style={{ backgroundColor: '#2F5D3E' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-white mb-6" style={{ fontSize: '3.5rem', lineHeight: '1.1' }}>
            Your AI-Powered Inbox for Instagram, WhatsApp & Facebook
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Manage all your customer messages, leads, and orders in one place with automation that boosts your sales.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              className="px-8 py-4 bg-white rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{ color: '#2F5D3E' }}
            >
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-transparent text-white rounded-full hover:bg-white/10 transition-all border border-white/30 shadow-sm hover:shadow-md flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            <div className="bg-gradient-to-br from-gray-50 to-white p-4">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 text-center text-sm text-gray-500">Unified Inbox Preview</div>
                </div>
                <div className="relative">
                  <Image
                    src="/images/landing/inbox-preview.png"
                    alt="Inboop Unified Inbox Preview"
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
