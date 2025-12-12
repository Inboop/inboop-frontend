import { Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-gray-900 mb-6" style={{ fontSize: '3.5rem', lineHeight: '1.1' }}>
            Your AI-Powered Inbox for Instagram, WhatsApp & Facebook
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Manage all your customer messages, leads, and orders in one place with automation that boosts your sales.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              className="px-8 py-4 text-white rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: '#2F5D3E' }}
            >
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-all border border-gray-200 shadow-sm hover:shadow-md flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            <div className="bg-gradient-to-br from-gray-50 to-white p-8">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 text-center text-sm text-gray-500">Inboop Dashboard</div>
                </div>
                <div className="h-96 bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg" style={{ backgroundColor: '#2F5D3E' }}>
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">Unified Inbox Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
