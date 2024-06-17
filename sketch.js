// https://www.liutaiomottola.com/formulae/freqtab.htm
// https://muted.io/note-frequencies/
// https://www.electricity-magnetism.org/pt-br/captadores-magneticos/

let freqSlider
let ampSlider

let amp=40
let freq=10
let x=0
let mov=0
let vel=0.3
let lineStrenght=0.1
let relatView=5
let selectedString=0
let stringsHeight=[-50, -30, -10, 10, 30, 50]
let stringsSettings=[[262, 5], [262, 5], [262, 5], [262, 5], [262, 5], [262, 5]]
let osc=new p5.Oscillator()
let currentNote="?"
let currentNoteDist=0
let animationTransition=0
let animationTransitionDec=0.01
const notesTable = {
    "16.35": "C",
    "17.32": "C#",
    "18.35": "D",
    "19.45": "D#",
    "20.6": "E",
    "21.83": "F",
    "23.12": "F#",
    "24.5": "G",
    "25.96": "G#",
    "27.5": "A",
    "29.14": "A#",
    "30.87": "B",
}
const T = 0.002

function getNoteFreq(initFreq, oct){
  // let nextFreq=Number(initFreq)
  // for (let i=1; i<oct; i++){
  //   nextFreq*=2
  // }
  // return nextFreq
  
  // 2^oct*initFreq
  
  return initFreq*Math.pow(2, oct-1)
}

function whatOctIs(freq){
  let nextFreq=Number(Object.keys(notesTable)[0])
  let oct=0
  while (nextFreq<Number(freq)){
    oct+=1
    nextFreq*=2
  }
  return oct
}

function processChanges(){
  animationTransition=1
  let x = mouseX
  let y = mouseY-200
  for (let i=0; i<stringsHeight.length; i++){
    let s=stringsHeight[i]
    if (y-10 < s && y+10 > s){
      selectedString=i
      break
    }
  }
  let ss = stringsSettings[selectedString]
  
  try{ osc.oscillator.stop() } catch(e){}
  osc=new p5.Oscillator("sine")
  osc.freq(ss[0])
  osc.amp(ss[1]/12)
  osc.oscillator.start()
  osc.amp(0, 1.5)
    
  // Get the current note
  let oct=whatOctIs(ss[0])
  let closeFreq=9999999
  for (let i=0; i<Object.keys(notesTable).length; i++){
    let freq=Number(Object.keys(notesTable)[i])
    let dist=getNoteFreq(freq, oct)-ss[0]
    //console.log(dist, Math.abs(getNoteFreq(freq, oct)-ss[0]))
    if (Math.abs(dist) < closeFreq){
      closeFreq=Math.abs(dist)
      currentNote=notesTable[freq]
      currentNoteDist=dist
    }
  }
}

function setup() {
  createCanvas(400, 400);
  // starting freq is 3/4 oct to 5/6
  freqSlider=createSlider(getNoteFreq(Object.keys(notesTable)[0], 4), getNoteFreq(Object.keys(notesTable)[0], 7), 0, 0.1)
  ampSlider=createSlider(5, 10, 0)
  
  freqSlider.input(processChanges)
}

function draw() {
  background(240, 240, 220, 100);
  translate(0, 200)
  
  if ((freq != freqSlider.value() && stringsSettings[selectedString][0] != freqSlider.value())){
    stringsSettings[selectedString][0]=freqSlider.value()
  } else if((amp != ampSlider.value() && stringsSettings[selectedString][1] != ampSlider.value())){
    stringsSettings[selectedString][1]=ampSlider.value()
  }
  
  freq=freqSlider.value()
  amp=ampSlider.value()
  
  noStroke()
  textSize(15)
  fill(0)
  text("Freq: "+freq, width/2.5, 20-height/2)
  text("Ampl: "+amp, width/2.5, 40-height/2)
  text(selectedString+1, 200, -100)
  textSize(20)
  text(currentNote, width-70, -150)
  
  // Afinador
  textSize(12)
  text(currentNoteDist.toFixed(2), width-68, -105)
  stroke(0)
  line(width-65-50, -130, width-65+50, -130)
  fill(0)
  circle(width-65, -130, 5)
  stroke(200, 0, 0)
  line(width-65+currentNoteDist, -130-10, width-65+currentNoteDist, -130+10)
  
  stroke(255)
  
  // CAPTADOR SINGLE
  ellipse(width/4, 0, 40, 140)
  
  // CAPTADOR HUMBUCKER
  rect(width/1.5-20, -70, 70, 140)
  // 1
  ellipse(width/1.5, 0, 30, 140)
  // 2
  ellipse(width/1.5+30, 0, 30, 140)
  
  stroke(255)
  fill(255)
  for (let i=0; i<stringsHeight.length; i++){
    circle(width/4, stringsHeight[i], 10)
    circle(width/1.5, stringsHeight[i], 10)
    circle(width/1.5+30, stringsHeight[i], 10)
    if (i != selectedString){
      stroke(50)
      line(0, stringsHeight[i], width, stringsHeight[i]) 
    }
  }
  stroke(0)
  
  x=0
  while (x<width){
    y=sin((x+mov)*stringsSettings[selectedString][0]*T/relatView)*stringsSettings[selectedString][1]*animationTransition+stringsHeight[selectedString]
    stroke(50)
    point(x, y)
    
    x+=lineStrenght
  }
  mov-=vel
  
  if (animationTransition<=0){
    animationTransition=0
  } else{
    animationTransition-=animationTransitionDec
  }
  
}

function mouseReleased(){
  processChanges()
}