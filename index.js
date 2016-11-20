// Radius = 1m
// Length = 4m
var visc = 1;
var flowrat = 1;
var temp = 293;

var pen;

var canWid;
var canHigh;

function init(){
  var canWid = window.innerWidth*0.49;
  var canHighwindow.innerHeight;
  var w = window.innerWidth;
  var h = window.innerHeight;
  pen = document.getElementById("diag").getContext("2d");
  canWid = document.getElementById("diag").scrollWidth;
  canHigh = document.getElementById("diag").scrollHeight;
  drawFrame();
}

function drawFrame(){
  pen.strokeStyle = "#111";
  //Top line of pipe
  pen.moveTo(canWid*0.01, canHigh*0.01);
  pen.lineTo(canWid*0.99, canHigh*0.01);
  pen.stroke();
  //Bottom line of pipe
  pen.moveTo(canWid*0.1, canHigh*0.9);
  pen.lineTo(canWid*0.9, canHigh*0.9);
  pen.stroke();
}

// dp1-dp2
function calcPressureDiff(temp, flow){
  let b = 4.458*Math.pow(10, -6);
  let s = 110.4;
  let viscDyn = (b*Math.pow(temp, 3/2))/(temp+s);
  let press = (8*4*viscDyn*flow)/Math.PI;
  return press;
}

// speed of the particle
function vMag(r, visc, press){
  return (press-(press*Math.pow(r, 2)))/(16*visc);
}

// returns theta for the direction of the particle
function vDir(vTurb, vloc){
  if(vTurb > vloc){
    return 0;
  }else{
    throw "lol nope!";
  }
}
