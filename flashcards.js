#!/usr/bin/nodejs

//
// This assumes an MFC 7840 printer
// assumes a PDF that is 612 wide x 792 long


const PDFDocument = require('pdfkit');
const fs = require('fs');

const maxNum = 12;
const startNum = 1;
const docLength = 612;
const docWidth = 792;

//strArray are 4 (used to be 3) strings to print in a landscape page
//cut lines - should I print cutlines or not?
//flippyHoriz flips the horizontal elements for printing in duplex mode so that they line up
function printPage(strArray, cutLines, flippyHoriz) {
  var ypos, xpos;
  var i, j;

  ypos = 0;
  const vertSlice = docLength / 2;
  const horizSlice = docWidth / 2;
  if (cutLines) {
    doc.moveTo(0, vertSlice).lineTo(docWidth,vertSlice).dash(5).stroke();
    //doc.moveTo(0, vertSlice / 2).lineTo(docWidth,vertSlice / 2).dash(2).stroke();
    doc.moveTo(horizSlice, 0).lineTo(horizSlice, docLength).dash(5).stroke();
  }

  var width = doc.widthOfString(strArray[0], {lineBreak: false, lineGap: 0});
  var height = doc.heightOfString(strArray[0], {lineBreak: false, lineGap: 0});
  height = Math.round(height * 0.66); //approximately 30% of the font is below the baseline for lower case g/q.

  xpos = (horizSlice - width) / 2 + flippyHoriz * horizSlice; //center it
  ypos = (vertSlice - height) / 2;
//  doc.moveTo(0, ypos).lineTo(docWidth, ypos).dash(10).stroke();
//  doc.moveTo(0, ypos+height).lineTo(docWidth, ypos+height).dash(10).stroke();

  doc.text(strArray[0], xpos, ypos, {lineBreak: false, lineGap: 0});

  width = doc.widthOfString(strArray[1], {lineBreak: false, lineGap: 0});
  height = doc.heightOfString(strArray[1], {lineBreak: false, lineGap: 0});
  height = Math.round(height * 0.66); //approximately 30% of the font is below the baseline for lower case g/q.
  xpos = (horizSlice - width) / 2 + !flippyHoriz * horizSlice; //center it
  ypos = (vertSlice - height) / 2;
  doc.text(strArray[1], xpos, ypos, {lineBreak: false});

  width = doc.widthOfString(strArray[2], {lineBreak: false, lineGap: 0});
  height = doc.heightOfString(strArray[2], {lineBreak: false, lineGap: 0});
  height = Math.round(height * 0.66); //approximately 30% of the font is below the baseline for lower case g/q.
  xpos = (horizSlice - width) / 2 + flippyHoriz * horizSlice; //center it
  ypos = (vertSlice - height) / 2 + vertSlice;
  doc.text(strArray[2], xpos, ypos, {lineBreak: false});

  width = doc.widthOfString(strArray[3], {lineBreak: false, lineGap: 0});
  height = doc.heightOfString(strArray[3], {lineBreak: false, lineGap: 0});
  height = Math.round(height * 0.66); //approximately 30% of the font is below the baseline for lower case g/q.
  xpos = (horizSlice - width) / 2 + !flippyHoriz * horizSlice; //center it
  ypos = (vertSlice - height) / 2 + vertSlice;
  doc.text(strArray[3], xpos, ypos, {lineBreak: false});

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
//push a couple empties onto the array to align to a multiple of 4 (2x2).
for (i=0;i < (questions.length % 4); i++) {
  questions.push(' ');
  answers.push(' ');
}

var doc = new PDFDocument({ layout: 'landscape' });

doc.pipe(fs.createWriteStream('fronts.pdf'));
doc
  .font('Times-Bold')
  .fontSize(100);


for (i=0;i<questions.length;i+=4) {
  printPage([questions[i], questions[i+1], questions[i+2], questions[i+3]], true, false);
  if (i+4 < questions.length) doc.addPage()

}
doc.end();

doc = new PDFDocument({ layout: 'landscape' });
doc.pipe(fs.createWriteStream('backs.pdf'));
doc
  .font('Times-Bold')
  .fontSize(60);

for (i=0;i<answers.length;i+=4) {
  printPage([answers[i], answers[i+1], answers[i+2], answers[i+3]], false, true);
  if (i+4 < answers.length) doc.addPage()
}
doc.end();
