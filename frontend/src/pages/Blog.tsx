const posts = [
  {
    title: 'AgriTech трендтері 2024',
    excerpt: 'APК цифрландыруы мен дрон қызметтеріне сұраныс өсуде. Біз таңдаулы материалдарды ұсынамыз.',
  },
  {
    title: 'LoRaWAN желісін ауылда орнату',
    excerpt: 'Қадам-қадамымен нұсқаулық және біздің студенттердің тәжірибесі.',
  },
  {
    title: 'Телематика арқылы отын үнемдеу',
    excerpt: 'Smart-tractor курсының инсайттары мен ROI мысалдары.',
  },
];

const Blog = () => (
  <section className="container" style={{ padding: '2rem 0' }}>
    <h2>Promo Hub — Жарияланымдар</h2>
    <p>AgriTech жаңалықтары мен қауымдастық материалдары.</p>
    <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.5rem' }}>
      {posts.map((post) => (
        <li key={post.title} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 10px 20px rgba(15,23,42,0.08)' }}>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <a href="#" style={{ color: '#007bff', fontWeight: 600 }}>
            Толығырақ (Подробнее)
          </a>
        </li>
      ))}
    </ul>
  </section>
);

export default Blog;
