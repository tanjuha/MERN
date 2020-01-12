import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


 export const Navbar = () => {

  const history = useHistory();

  const auth = useContext(AuthContext)

  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history.push('/');
  }

  return (
    <nav>
    <div className="nav-wrapper blue-grey darken-1" style={{padding: '0 2rem'}}>
      <a href="/" className="brand-logo">Cut link</a>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li><NavLink to ="/create"  activeClassName="active-navbar" >Create link</NavLink></li>
        <li><NavLink to ="/links" activeClassName="active-navbar" >Links</NavLink></li>
        <li><a href ="/" onClick={logoutHandler}>Log out</a></li>
      </ul>
    </div>
  </nav>
  )
}