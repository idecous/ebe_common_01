var EBE_TopActionManager = function(){
    var timer = -1;
    var isPopOver = false;
    var isOpen = false;
    var popBtnEl = $(".header .mainNavBar .checked");
    var actionBlock = $(".header .actionBlock");

    popBtnEl.mouseenter(function(){
        if(isOpen){return;}
        actionBlock.addClass("show");
        isOpen = true;
    }).mouseleave(function(){
        clearTimeout(timer);
        timer = setTimeout(function() {
            if(isPopOver){return;}
            isOpen = false;
            actionBlock.removeClass("show");
        }, 50);
    });

    actionBlock.mouseleave(function(){
        isPopOver = false;
        isOpen = false;
        actionBlock.removeClass("show");
    }).mouseenter(function(){
        isPopOver = true;
    });
};
var EBE_ActionElemenGroupManager = function(el){
    this.el = el;
    this.timer = -1;
    this.itemCount = 0;
    this.pageTotal = 0;
    this.page = 0;
    this.pageWidth = 0;
    this.init();
};
(function(){
    this.init = function(){
        this.build();
        this.itemCount = this.itemEls.length;
        this.pageTotal = Math.ceil( this.itemCount/6 );
        this.blockCount = Math.floor(this.itemCount/6 );
        this.maxRedundant = this.itemCount % 6;
        if( this.maxRedundant < 3){
            this.maxRedundant = this.maxRedundant%3;
        }else{
            this.maxRedundant = 3;
        }
        var fCount = this.blockCount * 3 + this.maxRedundant;
        this.topItems = this.itemBorderEls.slice(0 , fCount  );
        this.bottomItems = this.itemBorderEls.slice( fCount, this.itemCount);
        this.bottomItems.css("marginTop",2);
        if( this.itemCount > 6 ){
            this.arrowEls.eq(1).show();
        }
        var that = this;
        this.arrowEls.click(function(){
            if( that.itemUlEl.is(":animated") ){
                return;
            }
            var tIndex = that.arrowEls.index(this);
            var toPage = that.page + (tIndex==0?-1:1);
            that.itemUlEl.animate({"left":-toPage * that.pageWidth },"normal",function(){
                that.setIndex(toPage);
            });
        });
    };
    this.setIndex = function(val){
        this.itemUlEl.stop();
        this.page = val;
        if( this.page == 0 ){
            this.arrowEls.eq(0).hide();
        }else{
            this.arrowEls.eq(0).show();
        }
        if( this.page < this.pageTotal-1 ){
            this.arrowEls.eq(1).show();
        }else{
            this.arrowEls.eq(1).hide();
        }
        this.itemUlEl.css("left", -this.page * this.pageWidth);
    };
    this.updateSize = function(val){
        this.el.height(val);
        this.pageWidth = this.itemsBlockEl.width();
        var itemWidth = this.pageWidth/3;
        this.itemUlEl.width( (itemWidth*3)*this.blockCount +  this.maxRedundant*itemWidth  );
        this.itemEls.width( itemWidth );

        this.topItems.height( val/2 - 1);
        this.bottomItems.height( val/2 - 2);
        this.setIndex( this.page );
    };
    this.build = function(){
        this.itemsBlockEl = this.el.find(".itemsBlock");
        this.itemUlEl = this.el.find("ul");
        this.itemEls = this.itemUlEl.find("li");
        this.itemBorderEls = this.itemEls.find(".item");
        this.arrowEls = this.el.find(".arrow");
    };

}).call(EBE_ActionElemenGroupManager.prototype);

var EBE_ActionElementNav = function(count,setPage){
    var el = $(".actionElementNavBar");
    var index = 0;
    var i;
    for(i=0;i<count;i++){
        $("<a href='javascript:;'></a>").appendTo(el);
    }
    var btnEls = el.find("a");
    if(count==1){
        btnEls.hide();
    }
    btnEls.click(function(){
        var tIndex = btnEls.index(this);
        var btnEl = btnEls.eq( tIndex );
        if( btnEl.hasClass("current") ){
            return;
        }
        setPage(tIndex);
    });
    function setIndex(val){
        index = val;
        btnEls.removeClass("current");
        btnEls.eq(index).addClass("current");
    }
    return {"setIndex":setIndex};
};

