const posts = [
  {
    title: 'Агро-дрон трендтері',
    excerpt: 'Қазақстан фермерлері үшін UAV трендтері.'
  },
  {
    title: 'IoT датчиктерді таңдаудың 5 қадамы',
    excerpt: 'LoRaWAN және NB-IoT салыстыруы.'
  },
  {
    title: 'Телематика ROI есебі',
    excerpt: 'Ақылды трактор паркін оңтайландыру.'
  }
];

const Blog = () => (
  <section style={{ display: 'grid', gap: '1.5rem' }}>
    <h1>Promo Hub (Жарияланымдар)</h1>
    <div style={{ display: 'grid', gap: '1rem' }}>
      {posts.map((post) => (
        <article key={post.title} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px' }}>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <a href="#" style={{ color: '#007bff' }}>
            Толығырақ (Подробнее)
          </a>
        </article>
      ))}
    </div>
  </section>
);

export default Blog;
