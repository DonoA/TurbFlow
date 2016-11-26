// Radius = 1m
// Length = 4m
// RE is taken as 2000
// density = 1
var pen;
var canWid;
var canHigh;

var particles = [];

var eddies = [];

var debug = {
  eddies : !false,
  turb: !false,
  autoSpawn: !true,
  tick: true
};

function init(){
  canWid = window.innerWidth*0.49;
  canHigh = window.innerHeight*0.5;
  document.getElementById("diag").width = canWid;
  document.getElementById("diag").height = canHigh;
  pen = document.getElementById("diag").getContext("2d");
  addParticle();
  drawFrame();
  setInterval(tick, 10);
  for(let i = 0; i <= 10; i = i+1){
    let rad1 = Math.random()*canHigh*0.07+canHigh*0.07;
    let rad2 = Math.random()*canHigh*0.1+rad1;
    let newEd;
    let valid = true;
    do {
      valid = true;
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

function dist(pos1, pos2){
  return Math.sqrt(Math.pow((pos1.x-pos2.x), 2) + Math.pow((pos1.y-pos2.y), 2));
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
  //Debug eddies
  if(debug.eddies){
    eddies.forEach(function(e){
      pen.fillStyle = "#800080";
      pen.strokeStyle = "#800080";
      pen.beginPath();
      pen.arc(e.pos.x, e.pos.y, e.r2, 0, Math.PI*2, false);
      pen.closePath();
      pen.stroke();
      pen.fill();
      pen.fillStyle = "#000000";
      pen.strokeStyle = "#000000";
      pen.beginPath();
      pen.arc(e.pos.x, e.pos.y, e.r1, 0, Math.PI*2, false);
      pen.closePath();
      pen.stroke();
      pen.fill();
    });
  }
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
  if(!debug.tick){
    drawFrame();
    return;
  }
  particles.forEach(function(e){
    e.pos.x = e.pos.x + e.vec.x;
    e.pos.y = e.pos.y + e.vec.y;
    e.vec = calcVec(e.pos);
  });
  particles = particles.filter(function(e){
    return e.pos.x < canWid*0.9-15;
  });
  if(Math.random() <= 0.05 && debug.autoSpawn){ // 5% chance
    addParticle();
  }
  drawFrame();
  document.getElementById("stemp").innerHTML = temp();
  document.getElementById("sflow").innerHTML = flow();
  document.getElementById("svisc").innerHTML = visc();
  document.getElementById("spress").innerHTML = press();
  document.getElementById("svcrit").innerHTML = vcrit();
  if(vcrit() < vMag(0) || debug.turb){
    document.getElementById("sft").innerHTML = "Turbulent";
  }else{
    document.getElementById("sft").innerHTML = "Laminar";
  }
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
  if(vcrit() > mag && !debug.turb){
    return {
      x: mag,
      y: 0
    };
  }else{

    //This is all that still needs to be done
    for(let i = 0; i < eddies.length; i = i+1){
      let e = eddies[i];
      let dst = dist(pos, e.pos);
      if(dst < e.r1){
        console.log("circ");
        let theta = Math.acos((pos.x-e.pos.x)/dst);
        if(pos.y > e.pos.y){
          theta = (Math.PI*2) - theta;
        }
        console.log(theta/Math.PI);
        debug.tick = false;
        if(theta < Math.PI){
          return {
            x: -mag*Math.sin(theta),
            y: mag*Math.cos(theta)
          };
        }else{
          return {
            x: mag*Math.sin(theta),
            y: -mag*Math.cos(theta)
          };
        }
      }else if(dst < e.r2){
        console.log("push");
        let theta = Math.acos((pos.x-e.pos.x)/dst);
        if(pos.y > e.pos.y){
          theta = (Math.PI*2) - theta;
        }
        console.log(theta/Math.PI);
        // debug.tick = false;
        if(Math.abs(theta-Math.PI) < Math.PI/10 || Math.abs(theta) < Math.PI/10){
          console.log("flat");
          // debug.tick = false;
          return {
            x: -mag*Math.sin(theta),
            y: mag*Math.cos(theta)
          };
        }else{
          console.log("go");
          if(theta < Math.PI){
            return {
              x: -mag*Math.sin(theta),
              y: mag*Math.cos(theta)
            };
          }else{
            return {
              x: mag*Math.sin(theta),
              y: -mag*Math.cos(theta)
            };
          }
        }
      }
    }
    console.log("return");
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
  return 10*visc();
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
