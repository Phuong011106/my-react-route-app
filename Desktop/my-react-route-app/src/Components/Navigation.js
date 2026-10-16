import {Link} from 'react-router-dom';
function Navigation() {
    return (
        <nav>
            <Link to="/">Players</Link>
            {' | '}
            <Link to="/contact">Contact</Link>
        </nav>
    )
}

export default Navigation;