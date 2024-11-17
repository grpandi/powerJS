// var fs = require('fs');
// var JSZip = require('jszip')
// var slide = require('./slide')

import jszip from 'jszip'
import {Slide, Slides} from './slide'
import {XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser'
import {getNested, Bg, Color} from './util'
import { BGProps } from './interface'


export const myPromise = new Promise<number>((resolve, reject) => {
  resolve(0)
});



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
    private _slides:any = {}
    private _slideLayouts:any = {}
    private _slideMasters:any = {}
    private _slideLayouts_rels:any= {}
    private _slides_rels:any = {}
    slide = new Slide()
    private _theme:any = {}
    private _rels = {}
    private _presProps={}
    private _tableStyles={}
    private _viewProp={}
    private _zip!:any;
    private _app={}
    private _core = {}
    private _presentation_xml_rels={}
    private _slideMaster_rels:any={}

    
  async readFile(files:any){
    return new Promise <string> (async (res, rej)=>{
      this._zip = await zipInput.loadAsync(files)


        this._zip.folder('ppt/slideLayouts')?.forEach(async (path:string,file:any)=>{
            if(!path.includes('rels')){
                let a = await this._zip.files['ppt/slideLayouts/' + path].async('text').then((txt:string)=>{return(parser.parse(txt));})
                this._slideLayouts[path]=a
            }
        })
        
    
        this._zip.folder('ppt/slideLayouts/_rels').forEach(async (path:string,file:string)=>{
        if(path.includes('rels')){
          let a = await this._zip.files['ppt/slideLayouts/_rels/' + path].async('text').then((txt:string)=>{return(parser.parse(txt));})
          this._slideLayouts_rels[path]=a
        }
        })
        this._zip.folder('ppt/slides').forEach(async (path:string,file:string)=>{
        if(!path.includes('rels')){
          let a = await this._zip.files['ppt/slides/' + path].async('text').then((txt:string)=>{return(parser.parse(txt));})
          this._slides[path]=a
        }
        })
         this._zip.folder('ppt/slides/_rels').forEach(async (path:string,file:string)=>{
          if(path.includes('rels')){
            let a = await this._zip.files['ppt/slides/_rels/' + path].async('text').then((txt:string)=>{return(parser.parse(txt));})
            this._slides_rels[path] = a
          }
         })

         this._zip.folder('ppt/slideMasters').forEach(async (path:string,file:string)=>{
          if(!path.includes('rels')){
            let a = await this._zip.files['ppt/slideMasters/' + path].async('text').then((txt:string)=>{return(parser.parse(txt));})
            this._slideMasters[path] = a
          }
         })

         this._zip.folder('ppt/slideMasters/_rels/').forEach(async (path:string,file:string)=>{
          if(path.includes('rels')){
            let a = await this._zip.files['ppt/slideMasters/_rels/' + path].async('text').then((txt:string)=>{return(parser.parse(txt));})
            this._slideMaster_rels[path] = a
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
          // this._slideMaster_rels = await this._zip.files['ppt/slideMasters/_rels/slideMaster1.xml.rels'].async('text').then((txt:string)=>{return(parser.parse(txt));})
          this._theme = await this._zip.files['ppt/theme/theme1.xml'].async('text').then((txt:string)=>{return(parser.parse(txt));})

          res('ReadFile')

    })
        
  }

  getSize(){
    return this._presentation['p:presentation']['p:sldSz']
  }



  // Slide functions

  getSlideBG(n:number){
    // 1. get bg object from slide or slide layout or slide master
    let slideObj = getNested(this._slides,'slide'+n+'.xml')
    let bg:BGProps = getNested(slideObj,'p:sld','p:cSld','p:bg')
    let clrMap:any
    if(typeof(bg)=='undefined'){
      let layoutName = this.slide.getSlideLayoutName(this._slides_rels,n)
      let slideLayout = this._slideLayouts[layoutName]
      bg = getNested(slideLayout,'p:sldLayout','p:cSld','p:bg')
    }
    if(typeof(bg)=='undefined'){
      let masterName = this.slide.getMasterLayoutName(this._slideLayouts_rels,n)
      let slideMaster = this._slideMasters[masterName]
      // console.log(slideMaster)
      bg = getNested(slideMaster,'p:sldMaster','p:cSld','p:bg')
      clrMap = getNested(slideMaster,'p:sldMaster','p:clrMap')
    }
    let bgVal = new Bg(bg)

    // get color from theme if it is scheme color
    if(bgVal.type =='theme'){
      let themeClr = getNested(this._theme,'a:theme','a:themeElements','a:clrScheme','a:'+clrMap['@_'+bgVal.val])
      let clr = new Color(themeClr)
      bgVal.val = clr.getColor()
    }
    return {type: bgVal.type, val:bgVal.val}   
}

}




