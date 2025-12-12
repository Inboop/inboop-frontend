import { Instagram, MessageCircle, Facebook } from 'lucide-react';

export function Integrations() {
  const integrations = [
    { icon: Instagram, name: 'Instagram', description: 'Connect your Instagram business account' },
    { icon: MessageCircle, name: 'WhatsApp', description: 'Sync WhatsApp Business messages' },
    { icon: Facebook, name: 'Facebook', description: 'Manage Facebook Messenger chats' }
  ];

  return (
    <section id="integrations" className="py-20 px-6" style={{ backgroundColor: '#2F5D3E' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-white mb-4">Works with all your channels</h2>
          <p className="text-xl text-white/80">Connect your favorite platforms in seconds</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 transition-all hover:shadow-xl text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2">{integration.name}</h3>
                <p className="text-gray-600 text-sm">{integration.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
