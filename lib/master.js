class Master{

    constructor(slide=0){
        this.slide=slide
        this.objects={}
    }

    getAllSlides(){
        return this.objects
    }
    getSlide(n){
        return this.objects['slideMaster'+n+'.xml']['p:sldMaster']
    }

}

module.exports = Master