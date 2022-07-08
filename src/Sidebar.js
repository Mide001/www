import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Sidebar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTwitter,
    faTelegram,
  } from "@fortawesome/free-brands-svg-icons";
export default props => {
  return (
    <Menu>
      <a className="menu-item" href="/">
        HOME
      </a>
      <a className="menu-item" href="/staking">
        STAKING
      </a>
      <a className="menu-item" href="/incubator">
        INCUBATOR
      </a>
      <a className="menu-item" href="/bridge">
        BRIDGE
      </a>
      <div class="social-container">
      <h3>Social Follow</h3>
      <a href="https://t.me/+FdL-HowJdS43M2Q9"
        className="telegram social">
        <FontAwesomeIcon icon={faTelegram} size="2x" />
      </a>
      <a href="https://twitter.com/Web69Doge" className="twitter social">
        <FontAwesomeIcon icon={faTwitter} size="2x" />
      </a>
    </div>
    </Menu>
    
  );
};