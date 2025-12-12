import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function Automation() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-6">
            Automate your follow-ups and scale your business
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let AI handle repetitive tasks while you focus on closing deals and growing your sales.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2F5D3E' }}>
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">New message received</div>
                  <div className="font-medium">Instagram DM</div>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400" />

              <div className="flex items-center gap-4 text-gray-900">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2F5D3E' }}>
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">AI suggests response</div>
                  <div className="font-medium">Auto-reply sent</div>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400" />

              <div className="flex items-center gap-4 text-gray-900">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2F5D3E' }}>
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Lead captured</div>
                  <div className="font-medium">Order created</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 text-white rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl" style={{ backgroundColor: '#2F5D3E' }}>
            See Automation in Action
          </button>
        </div>
      </div>
    </section>
  );
}
