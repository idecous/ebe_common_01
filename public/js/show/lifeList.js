var EBE_NormalFilter = function(){
    var groupBtnsEl = $(".common_mainPanel .filterPanel .groupBar");
    var groupBtnsIconEl = groupBtnsEl.children("i");
    var contentBlockEl = $(".common_mainPanel .filterPanel .groupBar+ul");
    groupBtnsEl.click(function(){
        var tIndex = groupBtnsEl.index(this);
        var iconEl = groupBtnsIconEl.eq(tIndex);
        if( iconEl.hasClass("close") ){
            contentBlockEl.eq(tIndex).removeClass("close");
            iconEl.removeClass("close");
        }else{
            contentBlockEl.eq(tIndex).addClass("close");
            iconEl.addClass("close");
        }
    });
    var categoryGroupBtnsEl = $(".common_mainPanel .filterPanel .byCategory .groupRow" );
    var categoryGroupBtnsIconEl = categoryGroupBtnsEl.children("i");
    categoryGroupBtnsIconEl.mousedown(function(){
        var tIndex = categoryGroupBtnsIconEl.index(this);
        var groupEl = categoryGroupBtnsEl.eq(tIndex);
        groupEl.parent("li").toggleClass("close");
        return false;
    });
};

var EBE_PriceFilter = function(currency,minPrice,maxPrice,currentMinPrice,currentMaxPrice){
    var numcheck = /\d|\./;
    var numInputEl = $(".common_mainPanel .filterPanel .byPrice input:text");
    var minCurrentPrice = currentMinPrice;
    var maxCurrentPrice = currentMaxPrice;

    var formEl = $(".common_mainPanel .filterPanel .byPrice form");
    var slider = new EBE_PriceFilterSlider(updateBySlider,function(){
        formEl.submit();
    });
    var labelGroupEl = $(".filterPanel .byPrice .labelGroup");
    var spanEl01 = $("<span class='minPrice'>"+currency+currentMinPrice+"</span>").appendTo(labelGroupEl).text(minPrice.toFixed(2));
    var spanEl02 = $("<span class='maxPrice'>"+currency+currentMaxPrice+"</span>").appendTo(labelGroupEl).text(maxPrice.toFixed(2));

    function updateBySlider(minPre,maxPre){
        minCurrentPrice = parseFloat((minPrice +  (maxPrice-minPrice)*minPre).toFixed(2));
        maxCurrentPrice = parseFloat( (minPrice +  (maxPrice-minPrice)*maxPre).toFixed(2) );
        numInputEl.eq(0).val( minCurrentPrice.toFixed(2) );
        numInputEl.eq(1).val( maxCurrentPrice.toFixed(2) );
    }
    numInputEl.eq(0).val(minCurrentPrice.toFixed(2));
    numInputEl.eq(1).val(maxCurrentPrice.toFixed(2));
    slider.updateByInput(  (minCurrentPrice-minPrice)/(maxPrice-minPrice) ,(maxCurrentPrice-minPrice)/(maxPrice-minPrice) );
    numInputEl.keypress(function(e){
        var keynum;
        if(window.event){
            keynum = e.keyCode;
        }else if(e.which){
            keynum = e.which;
        }
        if(keynum==8){
            return true;
        }
        var keychar = String.fromCharCode(keynum);
        return numcheck.test(keychar);
    }).blur(function(){
        var inputIndex = numInputEl.index(this);
        var el = numInputEl.eq(  inputIndex );
        var val = parseFloat( el.val() );
        if( inputIndex == 0 ){
            if( isNaN(val) ||  val < minPrice){
                val = minPrice;
            }else if(  val > maxCurrentPrice ){
                val = maxCurrentPrice;
            }
            minCurrentPrice = val;
        }else{
            if( isNaN(val) ||  val > maxPrice){
                val = maxPrice;
            }else if( val < minCurrentPrice ){
                val  = minCurrentPrice;
            }
            maxCurrentPrice = val;
        }
        el.val( val.toFixed(2) );
        slider.updateByInput(  (minCurrentPrice-minPrice)/(maxPrice-minPrice) ,(maxCurrentPrice-minPrice)/(maxPrice-minPrice) );
    })

};
var EBE_PriceFilterSlider = function(updateBySlider,dragCompleteFn){
    var thumbWidth = 16;
    var el = $(".byPrice .slider");
    $("<div class='bg'></div>").appendTo(el);
    var trackEl = $("<div class='track'></div>").appendTo(el);

    var sliderWidth = el.width();
    var minPoint =  new EBE_PriceFilterSliderPoint(el,sliderWidth ,true,getMaxPointPos,pointUpdateTrack ,dragCompleteFn);
    var maxPoint = new EBE_PriceFilterSliderPoint(el, sliderWidth ,false ,getMinPointPos,pointUpdateTrack,dragCompleteFn);

    function getMaxPointPos(){
        return maxPoint.getPosition();
    }
    function getMinPointPos(){
        return minPoint.getPosition();
    }
    function pointUpdateTrack(byInput){
        var minPos = getMinPointPos();
        var maxPos = getMaxPointPos();
        trackEl.css({
            "left":minPos+ thumbWidth/2,
            "width":(maxPos-minPos)
        });
        if(!byInput){
            updateBySlider( (minPos+thumbWidth)/(sliderWidth-thumbWidth*2) - thumbWidth/(sliderWidth-thumbWidth*2) ,
                maxPos/(sliderWidth-thumbWidth*2)- thumbWidth/(sliderWidth-thumbWidth*2) );
        }
    }
    pointUpdateTrack(true);

    function updateByInput(minPre,maxPre){
        minPoint.setPosition(minPre);
        maxPoint.setPosition(maxPre);
        pointUpdateTrack(true);
    }
    return{"updateByInput":updateByInput};
};
var EBE_PriceFilterSliderPoint = function(owner,sliderWidth,isMin,getOtherPosition,updateTrack,dragCompleteFn){
    var documentEl = $(document);
    var thumbWidth = 16;
    var el = $("<a href='javascript:;'></a>").appendTo(owner);
    el.css("left",isMin?0: sliderWidth - thumbWidth );

    var extraPos,startPos,elOffset;
    el.mousedown(function(e){
        extraPos = e.pageX - el.offset().left;
        startPos =  e.pageX ;
        elOffset = getPosition();
        if (window.captureEvents) {
            window.addEventListener(Event.MOUSEMOVE, null, true);
            window.addEventListener(Event.MOUSEUP, null, true);
        } else if (el[0].setCapture) {
            el[0].setCapture();
        }
        documentEl.bind("mousemove", function(e){
            var tX = e.pageX - startPos + elOffset;
            if( tX < 0  ){
                tX = 0;
            }
            if( tX > sliderWidth-thumbWidth){
                tX = sliderWidth-thumbWidth;
            }
            var otherPointPosition = getOtherPosition();
            if( isMin ){
                if( tX+thumbWidth > otherPointPosition){
                    tX = otherPointPosition-thumbWidth;
                }
            }else{
                if( tX < otherPointPosition+thumbWidth){
                    tX = otherPointPosition+thumbWidth;
                }
            }
            el.css("left",tX);
            updateTrack();
        });
        documentEl.bind("mouseup", function(){
            if (window.releaseEvents) {
                window.removeEventListener(Event.MOUSEMOVE, null, true);
                window.removeEventListener(Event.MOUSEUP, null, true);
            } else if (el[0].releaseCapture) {
                el[0].releaseCapture();
            }
            documentEl.unbind();
            dragCompleteFn();
        });
        return false;
    });

    function getPosition(){
        return parseFloat( el.css("left") );
    }
    function setPosition(pre){
        if(isMin){
            el.css("left", pre*(sliderWidth-thumbWidth*2)  );
        }else{
            el.css("left", pre*(sliderWidth-thumbWidth*2) + thumbWidth  );
        }
    }
    return {"getPosition":getPosition,
            "setPosition":setPosition
    }
};

