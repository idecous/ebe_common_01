var EBE_GoodsPreviewNavigator = function(el,changeViewHandler){
    var navEl = el.find(".switchPanel");
    var ulEl = navEl.find("ul").show();
    var arrowEl = navEl.find(".arrow");
    var liEls = navEl.find("li");
    var imgEls = liEls.find("img");
    var uWidth = 0;
    var firstIndex = 0;
    var viewIndex = -1;

    var defaultIndex = 0;
    for( var i=0; i <liEls.length;i++ ){
        if( liEls.eq(i).hasClass("checked") ){
            defaultIndex = i;
            break;
        }
    }
    arrowEl.eq(1).click(function(){
        firstIndex++;
        setFirstIndex(firstIndex);
    });
    arrowEl.eq(0).click(function(){
        firstIndex--;
        setFirstIndex(firstIndex);
    });
    function resizeHandler(viewAreaWidth){
        uWidth = (viewAreaWidth-30) * 0.25;
        liEls.width( uWidth ).css("marginRight",10);
        ulEl.width( (uWidth+10)*liEls.length );
        navEl.height( imgEls.eq(0).height() );
        setFirstIndex( firstIndex );
    }
    function setFirstIndex(val){
        firstIndex = val;
        if( firstIndex == 0 ){
            arrowEl.eq(0).hide();
        }else if( liEls.length > 4 ){
            arrowEl.eq(0).show();
        }
        if( liEls.length > 4){
            if( firstIndex >= liEls.length-4 ){
                arrowEl.eq(1).hide();
            }else{
                arrowEl.eq(1).show();
            }
        }
        ulEl.stop();
        ulEl.animate({"left":-firstIndex * (uWidth+10)},"fast");
    }
    function setViewIndex(val){
        if( viewIndex == val){
            return;
        }
        viewIndex = val;
        liEls.removeClass("checked");
        liEls.eq(viewIndex).addClass("checked");
        if( val - firstIndex > 3){
            setFirstIndex( val - firstIndex - 3);
        }
    }
    liEls.mouseenter(function(){
        var index = liEls.index(this);
        if( liEls.eq(index).attr("iid") == "-1" ){
            return;
        }
        if(viewIndex == index){return;}
        setViewIndex(index);
        changeViewHandler(viewIndex);
    });

    return {"resizeHandler":resizeHandler,
        "setViewIndex":setViewIndex,"defaultIndex":defaultIndex,
        "el":navEl};
};

