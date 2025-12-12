import { Star } from 'lucide-react';
import { useState } from 'react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Martinez',
      role: 'Founder, BeautyBox',
      avatar: 'SM',
      text: 'Inboop has completely transformed how we handle customer inquiries. We\'ve increased our response rate by 300% and our conversion rate has doubled.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Owner, FashionHub',
      avatar: 'MC',
      text: 'Managing Instagram, WhatsApp, and Facebook was a nightmare before Inboop. Now everything is in one place and our team is so much more productive.',
      rating: 5
    },
    {
      name: 'Jessica Lee',
      role: 'Co-founder, HomeDecor Co',
      avatar: 'JL',
      text: 'The AI reply suggestions are incredible. They save us hours every day and help us maintain a consistent brand voice across all channels.',
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#2F5D3E' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-white mb-4">Loved by sellers worldwide</h2>
          <p className="text-xl text-white/80">See what our customers have to say</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
