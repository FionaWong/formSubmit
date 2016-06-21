'use strict';
require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//图片数组
var imgDatas = require('../data/picData.json');
imgDatas = (function(dataArray){
  for (var i=0,j=dataArray.length;i<j;i++) {
    var imgdata = dataArray[i];
    imgdata['url'] = '../images/'+imgdata.title;
  }
  return dataArray;
})(imgDatas);
//墙
var Wall = React.createClass({
  render:function(){
    var pictures = [],
        labels = [];
    imgDatas.forEach(function(v,i){
      pictures.push(
        <picture className="pic" index ={i.toString()} title={v.title} desc={v.description} url={v.url}></picture>
      );
      labels.push(
        <label index={i.toString()}></label>
      );
    })
    return (
      <section className="stage">
        <section className="wall">
          {pictures}
        </section>
        <nav className="label">
          {labels}
        </nav>
      </section>
    )
  }
});
module.exports = Wall;
