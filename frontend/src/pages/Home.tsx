import { kk } from '../i18n/kk';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import './Home.css';

const Home = () => {
  return (
    <section className="home">
      <div className="hero">
        <h1>{kk.slogan}</h1>
        <p>
          AgriTech экожүйесіне арналған upskilling платформасы. Цифрлық дағдылар, симуляторлар
          және нақты жұмыс ұсыныстары.
        </p>
        <Button onClick={() => (window.location.href = '/auth/register')}>{kk.home.heroCta}</Button>
      </div>
      <div className="benefits">
        {kk.home.benefits.map((benefit) => (
          <Card key={benefit} title={benefit}>
            <p>
              АПК саласындағы цифрлық болашағыңды аш! <small>(Раскрой свой цифровой потенциал)</small>
            </p>
          </Card>
        ))}
      </div>
      <div className="partners">
        <h2>{kk.home.partners}</h2>
        <div className="partner-strip">
          <span>AgroFuture</span>
          <span>DigitalSteppe</span>
          <span>Qoldau Labs</span>
          <span>Ұлттық АПК</span>
        </div>
      </div>
    </section>
  );
};

export default Home;
