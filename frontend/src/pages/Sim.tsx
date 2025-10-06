import { useEffect, useRef, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useToast } from '../utils/ToastContext';

interface SimResult {
  speed: number;
  altitude: number;
  swath: number;
  coverageMinutes: number;
  overlapError: number;
  pass: boolean;
}

const waypoints = [
  { x: 50, y: 50 },
  { x: 250, y: 80 },
  { x: 200, y: 220 },
  { x: 60, y: 240 },
];

const Sim = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [speed, setSpeed] = useState(5);
  const [altitude, setAltitude] = useState(40);
  const [swath, setSwath] = useState(20);
  const [result, setResult] = useState<SimResult | null>(null);
  const { setToast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i += 1) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#007bff';
    waypoints.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`WP${index + 1}`, point.x + 8, point.y + 4);
      ctx.fillStyle = '#007bff';
    });
  }, []);

  const runSimulation = () => {
    const distances = [] as number[];
    for (let i = 0; i < waypoints.length; i += 1) {
      const next = waypoints[(i + 1) % waypoints.length];
      const current = waypoints[i];
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      distances.push(Math.sqrt(dx * dx + dy * dy));
    }
    const totalDistance = distances.reduce((sum, d) => sum + d, 0);
    const coverageMinutes = (totalDistance / speed) * (altitude / 50);
    const idealSwath = altitude / 2;
    const overlapError = Math.abs(swath - idealSwath) / idealSwath;
    const pass = coverageMinutes <= 40 && overlapError <= 0.3;
    const simResult: SimResult = {
      speed,
      altitude,
      swath,
      coverageMinutes: Number(coverageMinutes.toFixed(1)),
      overlapError: Number((overlapError * 100).toFixed(1)),
      pass,
    };
    setResult(simResult);
  };

  const saveResult = () => {
    if (!result) return;
    const existing = localStorage.getItem('professiya-sim');
    const history: SimResult[] = existing ? JSON.parse(existing) : [];
    history.unshift({ ...result });
    localStorage.setItem('professiya-sim', JSON.stringify(history.slice(0, 5)));
    setToast({ message: 'Симулятор нәтижесі портфолиоға сақталды', type: 'success' });
  };

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2>UAV маршрут симуляторы</h2>
      <p>Параметрлерді енгізіп, дрон миссиясының уақытын және жабу сапасын бағалаңыз.</p>
      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', marginTop: '1.5rem' }}>
        <Card title="Параметрлер">
          <label>
            Жылдамдық (м/с)
            <input type="number" value={speed} min={1} max={15} onChange={(e) => setSpeed(Number(e.target.value))} />
          </label>
          <label>
            Биіктік (м)
            <input type="number" value={altitude} min={20} max={120} onChange={(e) => setAltitude(Number(e.target.value))} />
          </label>
          <label>
            Қамту ені (м)
            <input type="number" value={swath} min={5} max={80} onChange={(e) => setSwath(Number(e.target.value))} />
          </label>
          <Button onClick={runSimulation}>Есептеу (Расчёт)</Button>
        </Card>
        <Card title="Дала картасы">
          <canvas ref={canvasRef} width={320} height={260} style={{ width: '100%', borderRadius: '16px', border: '1px solid rgba(15,23,42,0.1)' }} />
        </Card>
        {result && (
          <Card title="Нәтиже">
            <p>Қамту уақыты: {result.coverageMinutes} мин</p>
            <p>Қабаттасу қателігі: {result.overlapError}%</p>
            <p>Қорытынды: {result.pass ? 'Pass ✅' : 'Fail ⚠️'}</p>
            <Button onClick={saveResult}>Портфолиоға қосу</Button>
            {!result.pass && (
              <p>
                Кеңес: жылдамдық пен биіктікті теңше. Идеал қамту ені ≈ биіктік / 2.
              </p>
            )}
          </Card>
        )}
      </div>
    </section>
  );
};

export default Sim;
