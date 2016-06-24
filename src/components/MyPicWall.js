'use strict';
require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDom from 'react-dom';

//图片数组
var imgDatas = require('../data/picData.json');
imgDatas = (function(dataArray){
  for (var i=0,j=dataArray.length;i<j;i++) {
    var imgdata = dataArray[i];
    imgdata['url'] = '../images/'+imgdata.pictureName;
  }
  return dataArray;
})(imgDatas);

/*
 * 获取 0~30° 之间的一个任意正负值
 */
function get30DegRandom() {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}
//照片
var Picture = React.createClass({
  handleClick : function(e){
    e.stopPropagation();
    e.preventDefault();
    this.props.center();

  },
  render:function(){
    var styleObj = {};
    styleObj = this.props.arrange.pos;
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }else{
      //给每个图片一个旋转角度
      ['MozTransform','msTransform','WebkitTransform','transform'].forEach(function(v,i){
        styleObj[v] = 'rotate('+get30DegRandom()+'deg)';
      });

    }

    return(
      <div className="picDiv" style={styleObj} onClick={this.handleClick} center={this.props.center}>
        <img src={this.props.url} alt={this.props.desc}/>
        <span className="img-title">{this.props.title}</span>
      </div>
    )
  }
})


/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}
//墙
var Wall = React.createClass({
  getInitialState : function(){
    return {
      imgRangeObjArray:[]
    };
  },

  //记录每个区域的限制值
  constant : {
    topArea:{
      left:[],
      top:[]
    },
    rightArea:{
      left:[],
      top:[]
    },
    center:{
      left:[],
      top:[]
    }
  },
  //组件加载后为每张图片设置位置信息
  componentDidMount : function(){
    //拿到舞台的大小
    var $stage = ReactDom.findDOMNode(this.refs.stage),
        stageWidth = $stage.scrollWidth || 1000,
        stageHeight = $stage.scrollHeight || 700,
        stageWidth_H = Math.ceil(stageWidth/2),
        stageHeight_H = Math.ceil(stageHeight/2),
        //取一个图片大小
        $pic = ReactDom.findDOMNode(this.refs.img0),
        picWidth = $pic.scrollWidth,
        picHeight = $pic.scrollHeight,
        picWidth_H = Math.ceil(picWidth/2),
        picHeight_H = Math.ceil(picHeight/2);

        //计算每个区域的取值范围
        this.constant.center = {left:stageWidth_H - picWidth_H , top : stageHeight_H- picHeight_H};
        this.constant.topArea = {left:[stageWidth_H - picWidth_H,stageWidth_H - picWidth_H],top:[-picHeight_H,stageHeight_H- picHeight]};
        this.constant.leftArea = {
          left:[
            -picWidth_H,
            stageWidth_H-picWidth_H
          ],
          top:[
            -picHeight_H,
            stageHeight + picHeight_H
          ]
        };
        this.constant.rightArea = {
          left:[
            stageWidth_H + picWidth_H,
            stageWidth + picWidth_H
          ],
          top:[
            -picHeight_H,
            stageHeight + picHeight_H
          ]
        };
        this.reRender(0);
  },
  /*
  *  重新渲染
  */
  reRender : function(centerIndex){
    centerIndex = centerIndex || 0;
    var imgRangeObjArray = this.state.imgRangeObjArray;
    //给每个区域分配图片Index
    var topNum = Math.floor(Math.random() * 2),//0||1个top图片
        topImgIndex = Math.ceil(Math.random() * (imgDatas.length - topNum));//布局上侧的图片的Index

    //center 图片设置
    imgRangeObjArray[centerIndex].pos = this.constant.center;
    imgRangeObjArray[centerIndex].isCenter = true;
    imgRangeObjArray[centerIndex].rotate = 0;

    //top 图片设置
    if(topNum){
      imgRangeObjArray[topImgIndex].pos = {
        left : getRangeRandom(this.constant.topArea.left[0],this.constant.topArea.left[1]),
        top : getRangeRandom(this.constant.topArea.top[0],this.constant.topArea.top[1])
      };
      imgRangeObjArray[topImgIndex].isCenter = false;
      imgRangeObjArray[topImgIndex].rotate = 0;
    }

    //左右图片设置
    for(var i=0,j=imgRangeObjArray.length,k=j/2;i<j;i++){
      if(i== centerIndex){continue;}
      if(i<k){
        imgRangeObjArray[i].pos = {
          left : getRangeRandom(this.constant.leftArea.left[0],this.constant.leftArea.left[1]),
          top : getRangeRandom(this.constant.leftArea.top[0],this.constant.leftArea.top[1])
        };
        imgRangeObjArray[i].isCenter = false;
        imgRangeObjArray[i].rotate = 0;
      }else{
        imgRangeObjArray[i].pos = {
          left : getRangeRandom(this.constant.rightArea.left[0],this.constant.rightArea.left[1]),
          top : getRangeRandom(this.constant.rightArea.top[0],this.constant.rightArea.top[1])
        };
        imgRangeObjArray[i].isCenter = false;
        imgRangeObjArray[i].rotate = 0;
      }
    }
    this.setState({'imgRangeObjArray':imgRangeObjArray});
  },
  center : function(index) {
    return function(){
      this.reRender(index);
    }.bind(this);
  },
  render:function(){console.log('render');
    var pictures = [],
        labels = [],
        self = this;
    imgDatas.forEach(function(v,i){
      if(!this.state.imgRangeObjArray[i]){
        this.state.imgRangeObjArray[i] = {
          pos : {left : 0, right:0},
          rorate : 0,
          isCenter : false,
          isInverse : false
        };
      }
      pictures.push(
        <Picture  center={this.center(i)} arrange={this.state.imgRangeObjArray[i]} className="pic" ref={'img'+i} url={v.url} key ={i.toString()} title={v.title} desc={v.description}></Picture>
      );
      labels.push(
        <label key={i.toString()}></label>
      );
    }.bind(this))
    return (
      <section className="stage" ref="stage">
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