var EBE_GoodsPreview = function(levelCount){
    var winEl = $(window);
    var documentEl = $(document);
    var el = $(".common_mainPanel .detailPanel .leftBlock .goodsPreview");
    var imgEl = el.find("img");
    var imgTotal = imgEl.length;
    var imgLoaded = 0;
    imgEl.each(function(){
        if( this.complete ){
            imgLoaded++;
        }else{
            this.onload = imgCompletedHandler;
        }
    });
    function imgCompletedHandler(){
        imgLoaded++;
        if(imgLoaded == imgTotal){init();}
    }
    var i,navigator;
    var mainViewBgEl = el.find(".mainView .holder");
    var navBgEl = el.find(".switchPanel .holder");
    var mouseAreaEl = el.find(".mouseArea");
    var toolGroupEl = el.find(".toolBlock");
    var mainOrgWidth =0;
    var mainOrgHeight =0;
    var scaleLevel = 1;
    var centers = [];
    var viewAreaWidth = 0;
    var viewAreaHeight = 0;
    var isFirst = true;
    var viewIndex = -1;
    var mainVewImgEls = el.find(".groupContainer img");
    var mainVewCenterEl = el.find(".groupContainer .center");
    //--
    if(imgLoaded == imgTotal){init();}
    function init(){
        el.find(".groupContainer").removeClass("loading");
        navigator = new EBE_GoodsPreviewNavigator(el,setViewIndex);
        var tImg = mainVewImgEls.eq(0);
        tImg.css({"width":"auto","height":"auto" });
        mainOrgWidth = tImg.width();
        mainOrgHeight = tImg.height();
        resizeHandler();
        el.mouseenter(function(){
            if( navigator.el.is(":hidden") ){return;}
            mouseAreaEl.show();
            toolGroupEl.show();
        }).mouseleave(function(){
            if( navigator.el.is(":hidden") ){return;}
            mouseAreaEl.hide();
            toolGroupEl.hide();
        });

        toolGroupEl.children(".zoomOut").click(zoomOutHandler);
        toolGroupEl.children(".zoomIn").click(zoomInHandler);
        toolGroupEl.children(".reset").click(zoomResetHandler);
        mouseAreaEl.mousedown( startDragHandler );

        mouseAreaEl.bind("mousedown touchstart",touchstartHandler);
        documentEl.bind("mouseup touchend", touchendHandler );

        winEl.resize(function(){
            resizeHandler();
        });
    }
    var isTouch = false;
    var touchX = 0;
    function touchstartHandler(e){
        if( navigator.el.is(":visible") ){return;}
        isTouch = true;
        var touch = null;
        if( e.originalEvent.touches || e.originalEvent.changedTouches){
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        }
        if( touch ){
            e.pageX = touch.pageX;
        }
        touchX = e.pageX;
        if (window.captureEvents) {
            window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        } else if (this.el.setCapture) {
            el[0].setCapture();
        }
    }
    function touchendHandler(e){
        if( !isTouch ){ return; }
        isTouch = false;
        var touch = null;
        if( e.originalEvent.touches || e.originalEvent.changedTouches){
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        }
        if( touch ){
            e.pageX = touch.pageX;
        }
        var offsetX =  touchX - e.pageX;
        if( Math.abs(offsetX) < 50 ){
            return;
        }
        var index =  viewIndex + (offsetX<0?1:-1);
        if(index<0){index=mainVewImgEls.length-1;}
        if( index >= mainVewImgEls.length ){
            index = 0;
        }
        setViewIndex(index);
        if (window.releaseEvents) {
            window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        } else if (this.el.releaseCapture) {
            el[0].releaseCapture();
        }
    }
    var pageStartX,pageStartY,dragCenterX,dragCenterY;
    var dragImgWidht,dragImgHeight;
    function startDragHandler(e){
        if( navigator.el.is(":hidden") ){return true;}

        documentEl.bind("mousemove", dragHandler);
        documentEl.bind("mouseup", endDragHandler );
        if (window.captureEvents) {
            window.addEventListener(Event.MOUSEMOVE, null, true);
            window.addEventListener(Event.MOUSEUP, null, true);
        } else if (mouseAreaEl[0].setCapture) {
            mouseAreaEl[0].setCapture();;
        }
        pageStartX = e.pageX;
        pageStartY = e.pageY;
        dragCenterX = parseFloat(  mainVewCenterEl.css("left") );
        dragCenterY = parseFloat(  mainVewCenterEl.css("top") );

        dragImgWidht = mainVewImgEls.eq(viewIndex).width() ;
        dragImgHeight = mainVewImgEls.eq(viewIndex).height();

        mainVewCenterEl.removeClass("anime");
        return false;
    }
    function dragHandler(e){
        var tX = e.pageX - pageStartX + dragCenterX;
        if( tX - dragImgWidht/2 > 0){
            tX = dragImgWidht/2;
        }
        if( tX + dragImgWidht/2 < viewAreaWidth){
            tX = viewAreaWidth - dragImgWidht/2;
        }
        var tY = e.pageY - pageStartY + dragCenterY;
        if( tY - dragImgHeight/2 > 0){
            tY = dragImgHeight/2;
        }
        if( tY + dragImgHeight/2 < viewAreaHeight){
            tY = viewAreaHeight - dragImgHeight/2;
        }
        mainVewCenterEl.css( {"left":tX,"top":tY} );

        centers[0] = tX / viewAreaWidth;
        centers[1] = tY / viewAreaHeight;
    }
    function endDragHandler(e){
        documentEl.unbind();
        if (window.releaseEvents) {
            window.removeEventListener(Event.MOUSEMOVE, null, true);
            window.removeEventListener(Event.MOUSEUP, null, true);
        } else if (mouseAreaEl[0].releaseCapture) {
            mouseAreaEl[0].releaseCapture();
        }
        mainVewCenterEl.stop();
    }

    function zoomOutHandler(){
        if( scaleLevel == 0){return;}
        mainVewImgEls.eq(viewIndex).addClass("anime");
        mainVewCenterEl.eq(viewIndex).addClass("anime");
        scaleLevel--;
        var rate = minScale + (1-minScale)/levelCount * scaleLevel;
        mainVewImgEls.eq(viewIndex).stop().animate(
            {"width":rate*mainOrgWidth,"left":-rate*mainOrgWidth/2,"top":-rate*mainOrgHeight/2},"fast");
        _moveCenterHandler(rate);
    }
    function zoomInHandler(){
        if( scaleLevel >= levelCount){return;}
        mainVewImgEls.eq(viewIndex).addClass("anime");
        mainVewCenterEl.eq(viewIndex).addClass("anime");
        scaleLevel++;
        var rate = minScale + (1-minScale)/levelCount *scaleLevel;
        mainVewImgEls.eq(viewIndex).stop().animate(
            {"width":rate*mainOrgWidth,"left":-rate*mainOrgWidth/2,"top":-rate*mainOrgHeight/2},"fast");
    }
    function zoomResetHandler(){
        mainVewImgEls.eq(viewIndex).addClass("anime");
        mainVewCenterEl.eq(viewIndex).addClass("anime");
        scaleLevel = 0;
        mainVewImgEls.eq(viewIndex).stop().animate(
            {"width":minScale*mainOrgWidth,"left":-minScale*mainOrgWidth/2,"top":-minScale*mainOrgHeight/2},"fast");
        _moveCenterHandler(minScale);
    }
    function _moveCenterHandler(rate,promptly){
        var imgWidth = rate*mainOrgWidth;
        var imgHeight = rate*mainOrgHeight;
        var tX = centers[0] * viewAreaWidth;
        if( tX - imgWidth/2 > 0){
            tX = imgWidth/2;
        }
        if( tX + imgWidth/2 < viewAreaWidth){
            tX = viewAreaWidth - imgWidth/2;
        }
        var tY = centers[1] * viewAreaHeight;
        if( tY - imgHeight/2 > 0){
            tY = imgHeight/2;
        }
        if( tY + imgHeight/2 < viewAreaHeight){
            tY = viewAreaHeight - imgHeight/2;
        }
        if( promptly ){
            mainVewCenterEl.css( {"left":tX,"top":tY} );
        }else{
            mainVewCenterEl.stop().animate({"left":tX,"top":tY},"fast");
        }
        centers[0] = tX / viewAreaWidth;
        centers[1] = tY / viewAreaHeight;
    }

    function resizeHandler(){
        mainVewImgEls.removeClass("anim");
        mainVewCenterEl.removeClass("anim");
        minScale =  mainViewBgEl.width() / mainOrgWidth;
        viewAreaWidth = mainViewBgEl.width();
        viewAreaHeight = mainViewBgEl.height();
        if( isFirst ){
            scaleLevel = 0;
            centers = [ 0.5 , 0.5 ];
            isFirst = false;
            mainVewImgEls.width(minScale * mainOrgWidth).css({"left":-viewAreaWidth/2,"top":-viewAreaHeight/2}).addClass("anim");
            mainVewCenterEl.css( {"left":viewAreaWidth*0.5 ,"top":viewAreaHeight*0.5 } );
            setViewIndex( navigator.defaultIndex );
            navigator.resizeHandler(viewAreaWidth);
            navigator.setViewIndex(  navigator.defaultIndex );
            return;
        }
        var rate = minScale + (1-minScale)/levelCount * scaleLevel;
        mainVewImgEls.width( rate*mainOrgWidth ).css({"left":-rate*mainOrgWidth/2 ,"top":-rate*mainOrgHeight/2 });
        _moveCenterHandler(rate,true);
        navigator.resizeHandler(viewAreaWidth);
    }
    function setViewIndex(index){
        if(viewIndex == index ){return;}
        if( viewIndex != -1){
            mainVewImgEls.eq(viewIndex).stop().css("zIndex",0).animate({"opacity":0});
        }
        viewIndex = index;
        var rate = minScale + (1-minScale)/levelCount * scaleLevel;
        mainVewImgEls.eq(viewIndex).width( rate*mainOrgWidth ).
            css({"left":-rate*mainOrgWidth/2 ,"top":-rate*mainOrgHeight/2 ,"zIndex":1}).
            animate({"opacity":1});
    }
};



