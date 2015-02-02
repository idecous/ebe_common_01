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
    var navPanelEl = $("<div class='switchNavPanel'></div>") ;

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
var EBE_ActivitiesView = function(){
    var descriptBlockEl = $(".common_mainPanel .actMainBlock .detailsViewBorder li");
    var navEl = $(".common_mainPanel .actMainBlock .navGroupBorder li");
    var index = 0;
    navEl.mouseenter(function(){
        var mIndex = navEl.index(this);
        if(index == mIndex){return;}
        descriptBlockEl.eq(index).removeClass("selected");
        navEl.eq(index).removeClass("selected");
        index = mIndex;
        descriptBlockEl.eq(index).addClass("selected");
        navEl.eq(index).addClass("selected");
    });
};
$(function(){
    if( !G_enable ){return;}
    new EBE_TopSwitchView($(".header .top_switchPlaceholder"),$(".topSwitchViewBlock") );
    new EBE_ActivitiesView();
});