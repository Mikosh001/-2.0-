import { kk } from '../i18n/kk';
import Button from '../components/Button';
import Card from '../components/Card';
import BadgePill from '../components/BadgePill';
import './Home.css';

const Home = () => (
  <div className="home">
    <section className="home-hero">
      <div className="container hero-content">
        <div>
          <BadgePill color="gold" label="AgriTech" />
          <h1>{kk.hero.title}</h1>
          <p className="hero-subtitle">{kk.hero.subtitle}</p>
          <div className="hero-actions">
            <Button>{kk.hero.cta}</Button>
            <a href="#partners" className="hero-link">
              {kk.partners}
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden>
          <div className="hero-circle" />
          <img src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=60" alt="Smart farming" />
        </div>
      </div>
    </section>

    <section className="home-benefits">
      <div className="container card-grid">
        {kk.benefits.map((benefit) => (
          <Card key={benefit.title} title={benefit.title}>
            <p>{benefit.description}</p>
          </Card>
        ))}
      </div>
    </section>

    <section id="partners" className="home-partners">
      <div className="container partners-inner">
        <h2>{kk.partners}</h2>
        <div className="partners-strip" aria-label="Серіктестер логотиптері">
          <span>AgroLab</span>
          <span>DigitalFarm</span>
          <span>QazaqAgro</span>
          <span>DroneX</span>
          <span>LoRaNet</span>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