var EBE_ActionElement = function(){
    var i,group,index=0;
    var timer = -1,isMouseOver = false;
    var groups = [];
    var winEl = $(window);
    var el = $(".common_mainPanel .actionElementBlock");
    var borderEl = el.find(".borderBlock");
    var holderEl = el.find(".holder");
    var groupUlEls = el.find(".groupPanel");
    var groupEls = groupUlEls.find(".groupBlock");
    var groupCount = groupEls.length;
    var groupHeight = 0;
    var isBgLoaded = false;
    var nav = new EBE_ActionElementNav(groupCount,function(val){
        if( groupUlEls.is(":animated") ){ return false;}
        animaPosByIndex( index,val);
        return true;
    });
    el.mouseenter(function(){
        isMouseOver = true;
    }).mouseleave(function(){
        isMouseOver = false;
    });
    function animaPosByIndex(startIndex,endIndex){
        clearTimeout(timer);
        groupUlEls.stop();
        index = endIndex;
        nav.setIndex( endIndex );
        var curY = parseInt( groupUlEls.css("top") );
        groupUlEls.animate({"top":  curY - (endIndex-startIndex)* groupHeight },500* Math.abs(endIndex-startIndex),function(){
            setIndex(index);
        });
    }
    function animaPosByAuto(){
        if(groupCount<=1){return;}
        clearTimeout(timer);
        groupUlEls.stop();
        timer = setTimeout(function(){
            if( el.is(":hidden") || isMouseOver){
                animaPosByAuto();
                return;
            }
            index = (index+1) % groupCount;
            nav.setIndex( index );
            var curY = parseInt( groupUlEls.css("top") );
            groupUlEls.animate({"top":  curY - groupHeight },500,function(){
                setIndex(index);
            });
        },5000);
    }
    if( groupEls.length > 1 ){
        var fEl = groupEls.eq(0);
        var lEl = groupEls.eq(groupCount-1);
        fEl.before( lEl.clone());
        lEl.after( fEl.clone());
        var groupEls = groupUlEls.find(".groupBlock");
    }
    for( i=0; i < groupEls.length;i++){
        group = new EBE_ActionElemenGroupManager( groupEls.eq(i) );
        groups.push( group );
    }
    function setIndex(val){
        groupUlEls.stop();
        index = val;
        if(groupCount<=1){
            groupUlEls.css("top", 0 );
        }else{
            groupUlEls.css("top", -(index+1)*groupHeight );
        }
        nav.setIndex(val);
        animaPosByAuto();
    }
    function winResizeHandler(){
        if(!isBgLoaded){return;}
        groupHeight = holderEl.height();
        for(i=0; i <groups.length ;i++){
            groups[i].updateSize( groupHeight );
        }
        groupUlEls.height(  groupHeight * (groupCount + 2) );
        setIndex(index);
        borderEl.height( groupHeight );
    };
    winEl.resize(winResizeHandler);

    if( holderEl.prop("complete") ){
        isBgLoaded = true;
        borderEl.show();
        winResizeHandler();
    }else{
        isBgLoaded = true;
        borderEl.show();
        holderEl[0].onload = winResizeHandler;
    }
};

