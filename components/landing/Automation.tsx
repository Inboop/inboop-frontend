import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function Automation() {
  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ backgroundColor: '#2F5D3E' }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl text-white mb-6">
            Automate your follow-ups and scale your business
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Let AI handle repetitive tasks while you focus on closing deals and growing your sales.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm opacity-90">New message received</div>
                  <div>Instagram DM</div>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-white opacity-60" />

              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm opacity-90">AI suggests response</div>
                  <div>Auto-reply sent</div>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-white opacity-60" />

              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm opacity-90">Lead captured</div>
                  <div>Order created</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl">
            See Automation in Action
          </button>
        </div>
      </div>
    </section>
  );
}
