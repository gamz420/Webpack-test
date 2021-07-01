import Post from "@models/Post";
import * as $ from "jquery";
import json from "./assets/json";
import xml from "./assets/data.xml";
import WebpackLogo from "./assets/image";
import "./styles/styles.css";
import "./styles/less.less";
import "./styles/scss.scss";
import "./babel";
import React from "react";
import { render } from "react-dom";

const post = new Post("Webpack title", WebpackLogo);

$("pre").addClass("code").html(post.toString()); // Это jqery

const App = () => (
  <div className="container">
    <h1>Webpack</h1>

    <hr />

    <div className="logo" />

    <hr />

    <pre />

    <hr />

    <div className="box">
      <h2>Less</h2>
    </div>

    <div className="card">
      <h2>Sass</h2>
    </div>
  </div>
);

render(<App />, document.getElementById("app"));

console.log("Post to string", post.toString());

console.log("JSON", json);
console.log("XML", xml);
