import {xml2js, js2xml} from 'xml-js'




export class xmlSrc{
    xml:string
    jsObj:object
    constructor(xml:string){
        this.xml = xml
        this.jsObj = xml2js(this.xml, {compact:false})
    }
    getSource():String{
        let src = js2xml(this.jsObj)
        return src
    }
    static getbyPath(obj:Object,path:string):Object|null{
        let pathArr = path.split('/');
        let result:any = obj;
        if (!result.hasOwnProperty('elements')) {
            return null;
        }
        for (let i = 0; i < pathArr.length; i++) {
          let element = pathArr[i];
          for (let j = 0; j < result['elements'].length; j++) {          
            if (result[j]['name'] == element) {
            // check if the element is found then assign the result to the element
              result = result[j];
            // if the path is end then send the result
              if(i == pathArr.length-1){
                return result;
              }
            //   if there is no futher element then return null
              if(!result['elements']){
                return null;
              }
              break;
            }
          }
        }
        return null;
    }


}