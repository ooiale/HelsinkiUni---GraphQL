import { Link } from 'react-router-dom';


const Navbar = () => {
    
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Authors App</a>
        <div>
        <ul className="navbar-nav mr-auto">
            <li className="nav-item ">
                <Link className="nav-link" to={'/Authors'}>Authors</Link>
            </li>
             <li className="nav-item">
                <Link className="nav-link" to={'/Books'}>Books</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to={'/Login'}>Login</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to={'/Recommended'}>Recommended</Link>
            </li>
        </ul>
    </div>
</nav>
    )
}

export default Navbar