import React from 'react';
// import logo from '../Resources/logow.png';
import "../css/Header.css";


export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CandidateName: props.CandidateName
    };
  }


  render() {
    return (
      <header role="banner" className="header-container">
        <div className="header-style">
          <div className="banner-text">Calender Based Scheduling System</div>
        </div>
        <div className="navbar-divider"></div>
      </header>

    )
  }
}
