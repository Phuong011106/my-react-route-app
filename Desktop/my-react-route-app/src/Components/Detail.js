import { useParams, Link } from 'react-router-dom';
import { data } from '../Shared/ListOfPlayers';

function Detail() {
  const { id } = useParams();

  const player = data.find(
    (item) => String(item.id) === id
  );

  if (!player) {
    return (
      <div className="container">
        <h2>Player not found</h2>
        <Link to="/">Back to Players</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="player-image">
        <span className="player-label">
          {player.name.toUpperCase()}
        </span>

        <img src={player.img} alt={player.name} />
      </div>

      <div className="player-info">
        <h2>{player.club || 'Club not available'}</h2>

        <p className="market-value">
          Market value: € {player.cost.toLocaleString()}
        </p>

        <p>{player.info}</p>

        <Link className="back-link" to="/">
          Back to Players
        </Link>
      </div>
    </div>
  );
}

export default Detail;