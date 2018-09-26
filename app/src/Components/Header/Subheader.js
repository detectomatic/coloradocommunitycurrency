import React from 'react';
import Nav from './Nav';
import './header.scss';

export default class Subheader extends React.Component{

  render(){
    return(
      <div>
        <div className="subtitle">
          <span>A Colorado Community Currency</span>
        </div>
      </div>
    );
  }
}