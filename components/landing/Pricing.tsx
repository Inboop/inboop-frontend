'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

const BRAND_GREEN = '#2F5D3E';

export function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(1); // Default to Pro (index 1)

const plans = [
  {
    name: 'Starter',
    price: '2.99',
    description: 'Perfect for solopreneurs and small sellers',
    features: [
      'Up to 500 conversations/month',
      'All 3 channel integrations',
      'AI reply suggestions',
      'Create orders from chat',
      'Customer profiles & tags',
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
      'All Starter features',
      'Advanced analytics',
      'Saved templates',
      'Auto follow-ups & reminders',
      '3 team members included',
      'Priority email support'
    ],
    highlighted: true
  },
  {
    name: 'Business',
    price: '15.99',
    description: 'For established brands and multi-agent teams',
    features: [
      'Unlimited conversations',
      'Everything in Pro',
      'Unlimited team members',
      'Custom automations',
      'Basic integration hooks (e.g., Zapier webhook)',
      'Priority support'
    ],
    highlighted: false
  }
];


  return (
    <section id="pricing" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-gray-600">Choose the perfect plan for your business</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => {
            const isSelected = selectedPlan === index;
            return (
              <div
                key={index}
                onClick={() => setSelectedPlan(index)}
                className={`rounded-3xl p-8 transition-all cursor-pointer flex flex-col ${
                  isSelected
                    ? 'text-white shadow-2xl scale-105 border-2'
                    : 'bg-white text-gray-900 shadow-lg border border-gray-200 hover:shadow-xl hover:border-gray-300'
                }`}
                style={isSelected ? { backgroundColor: BRAND_GREEN, borderColor: BRAND_GREEN } : {}}
              >
                <div className="text-center mb-8 flex-shrink-0">
                  <h3 className={`text-2xl mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className={`text-5xl ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      ${plan.price}
                    </span>
                    <span className={`text-lg ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                      /month
                    </span>
                  </div>
                  <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected ? 'bg-white/20' : ''
                        }`}
                        style={!isSelected ? { backgroundColor: `${BRAND_GREEN}20` } : {}}
                      >
                        <Check
                          className="w-3 h-3"
                          style={{ color: isSelected ? 'white' : BRAND_GREEN }}
                        />
                      </div>
                      <span className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-full transition-all mt-auto ${
                    isSelected
                      ? 'bg-white hover:bg-gray-100 shadow-lg'
                      : 'border hover:bg-gray-50'
                  }`}
                  style={isSelected
                    ? { color: BRAND_GREEN }
                    : { borderColor: BRAND_GREEN, color: BRAND_GREEN }
                  }
                >
                  Get Started
                </button>
              </div>
            );
          })}
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
