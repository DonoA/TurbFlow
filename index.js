// Radius = 1m
// Length = 4m
// RE is taken as 2000
// density = 1
var pen;
var canWid;
var canHigh;

var particles = [];

var eddies = [];

function init(){
  canWid = window.innerWidth*0.49;
  canHigh = window.innerHeight*0.5;
  document.getElementById("diag").width = canWid;
  document.getElementById("diag").height = canHigh;
  pen = document.getElementById("diag").getContext("2d");
  addParticle();
  drawFrame();
  setInterval(tick, 10);
  for(int i = 0; i <= 10; i++){
    let rad1 = Math.random()*canHigh*0.07+canHigh*0.07;
    let rad2 = Math.random()*canHigh*0.1+rad;
    let newEd;
    do {
      let valid = true;
      newEd = {
        pos:{
          x: Math.random()*canWid*0.7+canWid*0.15,
          y: Math.random()*canHigh*0.7+canHigh*0.15
        },
        r1: rad1,
        r2: rad2,
      };
      eddies.forEach(function(e){
        if(dist(newEd.pos, e.pos) < e.r2+newEd.r2){
          valid = false;
        }
      });
    } while(!valid)
    eddies.push(newEd);
  }
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
  particles.forEach(function(e){
    pen.fillStyle = "#ff0000";
    pen.strokeStyle = "#ff0000";
    pen.beginPath();
    pen.arc(e.pos.x, e.pos.y, 2, 0, Math.PI*2, false);
    pen.closePath();
    pen.stroke();
    pen.fill();
  });
}

function tick(){
  particles.forEach(function(e){
    e.pos.x = e.pos.x + e.vec.x;
    e.pos.y = e.pos.y + e.vec.y;
    e.vec = calcVec(e.pos);
  });
  particles = particles.filter(function(e){
    return e.pos.x < canWid*0.9-15;
  });
  if(Math.random() <= 0.05){ // 1% chance
    addParticle();
  }
  drawFrame();
  document.getElementById("stemp").innerHTML = temp();
  document.getElementById("sflow").innerHTML = flow();
  document.getElementById("svisc").innerHTML = visc();
  document.getElementById("spress").innerHTML = press();
  document.getElementById("svcrit").innerHTML = vcrit();
}

function addParticle(){
  let pos = {
    x: canWid*0.1+15,
    y: Math.random()*canHigh*0.7+canHigh*0.15 // random y cord in the pipe
  };
  particles.push({
    pos: pos,
    vec: calcVec(pos)
  });
}

function calcVec(pos){
  let r = (Math.abs(pos.y-canHigh*0.5))/(canHigh*0.5);
  let mag = vMag(r);
  if(vcrit() > mag){
    return {
      x: mag,
      y: 0
    };
  }else{
    //This is all that still needs to be done
    let handled = false;
    eddies.forEach(function(e){
      let dist = dist(pos, e.pos);

      if(dist < e.r1){
        // circle
        let theta = Math.arcsin(dist/Math.abs(pos.y-e.pos.y));
        if(pos.x > e.pos.x){
          theta = Math.PI - theta;
        }
        return {
          x: -mag*Math.sin(theta),
          y: mag*Math.cos(theta)
        };
      }else if(dist < e.r2){
        // push around
        let theta = Math.arcsin(dist/Math.abs(pos.y-e.pos.y));
        if(pos.x > e.pos.x){
          theta = Math.PI - theta;
        }
        if(theta < Math.PI/10 || theta > Math.PI*(19/10)){
          return {
            x: (-mag*Math.sin(theta))*10,
            y: (mag*Math.cos(theta))/10
          };
        }else{
          return {
            x: -mag*Math.sin(theta),
            y: mag*Math.cos(theta)
          };
        }
      }
    });
    return {
      x: mag,
      y: 0
    };
  }
}

function temp(){
  return 500*(parseInt(document.getElementById("temp").value)/100);
}

function flow(){
  return parseInt(document.getElementById("flow").value)*1000;
}

function visc(){
  return parseInt(document.getElementById("visc").value)/100;
}

function vcrit(){
  return 500*visc();
}

// dp1-dp2
function press(){
  let b = 4.458*Math.pow(10, -6);
  let s = 110.4;
  let viscDyn = (b*Math.pow(temp(), 3/2))/(temp()+s);
  return (8*4*viscDyn*flow())/Math.PI;
}

// speed of the particle
function vMag(r){
  return ((press()-(press()*Math.pow(r, 2)))/(16*visc()));
}

// returns theta for the direction of the particle
function vDir(vloc, pos){

}

function dist(pos1, pos2){
  return Math.sqrt(Math.pow((pos1.x-pos2.x), 2) + Math.pow((pos1.y-pos2.y), 2));
}
