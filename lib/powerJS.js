var fs = require('fs');
var JSZip = require('jszip')
var slide = require('./slide')
var master = require('./master')
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");


// docProps/app.xml,  slide count
// _rels/presentation.xml, relationship id for slides start from rId2 and last 4 is presProps, viewProps, theme1..., tablestyles respectively 
// add or remove slidex.xml
// ppt/presentation.xml, add new slidex.xml with ID
// update [Content_Types].xml


const options = {
  ignoreAttributes: false,
  attributeNamePrefix : "@_"
};
const parser = new XMLParser(options);
const builder = new XMLBuilder(options);
var zipInput = new JSZip();
var zipOutput = new JSZip();

class Pjs{  

  constructor(){
    this.name='myppt'
    this.contentType = {}
    this.presentation ={}
    this.zip={}
    this.slideLayouts = new Map()
    this.slideLayouts_rels = new Map()
    this.slideMasters = new master()
    this.slides =new slide()
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
    this.contentType = await this.zip.files['[Content_Types].xml'].async('text').then((txt)=>{return(parser.parse(txt));})
    this.zip.folder('ppt/slideLayouts').forEach(async (path,file)=>{
      if(!path.includes('rels')){
        let a = await this.zip.files['ppt/slideLayouts/' + path].async('text').then((txt)=>{return(parser.parse(txt));})
        this.slides.layOutObjects[path] = a
      }
     })

     this.zip.folder('ppt/slideLayouts/_rels').forEach(async (path,file)=>{
      if(path.includes('rels')){
        let a = await this.zip.files['ppt/slideLayouts/_rels/' + path].async('text').then((txt)=>{return(parser.parse(txt));})
        this.slides.layOutRelObjects[path] = a
      }
     })
     this.zip.folder('ppt/slides').forEach(async (path,file)=>{
      if(!path.includes('rels')){
        let a = await this.zip.files['ppt/slides/' + path].async('text').then((txt)=>{return(parser.parse(txt));})
        this.slides.objects[path] = a
      }
     })

     this.zip.folder('ppt/slides/_rels').forEach(async (path,file)=>{
      if(path.includes('rels')){
        let a = await this.zip.files['ppt/slides/_rels/' + path].async('text').then((txt)=>{return(parser.parse(txt));})
        this.slides.slideRel[path] = a
      }
     })

     this.zip.folder('ppt/slideMasters').forEach(async (path,file)=>{
      if(!path.includes('rels')){
        let a = await this.zip.files['ppt/slideMasters/' + path].async('text').then((txt)=>{return(parser.parse(txt));})
        this.slides.masterObjects[path] = a
      }
     })

     this.zip.folder('ppt/slideMasters/_rels').forEach(async (path,file)=>{
      if(path.includes('rels')){
        let a = await this.zip.files['ppt/slideMasters/_rels/' + path].async('text').then((txt)=>{return(parser.parse(txt));})
        this.slides.masterRelObjects[path] = a
      }
     })
    
      this.app = await this.zip.files['docProps/app.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.core = await this.zip.files['docProps/core.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.custom = await this.zip.files['docProps/custom.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.thumbnail = await this.zip.files['docProps/thumbnail.jpeg'].async('base64').then((txt)=>{return(txt);})

      this.rels = await this.zip.files['_rels/.rels'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.contentType = await this.zip.files['[Content_Types].xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.presentation = await this.zip.files['ppt/presentation.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.presProps = await this.zip.files['ppt/presProps.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.tableStyles = await this.zip.files['ppt/tableStyles.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.viewProps = await this.zip.files['ppt/viewProps.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.presentation_xml_rels = await this.zip.files['ppt/_rels/presentation.xml.rels'].async('text').then((txt)=>{return(parser.parse(txt));})
      // this.slideMaster = await this.zip.files['ppt/slideMasters/slideMaster1.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.slideMaster_rels = await this.zip.files['ppt/slideMasters/_rels/slideMaster1.xml.rels'].async('text').then((txt)=>{return(parser.parse(txt));})
      this.theme = await this.zip.files['ppt/theme/theme1.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      // return(await this.exportPPT())
  }

  async exportPPT(){
    return new Promise((res, rej)=>{
      // const buffer = Buffer.from( await con.arrayBuffer() );
      // fs.writeFile('exp.pptx', buffer, () => console.log('file saved!') );
      let xmlContent = builder.build(this.contentType );
      zipOutput.file("[Content_Types].xml", xmlContent);

      let _rels= zipOutput.folder("_rels")
      xmlContent =builder.build(this.rels);
      _rels.file(".rels",xmlContent)


      // docProps folder
      let docProps = zipOutput.folder("docProps")
      xmlContent =builder.build(this.app);
      docProps.file("app.xml",xmlContent)
      xmlContent =builder.build(this.core);
      docProps.file("core.xml",xmlContent)
      xmlContent =builder.build(this.custom);
      docProps.file("custom.xml",xmlContent)

      docProps.file("thumbnail.jpeg",this.thumbnail,{base64: true})


      // ppt folder
      let pptF = zipOutput.folder("ppt")
      xmlContent =builder.build(this.presentation);
      pptF.file("presentation.xml",xmlContent)
      xmlContent =builder.build(this.presProps);
      pptF.file("presProps.xml",xmlContent)
      xmlContent =builder.build(this.tableStyles);
      pptF.file("tableStyles.xml",xmlContent)
      xmlContent =builder.build(this.viewProps);
      pptF.file("viewProps.xml",xmlContent)

      // ppt/_rels folder

      let pptF_rels = pptF.folder("_rels")
      xmlContent =builder.build(this.presentation_xml_rels);
      pptF_rels.file("presentation.xml.rels", xmlContent)



      // ppt/slideLayouts
      let pptF_slideLayouts = pptF.folder("slideLayouts")
      for(let lyt in this.slides.layOutObjects){
        xmlContent =builder.build(this.slides.layOutObjects[lyt]);
        pptF_slideLayouts.file(lyt, xmlContent)
      }

      // ppt/slideLayouts/_rels
      let pptF_slideLayouts_rels = pptF_slideLayouts.folder("_rels")
      for(let lyt in this.slides.layOutRelObjects){
        xmlContent =builder.build(this.slides.layOutRelObjects[lyt]);
        pptF_slideLayouts_rels.file(lyt, xmlContent)
      }

      // ppt/slideMasters
      let pptF_slideMasters = pptF.folder("slideMasters")
      for(let lyt in this.slides.masterObjects){
        xmlContent =builder.build(this.slides.masterObjects[lyt]);
        pptF_slideMasters.file(lyt, xmlContent)
      }

      // ppt/slideMasters/_rels
      let pptF_slideMasters_rels = pptF_slideMasters.folder("_rels")
      for(let lyt in this.slides.masterRelObjects){
        xmlContent =builder.build(this.slides.masterRelObjects[lyt]);
        pptF_slideMasters_rels.file(lyt, xmlContent)
      }

      // ppt/slides
      let pptF_slides = pptF.folder("slides")
      for(let lyt in this.slides.objects){
        xmlContent =builder.build(this.slides.objects[lyt]);
        pptF_slides.file(lyt, xmlContent)
      }

      // ppt/slides/_rels
      let pptF_slides_rels = pptF_slides.folder("_rels")
      for(let lyt in this.slides.slideRel){
        xmlContent =builder.build(this.slides.slideRel[lyt]);
        pptF_slides_rels.file(lyt, xmlContent)
      }

      // ppt/theme
      let pptF_theme = pptF.folder("theme")
      xmlContent =builder.build(this.theme);
      pptF_theme.file("theme1.xml", xmlContent)





    zipOutput.generateAsync({type:"blob"})
      .then(async function(content) {
        res(content)
    })


    
    });


  }

  getSize(){
    return this.presentation['p:presentation']['p:sldSz']
  }


}
module.exports = Pjs

