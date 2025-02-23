// var fs = require('fs');
// var JSZip = require('jszip')
// var slide = require('./slide')

import jszip from 'jszip'
// import {Slide, SlideOld, Rel} from './slide'
import { Slide, Rel } from './slide'
// import {xmlSrc, Rel} from './core'
import { Shape } from './shape'
import { Fill, Color } from './style'
import {XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser'
import {getbyPath, getNested} from './util'
import { Cn } from './cnv'
import {xml2js, js2xml} from 'xml-js'


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
    private _theme:any = {}
    public themeColors:any = {}
    private _rels = {}
    private _presProps={}
    private _tableStyles={}
    private _viewProp={}
    private _zip!:any;
    private _app={}
    private _core = {}
    private _presentation_xml_rels={}
    private _slideMaster_rels:any={}
    public width=1780
    public height=720
    public cnv:Cn | undefined
    public aspectRatio=1

    // slide = new Slide()
    Slides:{ [key: string]: Slide } = {}
    Masters:{ [key: string]: Slide }= {}
    Layouts: { [key: string]: Slide } = {}
    Themes: { [key: string]: any } = {}

   
    
  private async readFile(files:any){
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
          this.themeColors = getNested(this._theme,'a:theme','a:themeElements','a:clrScheme')

          // convert EMU to inch to pixel considering 96 ppi
          this.width = parseInt(this._presentation['p:presentation']['p:sldSz']['@_cx'])/(914400)*96
          this.height = parseInt(this._presentation['p:presentation']['p:sldSz']['@_cy'])/(914400)*96
          this.aspectRatio = this.width/this.height
          res('ReadFile')

    })
        
  }

 
  async init(files:any){
    return new Promise<String>(async(res, rej)=>{
      this._zip = await zipInput.loadAsync(files)


      // Get Size
      this._presentation = await this._zip.files['ppt/presentation.xml'].async('text').then((txt:string)=>{return(xml2js(txt,{compact:false}));})
      let size:any = getbyPath(this._presentation,'p:presentation/p:sldSz')
      if(size!=null){
        this.width = parseInt(size['attributes']['cx'])/(914400)*96
        this.height = parseInt(size['attributes']['cy'])/(914400)*96
        this.aspectRatio = this.width/this.height
      }
      // this.height = parseInt(this._presentation['p:presentation']['p:sldSz']['@_cy'])/(914400)*96
      // this.aspectRatio = this.width/this.height

      // Read Theme
      for (let f of Object.keys(this._zip.files)){
        if(f.includes('ppt/theme/theme')){
          let fname:any = f.split('/').pop()
          let a = await this._zip.files[f].async('text').then((txt:string)=>{return(xml2js(txt,{compact:false}));})
          this.Themes[fname]=a['elements'][0]
        }
      }
      // Read MasterSlide and rel
        // set slidetype to master
      for (let f of Object.keys(this._zip.files)){
        if(f.includes('ppt/slideMasters/slideMaster')){
          let fname:any = f.split('/').pop()
          // let a = await this._zip.files[f].async('text').then((txt:string)=>{return(xml2js(txt,{compact:false}));})
          let master = new Slide()
          master.width = this.width
          master.height=this.height
          this.Masters[fname]=master
        }
      }
      for (let f of Object.keys(this._zip.files)){
        if(f.includes('ppt/slideMasters/_rels/slideMaster')){
          let fname:any = f.split('/').pop()
          let a = await this._zip.files[f].async('text').then((txt:string)=>{return(xml2js(txt,{compact:false}));})
          let rel = new Rel(a)
          let slide = this.Masters[fname.replace('.rels','')] as Slide
          slide.rel=rel
          // associate master with theme
          let themeRef:any = rel.getByType('theme')
          if(Object.keys(themeRef).length>0){
            themeRef = themeRef[0]['Target'].split('/').pop()
            slide.theme = this.Themes[themeRef]
          }
          // read images
          let imgRef:any = rel.getByType('image')
          if (Object.keys(imgRef).length>0){
            for (let img in imgRef){
              let imgPath = imgRef[img]['Target'].split('/').pop()
              let imgData = await this._zip.files['ppt/media/'+imgPath].async('base64').then((txt:string)=>{return(txt);})
              slide.images[imgRef[img]['Id']]=imgData
            }
          }
        }
      }
        // set Master slideObj
      for (let f of Object.keys(this._zip.files)){
        if(f.includes('ppt/slideMasters/slideMaster')){
          let fname:any = f.split('/').pop()
          let a = await this._zip.files[f].async('text').then((txt:string)=>{return(xml2js(txt,{compact:false}));})
          let slide = this.Masters[fname] as Slide
          slide.obj = a
        }
      }
        
      // Read LayoutSlide and rel
        // set slidetype to layout        
      for (let f of Object.keys(this._zip.files)){
        if(f.includes('ppt/slideLayouts/slideLayout')){
          let fname:any = f.split('/').pop()
          // let a = await this._zip.files[f].async('text').then((txt:string)=>{return(xml2js(txt,{compact:false}));})
          let layout = new Slide()
          layout.width = this.width
          layout.height=this.height
          this.Layouts[fname]=layout
        }
      }
      // set master to layout
      for (let f of Object.keys(this._zip.files)){
        if(f.includes('ppt/slideLayouts/_rels/slideLayout')){
          let fname:any = f.split('/').pop()
          let a = await this._zip.files[f].async('text').then((txt:string)=>{return(xml2js(txt,{compact:false}));})
          let rel = new Rel(a)
          let slide = this.Layouts[fname.replace('.rels','')] as Slide
          slide.rel=rel
          let masterRef:any = rel.getByType('slideMaster')

          // associate layout with master
          if(Object.keys(masterRef).length>0){
            masterRef = masterRef[0]['Target'].split('/').pop()
            slide.master = this.Masters[masterRef]
            slide.theme = slide.master.theme
          }

          // read images
          let imgRef:any = rel.getByType('image')
          if (Object.keys(imgRef).length>0){
            for (let img in imgRef){
              let imgPath = imgRef[img]['Target'].split('/').pop()
              let imgData = await this._zip.files['ppt/media/'+imgPath].async('base64').then((txt:string)=>{return(txt);})
              slide.images[imgRef[img]['Id']]=imgData
            }
          }
          
        }
      }
        // set Layout slideObj
      for (let f of Object.keys(this._zip.files)){
        if(f.includes('ppt/slideLayouts/slideLayout')){
          let fname:any = f.split('/').pop()
          let a = await this._zip.files[f].async('text').then((txt:string)=>{return(xml2js(txt,{compact:false}));})
          let slide = this.Layouts[fname] as Slide
          slide.obj = a
        }
      }

         
      // Read Slide and rel
        // set slidetype to slide
      for (let f of Object.keys(this._zip.files)){
        if(f.includes('ppt/slides/slide')){
          let fname:any = f.split('/').pop()
          // let a = await this._zip.files[f].async('text').then((txt:string)=>{return(xml2js(txt,{compact:false}));})
          let slide = new Slide()
          slide.width = this.width
          slide.height=this.height
          this.Slides[fname]=slide
        }
      }
      // set layout to slide
      for (let f of Object.keys(this._zip.files)){
        if(f.includes('ppt/slides/_rels/slide')){
          let fname:any = f.split('/').pop()
          let a = await this._zip.files[f].async('text').then((txt:string)=>{return(xml2js(txt,{compact:false}));})
          let rel = new Rel(a)
          let slide = this.Slides[fname.replace('.rels','')] as Slide
          slide.rel=rel
          let layoutRef:any = rel.getByType('slideLayout')
          if(Object.keys(layoutRef).length>0){
            layoutRef = layoutRef[0]['Target'].split('/').pop()
            slide.layout = this.Layouts[layoutRef]
            slide.theme = slide.layout.theme
          }
          let imgRef:any = rel.getByType('image')
          if (Object.keys(imgRef).length>0){
            for (let img in imgRef){
              let imgPath = imgRef[img]['Target'].split('/').pop()
              let imgData = await this._zip.files['ppt/media/'+imgPath].async('base64').then((txt:string)=>{return(txt);})
              slide.images[imgRef[img]['Id']]=imgData
            }
          }
          // console.log(slide.getbgObj())
          // console.log(slide.layout?.getbgObj())
          // console.log(slide.layout?.master?.getbgObj())
        }
      }
        // set Slide slideObj
      for (let f of Object.keys(this._zip.files)){
        if(f.includes('ppt/slides/slide')){
          let fname:any = f.split('/').pop()
          let a = await this._zip.files[f].async('text').then((txt:string)=>{return(xml2js(txt,{compact:false}));})
          let slide = this.Slides[fname] as Slide
          console.log(fname)
          slide.obj = a
        }
      }
      
       
        
        

  
        
        


      

      res("Init")
    });
  }

  async zipFolderRead(path:string){
    return new Promise <Object>((res, rej)=>{
      let files = this._zip.folder(path)
      for (let f in files){
        console.log(f)
      }
      for (let f of files){
        console.log(f)
      }
    })
  }

  

  // set canvas, calculate Aspect ratios for ppt and canvas
  set setCanvas(cnv:HTMLCanvasElement) {
    this.cnv = new Cn(cnv);
    this.cnv.aspectRatio=cnv.width/cnv.height

    if(this.aspectRatio>this.cnv.aspectRatio){
      this.cnv.heightOffset=(cnv.height-(cnv.width/this.aspectRatio))/2
      this.cnv.widthRatio=cnv.width/this.width
      this.cnv.heightRatio=(cnv.height-(2*this.cnv.heightOffset))/this.height
    }
    if(this.aspectRatio<this.cnv.aspectRatio){
      this.cnv.widthOffset=(cnv.width-(cnv.height*this.aspectRatio))/2
      this.cnv.heightRatio=cnv.height/this.height
      this.cnv.widthRatio=(cnv.width-(2*this.cnv.widthOffset))/this.width
    }
  }
  // Slide functions

  drawSlide(n:number){
    let slide = this.Slides['slide'+n+'.xml']
    if (this.cnv) {
      this.cnv.slide = slide;
      // this.cnv.drawSlide()
      this.cnv.draw()
    }

  }

}




