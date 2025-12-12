export function SocialProof() {
  const brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-gray-500 uppercase tracking-wide mb-8">
          Trusted by online sellers and D2C brands worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12">
          {brands.map((brand, index) => (
            <div key={index} className="text-gray-400 text-xl opacity-60 hover:opacity-100 transition-opacity">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
