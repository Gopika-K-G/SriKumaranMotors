import '../styles/About.css';

export default function About() {
  return (
    <section className="about-us-section">
      <div className="about-container">

        {/* Row 1 */}
        <div className="about-row">
          <div className="about-image">
            <img src="/images/about1.jpg" alt="Farmer" />
          </div>
          <div className="about-text">
            <h3>25 Years of Experience</h3>
            <h2>Be Healthy & Eat Only Fresh Vegetables Firm</h2>
            <p>
              We bring decades of experience in agricultural machinery sales and service,
              offering reliable products like chaff cutter machines, power tillers, and more.
            </p>
            <button className="about-btn">Discover More</button>
          </div>
        </div>

        {/* Row 2 */}
        <div className="about-row reverse">
          <div className="about-image">
            <img src="/images/about2.jpg" alt="Market" />
          </div>
          <div className="about-text">
            <h3>Serving Farmers Nationwide</h3>
            <h2>Trusted Name in Agro Machinery</h2>
            <p>
              We aim to empower agriculture by ensuring farmers get high-quality tools
              and timely support for efficient fieldwork and higher productivity.
            </p>
            <button className="about-btn">Know More</button>
          </div>
        </div>

      </div>
    </section>
  );
}