var EBE_MobileActionElementBlock = function(tragetLi,container){
    var el = $("<li></li>");
    var tImgEl = tragetLi.find(".mainBlock img");
    var mainImgContainerEl = $("<div class='mainBlock'></div>").appendTo(el).append( tImgEl.clone() );
    $("<div class='navSpacer'></div>").appendTo(el);

    var itemBlockEl = $("<div class='itemsBlock'></div>").appendTo(el);
    var tItemEls = tragetLi.find(".itemsBlock .itemPanel li");
    var i,tItemEl;
    for( i = 0; i < tItemEls.length;i++ ){
        tItemEl = tItemEls.eq(i).children("a");
        tItemEl.clone().appendTo(itemBlockEl);
    }
    $("<div class='clearFloat'></div>").appendTo(el);
    container.append(el);

    var itemEl = itemBlockEl.children("a");

    function resizeHandler( blockWidth ){
        el.width( blockWidth );
        var itemWidth = itemEl.eq(0).width();
        var rowCount = Math.floor(blockWidth/itemWidth);
        var space = ( blockWidth - rowCount*itemWidth ) /(rowCount+1);
        if( space < 10 ){
            rowCount--;
            space = ( blockWidth - rowCount*itemWidth ) /(rowCount+1);
        }
        itemEl.css("marginLeft",space);
        return el.height();
    }

    return {"el":el,
        "resizeHandler":resizeHandler,
        "getMainImgHeight":function(){
            return mainImgContainerEl.height();
        }};
};
var EBE_MobileActionElement=function(){
    var winEl = $(window);
    var el = $(".common_mainPanel .mobileActionElementBlock");
    var ulEl = el.children("ul");
    var targetEl = $(".common_mainPanel .actionElementBlock .borderBlock .groupPanel>li");
    var liWidth = 0;
    var index = 0;
    var timer = -1;
    var liCount = targetEl.length;

    var blocks = [ new EBE_MobileActionElementBlock( targetEl.eq(targetEl.length-1),ulEl) ];
    for(var i=0;i<targetEl.length;i++){
        blocks.push( new EBE_MobileActionElementBlock( targetEl.eq(i),ulEl) );
    }
    blocks.push( new EBE_MobileActionElementBlock( targetEl.eq(0),ulEl) );

    var nav = new EBE_MobileActionElementNav( liCount ,el, function(val){
        animaPosByIndex(index,val);
    });

    function animaPosByIndex(startIndex,endIndex){
        clearTimeout(timer);
        ulEl.stop();
        index = endIndex;
        nav.setIndex( endIndex );
        var curX = parseInt( ulEl.css("left") );
        ulEl.animate({"left":  curX - (endIndex-startIndex)* liWidth },500* Math.abs(endIndex-startIndex),function(){
            setIndex(index);
            animaPosByAuto();
        });
    }
    function animaPosByAuto(){
        if(liCount<=1){return;}
        clearTimeout(timer);
        ulEl.stop();
        timer = setTimeout(function(){
            if( el.is(":hidden") ){
                animaPosByAuto();
                return;
            }
            index = (index+1) % liCount;
            nav.setIndex( index );
            var curX = parseInt( ulEl.css("left") );
            ulEl.animate({"left":  curX - liWidth },500,function(){
                setIndex(index);
            });
        },5000);
    }
    function setIndex(val){
        ulEl.stop();
        index = val;
        if(liCount<=1){
            ulEl.css("left", 0 );
        }else{
            ulEl.css("left", -(index+1)*liWidth );
        }
        nav.setIndex(val);
        animaPosByAuto();
    }

    function resizeHandler(){
        if( el.is(":hidden") ){return;}
        liWidth = el.width();
        var i,th,maxHeight = 0;
        for(var i=0; i < blocks.length;i++){
            th = blocks[i].resizeHandler( liWidth );
            if(maxHeight < th){
                maxHeight = th;
            }
        }
        el.height(maxHeight);
        nav.el.css("top",blocks[0].getMainImgHeight() );
        ulEl.width( (liCount+ 2) * liWidth );

        setIndex(index);
    }
    winEl.resize(resizeHandler);
    resizeHandler();
};

