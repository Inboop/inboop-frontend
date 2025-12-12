import { Check } from 'lucide-react';

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '2.99',
      description: 'Perfect for solopreneurs and small sellers',
      features: [
        'Up to 500 conversations/month',
        'All 3 channel integrations',
        'AI reply suggestions',
        'Basic analytics',
        'Email support'
      ],
      highlighted: false
    },
    {
      name: 'Pro',
      price: '7.99',
      description: 'For growing businesses and teams',
      features: [
        'Up to 2000 conversations/month',
        'All 3 channel integrations',
        'AI reply suggestions',
        'Advanced analytics',
        'Team collaboration',
        'Priority support',
        'Custom automations'
      ],
      highlighted: true
    },
    {
      name: 'Business',
      price: '15.99',
      description: 'For established brands and enterprises',
      features: [
        'Unlimited conversations',
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        'API access',
        'White-label options',
        '24/7 phone support',
        'SLA guarantee'
      ],
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-gray-600">Choose the perfect plan for your business</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 transition-all ${
                plan.highlighted
                  ? 'bg-gray-900 text-white shadow-2xl scale-105 border-2 border-gray-900'
                  : 'bg-white text-gray-900 shadow-lg border border-gray-200 hover:shadow-xl'
              }`}
            >
              <div className="text-center mb-8">
                <h3 className={`text-2xl mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-5xl ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-lg ${plan.highlighted ? 'text-white/70' : 'text-gray-500'}`}>
                    /month
                  </span>
                </div>
                <p className={`text-sm ${plan.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? 'bg-white/20' : 'bg-green-100'
                      }`}
                    >
                      <Check className={`w-3 h-3 ${plan.highlighted ? 'text-white' : 'text-green-600'}`} />
                    </div>
                    <span className={`text-sm ${plan.highlighted ? 'text-white/90' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-full transition-all ${
                  plan.highlighted
                    ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
                style={!plan.highlighted ? { borderColor: '#2F5D3E', color: '#2F5D3E' } : {}}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
