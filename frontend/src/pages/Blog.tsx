const posts = [
  {
    title: 'AgriTech AI трендтері',
    excerpt: 'Деректерге негізделген суару жүйелері мен дрон аналитикасы.',
    link: '#',
  },
  {
    title: 'Қазақстандағы цифрлық фермер кейсі',
    excerpt: 'LoRaWAN датчиктері өнімділікті 15% арттырды.',
    link: '#',
  },
  {
    title: 'Drone-as-a-Service моделі',
    excerpt: 'Шағын шаруашылықтарға арналған жаңа бизнес үлгісі.',
    link: '#',
  },
];

const Blog = () => (
  <section className="mx-auto max-w-5xl px-4 py-16">
    <h1 className="text-3xl font-bold text-slate-900">Жаңалықтар мен жарияланымдар</h1>
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <article key={post.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">{post.title}</h2>
          <p className="mt-3 text-sm text-slate-600">{post.excerpt}</p>
          <a href={post.link} className="mt-4 inline-flex text-sm font-semibold text-primary">
            Толығырақ (Подробнее)
          </a>
        </article>
      ))}
    </div>
  </section>
);

export default Blog;
