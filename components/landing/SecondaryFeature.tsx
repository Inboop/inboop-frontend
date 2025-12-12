import { Check, MessageSquare, Users, Zap, Instagram, Facebook, ArrowRight, MessageCircle } from 'lucide-react';

function UnifiedInboxIllustration() {
  return (
    <div className="relative w-full flex items-center justify-center py-16">
      <div className="flex items-center gap-12">
        {/* Left side - Social platform icons */}
        <div className="flex flex-col gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center border border-gray-200">
            <Instagram className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center border border-gray-200">
            <MessageCircle className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center border border-gray-200">
            <Facebook className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <ArrowRight className="w-6 h-6 text-gray-400 ml-1" strokeWidth={2} />
        </div>

        {/* Right side - Unified inbox card */}
        <div className="w-72 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2F5D3E' }}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="h-2 bg-gray-200 rounded-full w-20"></div>
          </div>

          {/* Message rows - conversation style */}
          <div className="p-5 space-y-3">
            {/* Message 1 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0"></div>
              <div className="flex-1 space-y-1">
                <div className="h-2 bg-gray-300 rounded-full w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
              </div>
            </div>

            {/* Message 2 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0"></div>
              <div className="flex-1 space-y-1">
                <div className="h-2 bg-gray-300 rounded-full w-2/3"></div>
                <div className="h-2 bg-gray-200 rounded-full w-2/5"></div>
              </div>
            </div>

            {/* Message 3 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0"></div>
              <div className="flex-1 space-y-1">
                <div className="h-2 bg-gray-300 rounded-full w-4/5"></div>
                <div className="h-2 bg-gray-200 rounded-full w-3/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SecondaryFeature() {
  const benefits = [
    { icon: MessageSquare, text: 'All messages from Instagram, WhatsApp & Facebook in one view' },
    { icon: Users, text: 'Manage leads with smart tagging and status tracking' },
    { icon: Zap, text: 'Instant notifications so you never miss a message' },
    { icon: Check, text: 'Search and filter conversations in seconds' }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <UnifiedInboxIllustration />
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-4xl text-gray-900 mb-6">
              Stop switching apps. Manage all your social conversations in one place.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Save hours every day by bringing all your customer messages into a single, powerful inbox.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#2F5D3E' }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 pt-1">{benefit.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
