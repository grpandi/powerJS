// var fs = require('fs');
// var JSZip = require('jszip')
// var slide = require('./slide')

const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
import jszip from 'jszip'
import * as fs from "fs";
import {Slide} from './slides'



const options = {
  ignoreAttributes: false,
  attributeNamePrefix : "@_"
};
const parser = new XMLParser(options);
var zipInput = new jszip();

export class Pjs{ 
    name='myppt'
    private _contentType:any
    private _presentation:any
    private _slideLayouts = {}
    private _slideLayouts_rels= new Map()
    slide = new Slide()
    private _slides_rels = {}
    private _theme = {}
    private _rels = {}
    private _presProps={}
    private _tableStyles={}
    private _viewProp={}
    private _zip!:any;
    private _app={}
    private _core = {}
    private _presentation_xml_rels={}
    private _slideMaster_rels={}


  async readFile(files:any){
    console.log(typeof(files))
    let f = fs.readFileSync(files.filetoupload[0].filepath)
    this._zip = await zipInput.loadAsync(f)
 
    this._zip.folder('ppt/slideLayouts')?.forEach(async (path:string,file:string)=>{
        if(!path.includes('rels')){
            let a = await this._zip.files['ppt/slideLayouts/' + path].async('text').then((txt:string)=>{return(parser.parse(txt));})
            this.slide._layoutObjects.set(path,a)
        }
        })
        console.log(this.slide._layoutObjects)

    

     this._zip.folder('ppt/slideLayouts/_rels').forEach(async (path:string,file:string)=>{
      if(!path.includes('rels')){
        let a = await this._zip.files['ppt/slideLayouts/_rels/' + path].async('text').then((txt:string)=>{return(parser.parse(txt));})
        this._slideLayouts_rels.set(path,a)
      }
     })
     this._zip.folder('ppt/slides').forEach(async (path:string,file:string)=>{
      if(!path.includes('rels')){
        let a = await this._zip.files['ppt/slides/' + path].async('text').then((txt:string)=>{return(parser.parse(txt));})
        this.slide._slideObjects[path] = a
      }
     })
     this._zip.folder('ppt/slideMasters').forEach(async (path:string,file:string)=>{
      if(!path.includes('rels')){
        let a = await this._zip.files['ppt/slideMasters/' + path].async('text').then((txt:string)=>{return(parser.parse(txt));})
        this.slide._masterObjects[path] = a
      }
     })

     this._zip.folder('ppt/slides/_rels').forEach(async (path:string,file:string)=>{
      if(path.includes('rels')){
        let a = await this._zip.files['ppt/slides/_rels/' + path].async('text').then((txt:string)=>{return(parser.parse(txt));})
        this.slide._slideRel[path] = a
      }
     })
    
      this._app = await this._zip.files['docProps/app.xml'].async('text').then((txt:string)=>{return(parser.parse(txt));})
      this._core = await this._zip.files['docProps/core.xml'].async('text').then((txt:string)=>{return(parser.parse(txt));})
      this._rels = await this._zip.files['_rels/.rels'].async('text').then((txt:string)=>{return(parser.parse(txt));})
      this._contentType = await this._zip.files['[Content_Types].xml'].async('text').then((txt:string)=>{return(parser.parse(txt));})
      this._presentation = await this._zip.files['ppt/presentation.xml'].async('text').then((txt:string)=>{return(parser.parse(txt));})
      this._presProps = await this._zip.files['ppt/presProps.xml'].async('text').then((txt:string)=>{return(parser.parse(txt));})
      this._tableStyles = await this._zip.files['ppt/tableStyles.xml'].async('text').then((txt:string)=>{return(parser.parse(txt));})
      this._viewProp = await this._zip.files['ppt/viewProps.xml'].async('text').then((txt:string)=>{return(parser.parse(txt));})
      this._presentation_xml_rels = await this._zip.files['ppt/_rels/presentation.xml.rels'].async('text').then((txt:string)=>{return(parser.parse(txt));})
      // this.slideMaster = await this.zip.files['ppt/slideMasters/slideMaster1.xml'].async('text').then((txt)=>{return(parser.parse(txt));})
      this._slideMaster_rels = await this._zip.files['ppt/slideMasters/_rels/slideMaster1.xml.rels'].async('text').then((txt:string)=>{return(parser.parse(txt));})
      this._theme = await this._zip.files['ppt/theme/theme1.xml'].async('text').then((txt:string)=>{return(parser.parse(txt));})
    
      console.log(this._theme)
  }

  getSize(){
    return this._presentation['p:presentation']['p:sldSz']
  }


}

