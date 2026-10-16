import { Link } from 'react-router-dom';
import { data } from '../Shared/ListOfPlayers';

function Players() {
  return (
        <div className="players">
            {data.map((player) => (
            <div className="player-card" key={player.id}>
                <h3>{player.name}</h3>

                <p>
                Market value: € {player.cost.toLocaleString()}
                </p>

                <Link to={`/detail/${player.id}`}>
                <button>Detail</button>
                </Link>
            </div>
            ))}
        </div>
    );
}

export default Players;
