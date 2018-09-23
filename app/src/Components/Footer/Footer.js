import React from 'react';
import './footer.scss';

export default class Footer extends React.Component{
  render(){
    return(
      <footer>
        <span className="footer_title">
          <a href="/"><strong>DCoin - </strong><span>A Colorado Community Currency</span></a>
        </span>
        <span className="footer_copyright">&copy; Colorado Community Currency Initiative</span>
      </footer>
    );
  }
}