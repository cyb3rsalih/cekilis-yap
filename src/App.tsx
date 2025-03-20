
import { RaffleGenerator } from './components/RaffleGenerator';

function App() {
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand mb-0 h1">Çekiliş Sistemi</span>
        </div>
      </nav>
      <RaffleGenerator />
    </div>
  );
}

export default App;