var EBE_ElementRow = function(el){
    var el = el;
    var rightBlockEl = el.find(".rightBlock");
    var itemsBlockEl = rightBlockEl.find(".itemsBlock");
    var arrowEl = itemsBlockEl.find(".arrow");
    var ulEl = rightBlockEl.find("ul");
    var liEl = ulEl.find("li");
    var liCount = liEl.length;
    var liWidth = 0;
    var firstIndex = 0;
    if( liCount > 4){
        var fItem = liEl.eq(0);
        var lItem = liEl.eq(liCount-1);
        fItem.before( lItem.clone() );
        lItem.after( fItem.clone() );
        liEl = ulEl.find("li");
    }
    arrowEl.click(function(){
        if( ulEl.is(":animated") ){
            return;
        }
        var tIndex = arrowEl.index(this);
        firstIndex += (tIndex==0?-1:1);
        ulEl.animate({"left":-(firstIndex+1) * (liWidth+40) },"normal",function(){
            setIndex(firstIndex);
        });
    });
    function setIndex(val ){
        ulEl.stop();
        firstIndex = val;
        if(liCount <= 4){
            arrowEl.hide();
            return;
        }
        if( val == 0){
            arrowEl.eq(0).hide();
        }else{
            arrowEl.eq(0).show();
        }
        if( val >= liCount-4){
            arrowEl.eq(1).hide();
        }else{
            arrowEl.eq(1).show();
        }
        ulEl.css("left", -(firstIndex+1) * (liWidth+40)  );
    }
    function resizeHandler(h){
        el.height( h );
        rightBlockEl.height( h );
        liWidth = (itemsBlockEl.width()- 40*3)/4;
        ulEl.width( (liWidth+40) * (liCount +2)  );
        liEl.width( liWidth );
        setIndex(firstIndex);
    }
    var _isOver = false;

    return {"resizeHandler":resizeHandler};
};
var EBE_ElementNav = function(el,total,changeHandler){
    var index = 0;
    for(var i=0; i < total;i++){
        $("<a href='javascript:;'></a>").appendTo(el);
    }
    var btnEls = el.find("a");
    btnEls.click(function(){
        var tIndex = btnEls.index(this);
        if(tIndex == index){return;}

        changeHandler(tIndex);
    });

    function setIndex(val){
        index = val;
        btnEls.removeClass("selected");
        btnEls.eq(index).addClass("selected");
    }
    setIndex(index);

    return {"setIndex":setIndex};
};

