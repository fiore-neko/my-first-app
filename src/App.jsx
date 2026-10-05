import './App.css'

function App() {
  return (
    <main className="kawaii-page">
      <div className="sparkles" aria-hidden="true">
        <span className="sparkle s1">✦</span>
        <span className="sparkle s2">♡</span>
        <span className="sparkle s3">★</span>
        <span className="sparkle s4">✧</span>
        <span className="sparkle s5">♡</span>
        <span className="sparkle s6">★</span>
      </div>

      <div className="cloud cloud-left" aria-hidden="true" />
      <div className="cloud cloud-right" aria-hidden="true" />

      <section className="card">
        <div className="mascot" aria-hidden="true">
          <div className="face">
            <span className="cheek left" />
            <span className="cheek right" />
            <span className="eye left" />
            <span className="eye right" />
            <span className="mouth" />
          </div>
          <span className="bow">🎀</span>
        </div>

        <p className="badge"> primera app </p>

        <h1 className="title">
          <span className="line hola">Hola Mundo</span>
          <span className="line nombre">soy Fiore</span>
          <span className="line sub">y es mi primera app</span>
        </h1>

        <p className="footer-text">(｡♥‿♥｡) bienvenida ~</p>
      </section>
    </main>
  )
}

export default App
