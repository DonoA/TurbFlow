// Radius = 1m
// Length = 4m
var visc = 1;
var flowrat = 1;
var temp = 293;

var pen;
var canWid;
var canHigh;

var particles = [];

function init(){
  canWid = window.innerWidth*0.49;
  canHigh = window.innerHeight*0.5;
  document.getElementById("diag").width = canWid;
  document.getElementById("diag").height = canHigh;
  pen = document.getElementById("diag").getContext("2d");
  drawFrame();
  setInterval(tick(), 10);
}

function drawFrame(){
  pen.fillStyle = "#0000ff";
  pen.strokeStyle = "#111";
  pen.lineWidth=5;
  //Liquid in pipe
  pen.fillRect(canWid*0.1,canHigh*0.1,canWid*0.8,canHigh*0.8);
  //Top line of pipe
  pen.moveTo(canWid*0.1, canHigh*0.1);
  pen.lineTo(canWid*0.9, canHigh*0.1);
  pen.stroke();
  //Bottom line of pipe
  pen.moveTo(canWid*0.1, canHigh*0.9);
  pen.lineTo(canWid*0.9, canHigh*0.9);
  pen.stroke();
  //Draw particles
  pen.fillStyle = "#ff0000";
  pen.strokeStyle = "#ff0000";
  particles.forEach(function(e){
    pen.beginPath();
    pen.arc(e.pos.x, e.pos.y, 2, 0, Math.PI*2);
    pen.fill();
  });
}

function tick(){
  particles.forEach(function(e){
    e.pos.x = e.pos.x + e.vec.x;
    e.pos.y = e.pos.y + e.vec.y;
  });
  particles.filter(function(e){
    return e.pos.x > canWid*0.9;
  });
  if(Math.random() <= 0.01){ // 1% chance
    addParticle();
  }
  drawFrame();
}

function addParticle(){
  particles.push({
    pos: {
      x: canWid*0.1,
      y: Math.random()*canHigh*0.9+canHigh*0.1 // random y cord in the pipe
    },
    vec: calcVec()
  });
}

function calcVec(){
  let mag = vMag(
    1,
    parseInt(document.getElementById("visc").value),
    calcPressureDiff(
      500*(parseInt(document.getElementById("temp").value)/100),
      parseInt(document.getElementById("flow").value)/10
    )
  );
  let dir = vDir(100, mag);
  return {
    x:Math.cos(dir)*mag,
    y:Math.sin(dir)*mag
  };
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
    //This is all that still needs to be done, and debug that is
    throw "lol nope!";
  }
}
