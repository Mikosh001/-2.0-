import { Card } from '../components/Card';

const stories = [
  {
    name: 'Айнагүл',
    role: 'Дрон-оператор',
    text: '«3 апта ішінде дрон ұшыруды үйреніп, кооперативте жұмысқа тұрдым.»'
  },
  {
    name: 'Нұркен',
    role: 'Agro-IoT техник',
    text: '«Сенсорлық мониторинг жүйесін іске қосып, ферма өнімділігін 18% көтердік.»'
  }
];

const Stories = () => (
  <section style={{ display: 'grid', gap: '1.5rem' }}>
    <h1>Success Stories (Сәттілік тарихтары)</h1>
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
      {stories.map((story) => (
        <Card key={story.name} title={`${story.name} · ${story.role}`}>
          <p>{story.text}</p>
        </Card>
      ))}
    </div>
  </section>
);

export default Stories;
