import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './header.scss';

export default class Nav extends React.Component{

  render(){
    return(
      <ul className="nav">
        <li className="nav-item">
          <a className="nav-link active" href="#">About</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Contact</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Explorer</a>
        </li>
        <li className="nav-item">
          <span className="account">
            <a className="nav-link disabled" href="#">
              <FaUserCircle />
            </a>
          </span>
        </li>
      </ul>
    );
  }
}