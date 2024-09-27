
var fs = require('fs');
var JSZip = require('jszip')
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");


const options = {
  ignoreAttributes: false,
  attributeNamePrefix : "@_"
};
const parser = new XMLParser(options);
var zipInput = new JSZip();

class Pjs{  

  constructor(){
    this.name='myppt'
    this.contentType = {}
    this.presentation ={}
    this.zip={}
    this.slideLayouts = new Map()
    this.slideLayouts_rels = new Map()
    this.slideMaster = {}
    this.slides =new Map()
    this.slides_rels = new Map()
    this.theme={}
    this.rels={}
    this.presProps={}
    this.tableStyles={}
    this.viewProps={}

  }

  async readFile(files){
    let f = fs.readFileSync(files.filetoupload[0].filepath)
    this.zip = await zipInput.loadAsync(f)

    this.zip.folder('ppt/slideLayouts').forEach(async (path,file)=>{
      if(!path.includes('rels')){
        let a = await this.zip.files['ppt/slideLayouts/' + path].async('text').then((txt)=>{return(parser.parse(txt));})
        this.slideLayouts.set(path,a)
      }
     })

     this.zip.folder('ppt/slideLayouts/_rels').forEach(async (path,file)=>{
      if(!path.includes('rels')){
        let a = await this.zip.files['ppt/slideLayouts/_rels' + path].async('text').then((txt)=>{return(parser.parse(txt));})
        this.slideLayouts_rels.set(path,a)
      }
     })
     this.zip.folder('ppt/slides').forEach(async (path,file)=>{
      if(!path.includes('rels')){
        let a = await this.zip.files['ppt/slides/' + path].async('text').then((txt)=>{return(parser.parse(txt));})
        this.slides.set(path,a)
      }
     })

     this.zip.folder('ppt/slides/_rels').forEach(async (path,file)=>{
      if(!path.includes('rels')){
        let a = await this.zip.files['ppt/slides/_rels' + path].async('text').then((txt)=>{return(parser.parse(txt));})
        this.slides_rels.set(path,a)
      }
     })
    
      this.app = await this.zip.files['docProps/app.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.core = await this.zip.files['docProps/core.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.custom = await this.zip.files['custom.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.rels = await this.zip.files['_rels/.rels.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.contentType = await this.zip.files['[Content_Types].xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.presentation = await this.zip.files['ppt/presentation.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.presProps = await this.zip.files['ppt/presProps.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.tableStyles = await this.zip.files['ppt/tableStyles.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.viewProps = await this.zip.files['ppt/viewProps.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.presentation_xml_rels = await this.zip.files['ppt/_rels/presentation.xml.rels'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.slideMaster = await this.zip.files['ppt/slideMasters/slideMaster1.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.slideMaster_rels = await this.zip.files['ppt/slideMasters/_rels/slideMaster1.xml.rels'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.theme = await this.zip.files['ppt/theme/theme1.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
    
  }

}
module.exports = Pjs