var EBE_ElementGroup = function(){
    var winEl = $(window);
    var el =  $(".common_mainPanel .elementPanel");
    if( el.length == 0 ){return;}
    var switchPanelEl = el.find(".switchPanel");
    var i,row,rows=[];
    var ulEl = switchPanelEl.find(".rowBlock");
    var rowEls = ulEl.children("li");
    var rowCount = rowEls.length;
    var rowHeight = 0;
    var viewIndex = 0;
    var bgEl = switchPanelEl.find(".holder");
    var nav,timer=-1;

    function init(){
        if( rowCount > 1 ){
            var fItem = rowEls.eq(0);
            var lItem = rowEls.eq(rowCount-1);
            fItem.before( lItem.clone() );
            lItem.after( fItem.clone() );
            rowEls = ulEl.find("li");
            nav = new EBE_ElementNav( $(".common_mainPanel .elementPanel .navBar") ,rowCount ,indexChangeHandler);
            animaPosByAuto();
        }
        for(i=0; i < rowEls.length;i++){
            row = new EBE_ElementRow( rowEls.eq(i) );
            rows.push(row);
        }
        resizeHandler();
        winEl.resize(resizeHandler);
    }
    function indexChangeHandler(val){
        if( ulEl.is(":animated") ){
            return;
        }
        animaPosByIndex(viewIndex,val);
    }
    function animaPosByIndex(startIndex,endIndex){
        clearTimeout(timer);
        ulEl.stop();
        viewIndex = endIndex;
        nav.setIndex( endIndex );
        var curY = parseInt( ulEl.css("top") );
        ulEl.animate({"top":  curY - (endIndex-startIndex)* rowHeight },500* Math.abs(endIndex-startIndex),function(){
            ulEl.css("top", -(1 + viewIndex%rowCount) * rowHeight );
            animaPosByAuto();
        });
    }
    function animaPosByAuto(){
        clearTimeout(timer);
        ulEl.stop();
        timer = setTimeout(function(){
            if( switchPanelEl.is(":hidden") ){
                animaPosByAuto();
                return;
            }
            viewIndex = (viewIndex+1) % rowCount;
            nav.setIndex( viewIndex );
            var curY = parseInt( ulEl.css("top") );
            ulEl.animate({"top":  curY - rowHeight },500,function(){
                ulEl.css("top", -(1 + viewIndex%rowCount) * rowHeight );
                animaPosByAuto();
            });
        },5000);
    }
    function setIndex(val ){
        animaPosByAuto();
        viewIndex = val;
        ulEl.css("top", -(viewIndex+1) * rowHeight );
    }
    function resizeHandler(){
        rowHeight = bgEl.height();
        for(i=0; i < rows.length;i++){
            rows[i].resizeHandler(rowHeight );
        }
        setIndex(viewIndex);
    }

    if( bgEl.prop("complete") ){
        init();
    }else{
        bgEl[0].onload = init;
    }
};
var EBE_RecommendPanel = function(){
    var rightGroup = new EBE_RecommendGroup( $(".recommendPanel .recentViewGroup") , 1 );
   var leftGroup = new EBE_RecommendGroup( $(".recommendPanel .mightLikeGroup") , 3 ,function(liWidth){
       rightGroup.updateWidth(liWidth);
   });
};
var EBE_RecommendGroup = function( el ,maxShowCount,resizeFn){
    var index = 0;
    var isInit = false;
    var windEl =$(window);
    var arrowEl = el.find(".pageArrow");
    var bgEl = el.find(".bg");

    var listContainerEl = el.find(".listContainer");
    var ulEl = el.find("ul");
    var liEls = el.find("li");
    var listGroupEl = el.find(".listGroup");
    var liCount = liEls.length;
    var bgWidth = 0;
    var liWidth = 0;

    function setIndex(val){
        index = val;
        if( liCount <= maxShowCount  ){
            arrowEl.hide();
            ulEl.css("left",0);
            return;
        }
        if( index == 0 ){
            arrowEl.eq(0).hide();
        }else{
            arrowEl.eq(0).show();
        }
        if( index < liCount - maxShowCount ){
            arrowEl.eq(1).show();
        }else{
            arrowEl.eq(1).hide();
        }
        ulEl.css("left", - index*liWidth );
    }
    if(resizeFn){
        windEl.resize(resizeHandler);
    }
    function resizeHandler(){
        ulEl.stop();
        bgWidth = bgEl.width();
        liWidth = (bgWidth- (maxShowCount-1)*10)/maxShowCount+10;
        liEls.width(liWidth);
        ulEl.width( liWidth * liCount );
        setIndex(index);
        if(resizeFn){
            resizeFn( liWidth );
        }

    }
    function init(){
        isInit = true;
        ulEl.show();
        if(resizeFn){
            resizeHandler();
        }
        arrowEl.click(function(){
            index += arrowEl.index(this)==0?-1:1;
            ulEl.stop();
            ulEl.animate({"left": -index*liWidth},"normal",function(){
                setIndex(index);
            });
        });
    }
    if( bgEl.prop("complete") ){
        init();
    }else{
        bgEl[0].onload = init;
    }
    function updateWidth( liWidth){
        ulEl.stop();
        if( listGroupEl.parent().css("textAlign") == "center" ){
            listGroupEl.css( {"marginRight": el.width() - liWidth - 45 +10,
            "marginLeft":0});
        }else{
            listGroupEl.css({"marginLeft": el.width() - liWidth - 45 +10 ,
        "marginRight":0});
        }
        resizeHandler();
    }
    return { "updateWidth":updateWidth };
}