var EBE_SideSearchManager = function(){
    var formEl = $(".common_mainPanel .filterPanel .bySearch li form");
    var borderEl = formEl.find(".border");
    var inputEl = formEl.find("input[type=text]");
    var infoEl =  formEl.find(".border span");
    function updateInfoHandler(){
        var val = $.trim( inputEl.val() );
        if( val == ""){
            infoEl.show();
        }else{
            infoEl.hide();
        }
    }
    inputEl.focus(function(){
        infoEl.hide();
    }).blur(updateInfoHandler);
    formEl.submit(function(){
        if( $.trim( inputEl.val() ) == ""){
            borderEl.addClass("warn");
            return false;
        }else{
            borderEl.removeClass("warn");
        }
    });
    updateInfoHandler();
};
var EBE_MobileFilter = function(){
    var mobileFilterBgEl = $("<div class='mobileFilterBg'></div>").appendTo( $(".common_mainPanel .listPanel") ).hide();
    var mobileFilterPopEl= $("<div class='mobileFilterPop'></div>").appendTo( $(".common_mainPanel .listPanel") ).hide();
    var brandEl = $(".mobileFilter .brandPop").appendTo( mobileFilterPopEl ).hide();
    var colorEl = $(".mobileFilter .colorPop").appendTo( mobileFilterPopEl ).hide();
    var priceEl = $(".mobileFilter .pricePop").appendTo( mobileFilterPopEl ).hide();
    var numInputEl = priceEl.find("input:text");
    var popEls = [brandEl,colorEl,priceEl];
    var numcheck = /\d|\./;
    var isPop = false;
    var popIndex = -1;
    var navBtnEls = $(".mobileFilter li>a");
    function close(){
        for(var i=0; i < popEls.length;i++){
            popEls[i].hide();
        }
        mobileFilterBgEl.hide();
        mobileFilterPopEl.hide();
        popIndex = -1;
    }
    navBtnEls.click(function(){
        var index = navBtnEls.index(this);
        if( index == popIndex ){
            close();
            return;
        }
        mobileFilterBgEl.show();
        mobileFilterPopEl.show();
        if( popIndex != -1 ){
            popEls[popIndex].hide();
        }
        popIndex = index;
        popEls[popIndex].show();
    });
    mobileFilterBgEl.click(function(){
        close();
    });
    numInputEl.keypress(function(e){
        var keynum;
        if(window.event){
            keynum = e.keyCode;
        }else if(e.which){
            keynum = e.which;
        }
        if(keynum==8){
            return true;
        }
        var keychar = String.fromCharCode(keynum);
        return numcheck.test(keychar);
    }).blur(function(){
        var el = numInputEl.eq( numInputEl.index(this) );
        var val = parseFloat( el.val() );
        if( isNaN(val) ||  val < 1){
            val = 0;
        }else if( val > 99999 ){
            val = 99999;
        }
        el.val( val.toFixed(2) );
    });
};

