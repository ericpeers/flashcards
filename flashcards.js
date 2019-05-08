#!/usr/bin/nodejs
#
# This assumes an MFC 7840 printer
#


const PDFDocument = require('pdfkit');
const fs = require('fs');

const maxNum = 12;
const startNum = 1;

function printPage(strArray, cutLines) {
  var ypos, xpos;
  var i, j;

  ypos = 100;

  //draw a couple of cut lines
  if (cutLines) {
    doc.moveTo(0, 266).lineTo(600,266).dash(5).stroke();
    doc.moveTo(0, 534).lineTo(625,534).dash(5).stroke();
  }

  //write out the multipliers
  for (i=0;i<3;i++) {
    var str = strArray[i];
    var width = doc.widthOfString(str, {lineBreak: false});
    xpos = (625-width) / 2; //center it.
    doc.text(str, xpos, ypos, {lineBreak: false});
    ypos+= 266;
  }

}


var questions = [];
var answers = [];

//scalarize my 2 dimensional table
//not the most efficient algo in the universe
var i, j;
for (i=startNum;i<=maxNum;i++) {
  for (j=startNum;j<=maxNum;j++) {
    questions.push(`${i} X ${j}`);
    answers.push(`${i} X ${j} = ${i*j}`);
  }
}
//push a couple empties onto the array to align to a multiple of 3.
for (i=0;i < (questions.length % 3); i++) {
  questions.push(' ');
  answers.push(' ');
}

var doc = new PDFDocument;
doc.pipe(fs.createWriteStream('fronts.pdf'));
doc
  .font('Times-Bold')
  .fontSize(100);

for (i=0;i<questions.length;i+=3) {
  printPage([questions[i], questions[i+1], questions[i+2]], true);
  if (i+3 < questions.length) doc.addPage()

}
doc.end();

doc = new PDFDocument;
doc.pipe(fs.createWriteStream('backs.pdf'));
doc
  .font('Times-Bold')
  .fontSize(100);

for (i=0;i<answers.length;i+=3) {
  printPage([answers[i], answers[i+1], answers[i+2]], false);
  if (i+3 < answers.length) doc.addPage()
}
doc.end();
