class Slides{
    // slide sizes are in DXA
    // - 914400 EMUs is 1 inch
    constructor(slide=0){
        this.slide=slide
        this.objects={}
        this.layOutObjects={}
        this.slideRel = {}
    }

    getAllSlides(){
        return this.objects
    }
    getSlide(n){
        return this.objects['slide'+n+'.xml']['p:sld']
    }
    getSlideLayout(n){
        let a =  this.slideRel['slide'+n+'.xml.rels']['Relationships']['Relationship']['@_Target']
        return a.split('/')[2]
    }

}

module.exports = Slides