var EBE_ListItem = function(submitHandler,errorHandler,unit,bgUrl,label01,label02,ignorePrice){
    this.submitHandler = submitHandler;
    this.errorHandler = errorHandler;
    this.unit = unit;
    this.sizeIndex = -1;
    this.bgUrl = bgUrl;
    this.label01 = label01;
    this.label02 = label02;
    this.ignorePrice = ignorePrice;
    this.canShopping = true;
};
(function(){
    this.init = function(){
        var that = this;
        if( this.sizeEl.length ==0){
            this.el.find(".submitRow").css("bottom",34);
        }
        this.sizeEl.click(function(){
            var index = that.sizeEl.index( this );
            if( index == that.sizeIndex ){return;}
            if( that.sizeIndex != -1 ){
                that.sizeEl.eq(that.sizeIndex).removeClass("checked");
            }
            that.sizeIndex = index;
            that.sizeEl.eq(index).addClass("checked");
            return false;
        });
        this.submitBtnEl.click(function(){
            if( that.sizeEl.length > 0 && that.sizeIndex == -1 ){
                that.errorHandler();
                return false;
            }
            that.submitHandler( that.id, that.sizeEl.eq(that.sizeIndex).text() , that.sizeEl.eq(that.sizeIndex).attr("iid")  );
            return false;
        });
    };
    this.buildWithEl = function(el){
        this.id = el.attr("iid");
        this.el = el;
        this.imgEl = el.find(".imgBlock>img");
        this.sizeEl = el.find(".size>span");

        var i,remaining,tStr = "";
        remaining = 4 - this.sizeEl.length%4;
        if(remaining == 4){
            remaining = 0;
        }
        for( i=0; i < remaining ;i++){
            tStr += "\n<i>i</i>";
        }
        tStr += "<div class='common_justifyFix'></div>";
        $(tStr).appendTo( el.find(".size") );
        this.submitBtnEl = el.find("input:button");
        this.enNameEl = el.find("h3");
        this.cnNameEl = el.find("h2");
        this.unitEl = el.find(".price>h1>i,.price>span>i");
        this.realPriceEl = el.find(".price>h1>b");

        if( this.ignorePrice[this.realPriceEl.text()] ){
            this.el.find(".shoppingcar").hide();
        }
        this.otherPriceEl = el.find(".price>span>b");
        this.init();
    };
    this.buildWithData = function(data){
        this.id = data.id;
        this.el = $("<li iid='"+ data.id +"'></li>");
        var aEl = $("<a  class='contentBlock' href='"+ data.url +"'></a>").appendTo(this.el);
        tEl01 = $("<div class='imgBlock'></div>").appendTo( aEl );
        $("<img class='bg' src='"+this.bgUrl+"'/>").appendTo(tEl01);

        this.imgEl = $("<img src='"+ data.imgUrl +"'/>").appendTo(tEl01);
        var tEl02 = $("<div class='shoppingcar'></div>").appendTo( tEl01 );
        var tEl03 = $("<div class='size'></div>").appendTo( tEl02 );
        var i,remaining,tStr = "";
        for( i=0; i < data.sizes.length;i++){
            tStr += "<span iid='"+  data.sizesID[i] +"'>"+ data.sizes[i]+"</span>\n";
        }
        remaining = 4 - data.sizes.length%4;
        if(remaining == 4){
            remaining = 0;
        }
        for( i=0; i < remaining ;i++){
            tStr += "<i>i</i>\n";
        }
        tStr += "<div class='common_justifyFix'></div>";
        tEl03.html(tStr);
        this.sizeEl = tEl03.find("span");
        tEl03 = $("<div class='submitRow'></div>").appendTo(tEl02);
        this.submitBtnEl = $("<input type='button' value='"+this.label01+"'/>").appendTo(tEl03);

        var descriptBlockEl = $("<div class='descriptBlock'></div>").appendTo(aEl);
        $("<h3 class='enFontFamily'>"+ data.enName+"</h3>").appendTo(descriptBlockEl);
        $("<h2>"+ data.cnName+"</h2>").appendTo(descriptBlockEl);
        var priceBlockEl = $("<div class='price'></div>").appendTo(descriptBlockEl);

        $("<h1 class='enFontFamily'><b>"+
        data.realPrice + "</b></h1><span>"+this.label02+"<b>"+
        data.otherPrice + "</b></span>").appendTo( priceBlockEl );

        if( this.ignorePrice[ data.realPrice ] ){
            tEl02.hide();
        }
        this.init();
    };
}).call(EBE_ListItem.prototype);

