import { Inbox, Sparkles, ShoppingCart } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Inbox,
      title: 'Unified Inbox',
      description: 'See all DMs in one place. No more switching between Instagram, WhatsApp, and Facebook.',
      color: '#2F5D3E'
    },
    {
      icon: Sparkles,
      title: 'AI Replies',
      description: 'Auto-suggest message responses powered by AI. Reply faster and never miss a lead.',
      color: '#2F5D3E'
    },
    {
      icon: ShoppingCart,
      title: 'Order Creation',
      description: 'Convert conversations into orders instantly. Track everything from chat to checkout.',
      color: '#2F5D3E'
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">Everything you need to manage customer conversations</h2>
          <p className="text-xl text-gray-600">Powerful features designed for social commerce sellers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all hover:shadow-xl group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg"
                  style={{ backgroundColor: feature.color }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
