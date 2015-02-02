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
    new EBE_PopManager();
});
