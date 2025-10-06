const stories = [
  {
    name: 'Айша — UAV қауіпсіздік инженері',
    result: '3 аптада дрон маршруттарын автоматтандырып, агрохолдингке қабылданды.',
    quote:
      '«Профессия 2.0 симуляторлары арқылы нақты жағдайға дайын болдым. Енді күн сайын егістікті UAV арқылы бақылаймын.»',
  },
  {
    name: 'Нұрлан — Agro IoT аналитигі',
    result: 'LoRaWAN датчиктерін орнатып, ферма су үнемдеуін 18% арттырды.',
    quote:
      '«Курс пен тәлімгерлік бағдарлама маған нақты жобаны қорғауға көмектесті.»',
  },
];

const Stories = () => (
  <section className="mx-auto max-w-5xl px-4 py-16">
    <h1 className="text-3xl font-bold text-slate-900">Табысты түлектер (Истории успеха)</h1>
    <div className="mt-8 space-y-8">
      {stories.map((story) => (
        <article key={story.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-primary">{story.name}</h2>
          <p className="mt-2 text-sm font-medium text-success">{story.result}</p>
          <p className="mt-4 text-slate-600">{story.quote}</p>
        </article>
      ))}
    </div>
  </section>
);

export default Stories;