var EBE_GoodsParameter = function(sizeWarn,submitFn,favoritesFn,appendText){
    var html7BodyEl = $("html, body");
    var sizeDataTitleEl = $(".common_mainPanel .sizeDataPanel h3");
    var el = $(".common_mainPanel .detailPanel .rightBlock .paramPanel");
    el.find(".sizeGroup .toData a").click(function(){
        html7BodyEl.animate({ scrollTop: sizeDataTitleEl.offset().top });
    });

    var contentIndex = 0;
    var contentBtnEl = el.find(".messageBlock .tabBar li");
    var contentLiEl = el.find(".messageBlock .contentBlock li");
    contentBtnEl.click(function(){
        var tIndex = contentBtnEl.index(this);
        if(contentIndex == tIndex){return;}
        if( contentIndex != -1 ){
            contentBtnEl.eq(contentIndex).removeClass("checked");
            contentLiEl.eq(contentIndex).removeClass("checked");
        }
        contentIndex = tIndex;
        contentBtnEl.eq(contentIndex).addClass("checked");
        contentLiEl.eq(contentIndex).addClass("checked");
    });
    var sizeRowEl = el.find(".sizeGroup");
    var priceEl = el.find("h3 b");
    var inventoryGroupEl = el.find(".inventory");
    var inventoryNumEl = inventoryGroupEl.find("b");
    var sizeIndex = -1;
    var priceEls = el.find(".sizeGroup .list a");
    for(var i=0; i < priceEls.length;i++){
        if( priceEls.eq(i).hasClass("checked")  ){
            sizeIndex = i;
            priceEl.text(  priceEls.eq(sizeIndex).attr("price") );
            inventoryGroupEl.css("visibility","visible");
            inventoryNumEl.text( priceEls.eq(sizeIndex).attr("qty") );
            break;
        }
    }
    if( sizeRowEl.length == 0 ){
        inventoryGroupEl.css("visibility","visible");
    }


    priceEls.click(function(){
        var tIndex = priceEls.index(this);
        if( sizeIndex == tIndex ||  priceEls.eq(tIndex).hasClass("unable") ){return;}
        if( sizeIndex != -1 ){
            priceEls.eq(sizeIndex).removeClass("checked");
        }
        sizeIndex = tIndex;
        priceEls.eq(sizeIndex).addClass("checked");
        priceEl.text(  priceEls.eq(sizeIndex).attr("price") );
        inventoryGroupEl.css("visibility","visible");
        inventoryNumEl.text( priceEls.eq(sizeIndex).attr("qty") );
        var val = parseInt( qtyInputEl.val() );
        var maxVal = parseInt( inventoryNumEl.text() );
        if( val > maxVal ){
            qtyInputEl.val(maxVal);
        }
    });
    el.find(".appendShopping a span").click(appendGoodsHandler);
    el.find(".appendShopping a i").click(favoritesHandler);
    //--
    var messageBlockEl = el.find(".messageBlock");
    var mobileMessageEl = $("<div class='mobile_paramMessage'></div>");
    $(".common_mainPanel .detailPanel .shapeBar").after(mobileMessageEl);
    var messageTitleEls = messageBlockEl.find(".tabBar li");
    messageTitleEls.css("width",(1/messageTitleEls.length)*100+"%");

    var messageContentEls = messageBlockEl.find(".contentBlock li");
    var sizeBlock = $(".common_mainPanel .sizeDataPanel");

    var titleEl = $("<div class='subTitle'></div>").appendTo(mobileMessageEl);
    var contentEl = $("<div class='content'></div>").appendTo(mobileMessageEl);

    titleEl.append( sizeBlock.find("h3").clone() );
    contentEl.append( sizeBlock.find("img").clone() );
    for(var i=0;i<messageTitleEls.length;i++){
        titleEl = $("<div class='subTitle'></div>").appendTo(mobileMessageEl);
        contentEl = $("<div class='content'></div>").appendTo(mobileMessageEl);

        titleEl.text(  messageTitleEls.eq(i).text() );
        contentEl.append( messageContentEls.eq(i).children().clone() );
    }
    var tEl = $("<div class='mobileAppendBtn'></div>").appendTo(mobileMessageEl);
    var appendShoppingcarEl = $("<a class='appendShopping' href='javascript:;'>"+appendText+"</a>").appendTo(tEl);
    appendShoppingcarEl.click(appendGoodsHandler);

    //--
    var numcheck = /\d/;
    var qtyInputEl = el.find(".QtyRow input");
    qtyInputEl.keypress(function(e){
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
    }).keyup(function(){
        var val = parseInt( qtyInputEl.val() );
        var maxVal = parseInt( inventoryNumEl.text() );
        if( isNaN(val) ||  val < 1){
            qtyInputEl.val(1);
            return;
        }
        if( val > maxVal ){
            qtyInputEl.val(maxVal);
            return;
        }
    });
    var numStepBtnEls = el.find(".QtyRow a");
    numStepBtnEls.click(function(){
        var val = parseInt( qtyInputEl.val() );
        var maxVal = parseInt( inventoryNumEl.text() );
        if( numStepBtnEls.index(this) == 1){
            val++;
        }else{
            val--;
        }
        if(val>maxVal){val=maxVal;}
        if(val<1){val=1;}
        qtyInputEl.val(val);
    });


    function appendGoodsHandler(){
        if(priceEls.length >0 && sizeIndex == -1){
            alert( sizeWarn );
        }else{
            submitFn( priceEls.eq(sizeIndex).text() ,priceEls.eq(sizeIndex).attr("iid") , parseInt( qtyInputEl.val() ) );
        }
    }
    function favoritesHandler(){
        favoritesFn( priceEls.eq(sizeIndex).text() ,priceEls.eq(sizeIndex).attr("iid")  );
    }
};

$(function(){
    if(!G_enable){return;}
    new EBE_GoodsPreview(2);
    new EBE_ElementGroup();
    new EBE_RecommendPanel();
    new EBE_GoodsParameter("请选择尺寸！",function(size,sizeID,Qty){
        console.log("添加到购物车(尺寸/尺寸ID/数量)",size,sizeID,Qty);
        //请求服务器
        G_shoppingCar.addGoods({
            id:"sc_02",
            imgUrl:"public/source/show/shoppingcar_001.jpg",
            name:"xxxxxx",
            size:"尺码:L",
            price:"usd$99.99",
            num:"数量:1"
        });
    },function(size,sizeID){
        console.log("添加到收藏(尺寸/尺寸ID)",size,sizeID);

    },"加入购物袋1");
});