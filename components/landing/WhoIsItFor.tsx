import { Instagram, MessageCircle, Facebook, Store } from 'lucide-react';

export function WhoIsItFor() {
  const audiences = [
    {
      icon: Instagram,
      title: 'Instagram Sellers',
      description: 'Manage all your Instagram DMs, customers, and orders in one place.',
      color: '#2F5D3E'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Store Owners',
      description: 'Handle inquiries, send quick replies, and track conversions.',
      color: '#2F5D3E'
    },
    {
      icon: Facebook,
      title: 'Facebook Page Businesses',
      description: 'Centralize your Facebook messages and respond faster.',
      color: '#2F5D3E'
    },
    {
      icon: Store,
      title: 'D2C Small Brands',
      description: 'Scale conversations, follow-ups, and orders without switching apps.',
      color: '#2F5D3E'
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">Who is Inboop for?</h2>
          <p className="text-xl text-gray-600">Built for social sellers who want to grow their business</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all hover:shadow-xl group"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md"
                  style={{ backgroundColor: audience.color }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3">{audience.title}</h3>
                <p className="text-gray-600 leading-relaxed">{audience.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