var EBE_List = function(submitHandler,errorHandler,unit,bgUrl,label01,label02,ignorePrice){
    this.submitHandler = submitHandler;
    this.errorHandler = errorHandler;
    this.unit = unit;
    this.totalPage = window.totalPage?window.totalPage:0;
    this.page = 0;
    this.isLoading = false;
    this.bgUrl = bgUrl;
    this.label01 = label01;
    this.label02 = label02;
    this.ignorePrice = ignorePrice;
    this.init();
};
(function(){
    this.init = function(){
        this.build();
        if( this.totalPage > 1){
            this.winEl.resize( $.proxy( this.scroll7ResizeHandler,this) );
            this.winEl.scroll( $.proxy( this.scroll7ResizeHandler,this) );
        }
    };
    this.appendData = function(data,page){
        var i,item;
        for( i=0; i < data.length ;i++){
            item = new EBE_ListItem(this.submitHandler ,this.errorHandler,this.unit,this.bgUrl,this.label01,this.label02,this.ignorePrice);
            item.buildWithData( data[i] );
            this.el.append( item.el );
        }
        this.page = page;
        this.setIsLoading(false);
    };
    this.scroll7ResizeHandler = function(){
        if( this.isLoading || this.page == this.totalPage){return;}
        var offsetTop = this.el.offset().top;
        var scrollTop = this.winEl.scrollTop();
        var viewHeigth = this.winEl.height();
        var bottom = this.loadingEl.offset().top;

        if( scrollTop + viewHeigth > bottom + 50){
            this.setIsLoading( true );
            this.loadPageHandler( this.page + 1 );
        }
    };
    this.setIsLoading = function(val){
        this.isLoading = val;
        this.loadingEl.css("visibility",val?"visible":"hidden");
    };
    this.setLoadPageHandler = function( fn){
        this.loadPageHandler = fn;
    };
    this.build = function(){
        this.el = $(".common_mainPanel .listPanel>ul");
        this.loadingEl = $(".common_mainPanel .listPanel .loadingRow");
        this.winEl = $(window);
        var i,item,existItemEls =  this.el.find("li");
        for( i = 0; i < existItemEls.length ;i++){
            item = new EBE_ListItem( this.submitHandler ,this.errorHandler,this.unit);
            item.buildWithEl( existItemEls.eq(i) );
        }
    };
}).call(EBE_List.prototype);

