"use strict";

import React from "react";
import ReactDOM from "react-dom";
import "./search.less";
import banner from './images/banner.jpg';

class Search extends React.Component {
  render() {
    return (   
      <div className="search-text">Search Text1112223
         <img src={banner} />
      </div>
    );
  }
}

ReactDOM.render(<Search></Search>, document.getElementById("root"));