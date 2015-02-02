var EBE_TopSwitchView = function(holderEl,el){
    if( el.length == 0 ){return;}
    var i;
    var index = 0;
    var isInit = false;
    var timer = -1;
    var ulEl = el.find("ul");
    var liEl = el.find("li");
    var liCount = liEl.length;
    var liWidth = 0;
    var liHeight = 0;
    var navPanelEl = $("<div class='withchNavPanel'></div>") ;
    var arrowEls = el.find(".arrow");

    el.after( navPanelEl);
    var navBtnEl;
    if( liCount > 1 ){
        var firstLiEl = liEl.eq(0);
        var lastLiEl = liEl.eq( liCount-1 );
        firstLiEl.before( lastLiEl.clone() );
        lastLiEl.after( firstLiEl.clone() );
        liEl = ulEl.children("li");
        for(i=0;i<liCount;i++){
            $("<a href='javascript:;'>&nbsp;</a>").appendTo(navPanelEl);
        }
        navBtnEl = navPanelEl.find("a");
        navBtnEl.click( navLiClickHandler );
        arrowEls.show().click(function(){
            if( ulEl.is(":animated") ){return;}
            animaPosByDirection(  arrowEls.index(this) == 0 ?-1:1);
        });
    }
    function updateSize(){
        if( !isInit || el.length == 0 ){return;}
        clearTimeout( timer );
        ulEl.stop();
        liWidth = holderEl.width();
        var allHeigth = holderEl.height();
        liHeight = allHeigth ;
        el.height(allHeigth);
        ulEl.width( liWidth *  (liCount +2 ) ).height(liHeight);
        liEl.width(liWidth).height(liHeight);
        if( liCount < 2){return;}
        setPosByIndex(index);
        animaPosByAuto();
    }
    function setPosByIndex(val){
        index = val;
        ulEl.css("left", -(1+ index%liCount) * liWidth );
        navBtnEl.removeClass("selected");
        navBtnEl.eq(index).addClass("selected");
    }
    function navLiClickHandler(){
        if( ulEl.is(":animated") ){return;}
        var tIndex = navBtnEl.index(this);
        if( index == tIndex ){return;}
        animaPosByIndex( index,tIndex);
    }
    function animaPosByIndex(startIndex,endIndex){
        clearTimeout(timer);
        ulEl.stop();
        index = endIndex;
        navBtnEl.removeClass("selected");
        navBtnEl.eq(index).addClass("selected");
        var curX = parseInt( ulEl.css("left") );
        ulEl.animate({"left":  curX - (endIndex-startIndex)* liWidth },500* Math.abs(endIndex-startIndex),function(){
            ulEl.css("left", -(1 + index%liCount) * liWidth );
            animaPosByAuto();
        });
    }
    function animaPosByDirection(direction){
        clearTimeout(timer);
        ulEl.stop();
        var curX = parseInt( ulEl.css("left") ) - direction*liWidth;
        index -= direction;
        if( index < 0 ){
            index = liCount-1;
        }
        if( index >= liCount){
            index = 0;
        }
        ulEl.animate({"left":  curX },500,function(){
            ulEl.css("left", -(1 + index%liCount) * liWidth );
            setPosByIndex(index);
            animaPosByAuto();
        });
    }
    function animaPosByAuto(){
        clearTimeout(timer);
        ulEl.stop();
        timer = setTimeout(function(){
            index = (index+1) % liCount;
            navBtnEl.removeClass("selected");
            navBtnEl.eq( index ).addClass("selected");
            var curX = parseInt( ulEl.css("left") );
            ulEl.animate({"left":  curX - liWidth },500,function(){
                ulEl.css("left", -(1 + index%liCount) * liWidth );
                animaPosByAuto();
            });
        },5000);
    }
    $(window).resize(function(){
        updateSize();
    });
    if( holderEl.prop("complete") ){
        isInit = true;
        updateSize();
    }else{
        holderEl.load(function(){
            isInit = true;
            updateSize();
        });
    }
};

var EBE_PopManager = function(){
    var winEl = $(window);
    var el = $(".header .popBlock");
    var bgEl = el.find(".holder");
    var ulEl = el.find(".border ul");
    var itemImgEl = ulEl.find("li a img:eq(0)");
    if( itemImgEl.length == 0 ){return;}
    var loadedCount = 0;
    function sizeResizeHandler(){
        var bgHeight = bgEl.height();
        var itemHeight = itemImgEl.height();
        ulEl.css("marginTop",(bgHeight - itemHeight)/2 - 5);

    }
    function loadCompleteHandler(){
        loadedCount++;
        if(loadedCount==2){ sizeResizeHandler();}
    }
    if( bgEl.prop("complete") ){
        loadCompleteHandler();
    }else{
        bgEl[0].onload = loadCompleteHandler;
    }
    if( itemImgEl.prop("complete") ){
        loadCompleteHandler();
    }else{
        itemImgEl[0].onload = loadCompleteHandler;
    }
    winEl.resize(sizeResizeHandler);

    var timer = -1;
    var isOpen = false;
    var isPopOver = false;
    var popBtnEl = $(".header .mainNavBar .checked");

    popBtnEl.mouseenter(function(){
        if(isOpen){return;}
        el.addClass("show");
        isOpen = true;
    }).mouseleave(function(){
        clearTimeout(timer);
        timer = setTimeout(function() {
            if(isPopOver){return;}
            isOpen = false;
            el.removeClass("show");
        }, 50);
    });
    el.mouseenter(function(){
        isPopOver = true;
    }).mouseleave(function(){
        isPopOver = false;
        isOpen = false;
        el.removeClass("show");
    });
};

$(function(){
    new EBE_TopSwitchView( $(".header .top_switchPlaceholder"),$(".topSwitchViewBlock") );
    new EBE_PopManager();
});