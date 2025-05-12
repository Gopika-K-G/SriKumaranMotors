import '../styles/About.css';

export default function About() {
  return (
    <section className="about-us-section">
      <div className="about-container">

        {/* Row 1 */}
        <div className="about-row">
          <div className="about-image">
            <img src="https://media.licdn.com/dms/image/v2/D5612AQGEKC-BBM01qQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1702025016970?e=2147483647&v=beta&t=cyh7OdO-hDr5rJYw2XO8AOd2O5HrcVjBPTyadn9Lyi8" alt="Farmer" />
          </div>
          <div className="about-text">
            <h3>8 Years of Experience</h3>
            <h2>Agro-Focused & Empowering</h2>
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
            <img src="https://media.istockphoto.com/id/1501984364/photo/farmer-examining-sunflower-seedlings-at-sunset.jpg?s=612x612&w=0&k=20&c=iZqmk44MP8u1KyA3h_U1G-0lm7anA1DEll-wr8d_7Ps=" alt="Market" />
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
