import Card from '../components/Card';

const stories = [
  {
    name: 'Айдос — Дрон-оператор',
    text:
      '«Оқу бағдарламасы арқылы мен өз ауылымдағы кооперативке дрон картографиясын енгіздім. 6 аптада 20%-ға өнімділік артты.»',
  },
  {
    name: 'Аружан — Agro-IoT аналитик',
    text:
      '«LoRaWAN сенсорларын іске қосып, даладағы ылғал көрсеткішін онлайн бақылауға шығардық. Жұмыс беруші мені бірден штатқа алды.»',
  },
];

const Stories = () => (
  <section className="container" style={{ padding: '2rem 0' }}>
    <h2>Табысты оқиғалар (Истории успеха)</h2>
    <div className="card-grid">
      {stories.map((story) => (
        <Card key={story.name} title={story.name}>
          <p>{story.text}</p>
        </Card>
      ))}
    </div>
  </section>
);

export default Stories;
