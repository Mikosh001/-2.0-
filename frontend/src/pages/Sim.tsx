import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';

interface SimResult {
  coverageTime: number;
  overlap: number;
  status: 'pass' | 'fail';
}

const Sim = () => {
  const [speed, setSpeed] = useState(5);
  const [altitude, setAltitude] = useState(30);
  const [swath, setSwath] = useState(15);
  const [result, setResult] = useState<SimResult | null>(null);
  const { notify } = useToast();

  const runSim = () => {
    const fieldLength = 600; // meters
    const fieldWidth = 300;
    const passes = Math.ceil(fieldWidth / swath);
    const distance = passes * fieldLength;
    const coverageTime = distance / speed;
    const optimalOverlap = 20;
    const actualOverlap = Math.max(0, 100 - (swath / (altitude / 2)) * 10);
    const overlapDiff = Math.abs(actualOverlap - optimalOverlap);
    const status = coverageTime < 360 && overlapDiff < 15 ? 'pass' : 'fail';
    setResult({ coverageTime, overlap: overlapDiff, status });
  };

  const attachToPortfolio = () => {
    if (!result) return;
    localStorage.setItem('simResult', JSON.stringify(result));
    notify('Симулятор нәтижесі сақталды (Сохранено)');
  };

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <h1>Дрон маршруты симуляторы (Симулятор маршрута)</h1>
      <Card title="Параметрлер (Параметры)">
        <label>
          Жылдамдық м/с (Скорость)
          <input type="number" value={speed} min={1} onChange={(e) => setSpeed(Number(e.target.value))} />
        </label>
        <label>
          Биіктік м (Высота)
          <input type="number" value={altitude} min={10} onChange={(e) => setAltitude(Number(e.target.value))} />
        </label>
        <label>
          Қамту ені м (Ширина прохода)
          <input type="number" value={swath} min={5} onChange={(e) => setSwath(Number(e.target.value))} />
        </label>
        <Button onClick={runSim}>Есептеу (Рассчитать)</Button>
      </Card>
      <canvas
        width={500}
        height={220}
        style={{ background: '#f0f9ff', borderRadius: '16px', border: '1px solid #007bff', width: '100%', maxWidth: '600px' }}
      >
        Дрон маршруты
      </canvas>
      {result && (
        <Card title="Нәтиже (Результат)">
          <p>Қамту уақыты: {result.coverageTime.toFixed(1)} сек.</p>
          <p>Қабаттасу ауытқуы: {result.overlap.toFixed(1)}%</p>
          <p>
            Статус: {result.status === 'pass' ? 'Жақсы (Успех)' : 'Қайта жоспарла (Пересчитать)'}
          </p>
          <Button onClick={attachToPortfolio}>Портфолиоға қосу (Добавить)</Button>
        </Card>
      )}
    </section>
  );
};

export default Sim;
