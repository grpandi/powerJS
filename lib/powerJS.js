
var fs = require('fs');
var JSZip = require('jszip')
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");


const options = {
  ignoreAttributes: false,
  attributeNamePrefix : "@_"
};
const parser = new XMLParser(options);
var zipInput = new JSZip();
// const reader = new FileReader();


class Pjs{  
  
  constructor(){
    this.name='myppt'
  }

  readFile(files){
    fs.readFile(files.filetoupload[0].filepath, function(err, data) {
      console.log(data.buffer)
      zipInput.loadAsync(data).then(function (zip) {
      let prest = ''
       zip.files['ppt/presentation.xml'].async('text').then((txt)=>{
        prest = txt
        let jObj = parser.parse(prest);
        console.log(jObj)
       })
    });
    });    
  }
}
module.exports = Pjs