$(function(){
    var imgs = ["l_001.jpg","l_002.jpg"];
    var countID = 10;
    var page = 1;
    function getPageData( size ){
        var i,arr=[];
        for( i=0; i < size ;i++ ){
            arr.push({
                id:"g_" + countID,
                url:"#",
                imgUrl:"public/source/show/life_list/" + imgs[ countID%2 ],
                sizes:["QUEEN","M","L","QUEEN","M","QUEEN","M","L","QUEEN","M","QUEEN","M","L","QUEEN"],
                sizesID:["S_0_"+countID,"S_1_"+countID,"S_2_"+countID],
                enName:"eve by eve`s" + countID,
                cnName:"绿野仙踪组连体泳--------------------衣" + countID,
                realPrice:"call_for_pricing",
                otherPrice:"1500.00"
            });
            countID++;
        }
        return arr;
    }
    //------
    if(!G_enable){return;}
    new EBE_NormalFilter();
    new EBE_PriceFilter("¥",minPrice,maxPrice,currentMinPrice,currentMaxPrice);
    new EBE_SideSearchManager();
    new EBE_MobileFilter();

    var list = new EBE_List(function(id,size,sizeID){
        console.log("添加到购物车(商品ID/尺寸/尺寸ID)",id,size,sizeID);
        //请求服务器
        G_shoppingCar.addGoods({
            id:"sc_02",
            imgUrl:"public/source/show/shoppingcar_001.jpg",
            name:"xxxxxx",
            size:"尺码:L",
            price:"call_for_pricing",
            num:"数量:1"
        });
    },function(){
        alert("请选择尺寸");
    },"RMB","public/img/show/holder_280_409.png","加入购物车","市场价：",{"call_for_pricing":true,"coming_soon":true});


    list.setLoadPageHandler(function(page){
        console.log("读取页面数据(页数)",page);
        //请求服务器
        list.appendData( getPageData(9) , page++ );
    });

    list.isLoading = true;
    list.appendData( getPageData(9) , 1 );
});