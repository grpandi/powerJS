class Slides{
    // slide sizes are in DXA
    // - 914400 EMUs is 1 inch
    constructor(slide=0){
        this.slide=slide
        this.objects={}
        this.layOutObjects={}
    }

    getAllSlides(){
        return this.objects
    }
    getSlide(n){
        return this.objects['slide'+n+'.xml']['p:sld']
    }
    getSlideLayout(n){
        // read related slidelaout
        // read slideLayout
        // get related Master (bgColor)
    }

}

module.exports = Slides