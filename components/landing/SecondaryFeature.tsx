import { Check, MessageSquare, Users, Zap } from 'lucide-react';

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
            <div className="rounded-3xl bg-white p-8 shadow-2xl border border-gray-100">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-300 rounded-full w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                    </div>
                    <div className="text-xs text-gray-400">2m</div>
                  </div>
                ))}
              </div>
            </div>
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