var EBE_MobileActionElementNav = function(count,container,setPage){
    var el = $("<div class='navBar'></div>").appendTo(container);
    var index = 0;
    var i;
    for(i=0;i<count;i++){
        $("<a href='javascript:;'></a>").appendTo(el);
    }
    var btnEls = el.find("a");
    if(count==1){
        btnEls.hide();
    }
    btnEls.click(function(){
        var tIndex = btnEls.index(this);
        var btnEl = btnEls.eq( tIndex );
        if( btnEl.hasClass("current") ){
            return;
        }
        setPage(tIndex);
    });
    function setIndex(val){
        index = val;
        btnEls.removeClass("current");
        btnEls.eq(index).addClass("current");
    }
    return {"el":el,"setIndex":setIndex};
};
var EBE_HistoryManager = function(){
    var winEl = $(window);
    var el = $(".common_mainPanel .historyPanel");
    var liEls = el.find("li");
    var liCount = liEls.length;
    var aEls = el.find("li a");
    var imgEls = el.find("li a img");
    var popEls = el.find(".popBlock");
    var popAEls = popEls.find("a");
    var popImgEls = popEls.find("img");
    var liWidth=0,liHeight=0;
    var rowItemCount = 0;
    var colItemCount = 0;
    aEls.mouseenter(function(){
        var tIndex = aEls.index(this);
        popAEls.attr( "href", aEls.eq(tIndex).attr("href") );
        popImgEls.attr("src",imgEls.eq(tIndex).attr("src") );

        var isRowLast = tIndex % rowItemCount == rowItemCount-1?true:false;
        var isColLsat = Math.floor(tIndex/rowItemCount) % colItemCount == colItemCount-1?true:false;

        var sTop = Math.floor(tIndex/rowItemCount) * liHeight;
        var sLeft = tIndex % rowItemCount * liWidth;
        popAEls.css({"marginRight":3,"marginLeft":0} );

        if( isRowLast ){
            sLeft = (tIndex % rowItemCount-1) * liWidth;
        }
        if(isColLsat){
            sTop = (Math.floor(tIndex/rowItemCount)-1) * liHeight;;
        }
        popEls.addClass("show").css({"top":sTop,"left":sLeft});
    });
    el.mouseleave(function(){
        popEls.removeClass("show");
    });
    function resizeHandler(){
        liWidth = liEls.eq(0).width();
        liHeight = liEls.eq(0).height()+3;
        rowItemCount = Math.round(el.width()/ liWidth);
        colItemCount = Math.round(el.height()/liHeight );
    }
    var imgCount = 0;
    var imgEls = el.find("ul img");
    imgEls.each(function(index){
        if( imgEls.eq(index).prop("complete") ){
            init();
        }else{
            imgEls[index].onload =init;
        }
    });
    function init(){
        imgCount++;
        if( imgCount >= imgEls.length ){
            winEl.resize(resizeHandler);
            resizeHandler();
        }
    }
};
var EBE_MobileHistoryManager = function(){
    var winEl = $(window);
    var el = $(".common_mainPanel .mobileHistoryPanel");
    var bgEl = el.find(".holder");
    var ulEl = el.find("ul");
    var liEls =  $(".common_mainPanel .historyPanel ul li").clone();
    var arrowEls = el.find(".arrow");
    ulEl.append(liEls);
    var liWidth = 0;
    var liCount = liEls.length;
    var isBgLoaded = false;
    var timer = -1;
    var index = 0;

    if( liCount > 1){
        arrowEls.click(function(){
            if( ulEl.is(":animated") ){return;}
            var tIndex = arrowEls.index(this);
            var toIndex = index + (tIndex==0?-1:1);
            ulEl.animate({"left":-toIndex * liWidth },"normal",function(){
                setIndex(toIndex);
            });

        });
    }
    function setIndex(val){
        ulEl.stop();
        index = val;
        if(liCount<=1){
            ulEl.css("top", 0 );
        }else{
            ulEl.css("left", -index*liWidth );
        }
        if( index == 0 ){
            arrowEls.eq(0).hide();
        }else{
            arrowEls.eq(0).show();
        }
        if( index < liCount-1 ){
            arrowEls.eq(1).show();
        }else{
            arrowEls.eq(1).hide();
        }
    }
    function resizeHandler(){
        liWidth = bgEl.width();
        liEls.width(liWidth);
        ulEl.width( (liCount+ 2) * liWidth );
        setIndex(index);
    }
    winEl.resize(resizeHandler);
    if( bgEl.prop("complete") ){
        isBgLoaded = true;
        resizeHandler();
    }else{
        bgEl[0].onload = resizeHandler;
    }
};

$(function(){
    new EBE_TopActionManager();
    new EBE_MobileActionElement();
    new EBE_ActionElement();
    new EBE_HistoryManager();
    new EBE_MobileHistoryManager();
});