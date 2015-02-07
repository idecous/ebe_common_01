if(!Object.create){
    Object.create = function(o){
        function F(){}
        F.prototype = o;
        return new F();
    };
}
var EVE_ShoppingCarItem = function(deleteHandler,label01){
    this.deleteHandler = deleteHandler;
    this.label01 = label01;
};
(function(){
    this.init = function(){
        var that = this;
        this.delBtnEl.click(function(){
            that.deleteHandler(that);
        });
    };
    this.buildByEl = function(el){
        this.el = el;
        this.id = el.attr("iid");
        this.paramEl = el.find(".infoBlock>div");
        this.name = $.trim( this.paramEl.eq(0).text() );
        var tStr = this.paramEl.eq(3).text();
        this.count = parseInt( tStr.substr( tStr.lastIndexOf(":")+1 )  );
        tStr = this.paramEl.eq(2).text();

        var charCode,fIndex = -1;
        for(var i=0; i < tStr.length;i++){
            charCode = tStr.charCodeAt(i);
            if( charCode >= 48 && charCode<=57){
                fIndex = i;
                break;
            }
        }
        this.price = parseFloat( tStr.substr(fIndex).replace(",","") );
        this.unit =  tStr.substr(0,fIndex);

        tStr = this.paramEl.eq(1).text();
        this.size = $.trim( tStr.substr(tStr.lastIndexOf(":") + 1 ) );
        this.delBtnEl = el.find(".infoBlock>a");
        this.init();
    };
    this.buildByData = function(data){
        this.id = data.id;
        this.name = $.trim( data.name );
        var tStr = data.size;
        this.size = tStr.substr( tStr.lastIndexOf(":")+1 ) ;
        tStr = data.price;
        var charCode,fIndex = -1;
        for(var i=0; i < tStr.length;i++){
            charCode = tStr.charCodeAt(i);
            if( charCode >= 48 && charCode<=57){
                fIndex = i;
                break;
            }
        }
        this.price = parseFloat( tStr.substr(fIndex).replace(",","") );
        this.unit =  tStr.substr(0,fIndex);

        tStr = data.num;
        this.count = parseInt( tStr.substr( tStr.lastIndexOf(":")+1 ) );

        this.el = $("<li iid='"+this.id+"'></li>");
        var t01El =$("<div class='imgBlock'></div>").appendTo(this.el);
        $("<img src='"+data.imgUrl +"' />").appendTo(t01El);
        t01El = $("<div class='infoBlock'>").appendTo(this.el);

        $("<div>"+ data.name+"</div>").appendTo( t01El );
        $("<div>"+ data.size+"</div>").appendTo( t01El );
        $("<div class='price'>"+ data.price+"</div>").appendTo( t01El );
        $("<div>"+ data.num+"</div>").appendTo( t01El );
        this.delBtnEl = $("<a href='javascript:;'>"+this.label01+"</a>").appendTo( t01El );
        this.paramEl = this.el.find(".infoBlock>div");

        this.init();
    };
    this.addSameGoods = function(data){
        var name = $.trim( data.name );
        var tStr = data.size;
        var size = tStr.substr( tStr.lastIndexOf(":")+1 ) ;
        tStr = data.price;
        var charCode,fIndex = -1;
        for(var i=0; i < tStr.length;i++){
            charCode = tStr.charCodeAt(i);
            if( charCode >= 48 && charCode<=57){
                fIndex = i;
                break;
            }
        }
        var price = parseFloat( tStr.substr(fIndex).replace(",","") );
        this.unit =  tStr.substr(0,fIndex);

        tStr = data.num;
        var count = parseInt( tStr.substr( tStr.lastIndexOf(":")+1 )  );
        if( name == this.name && data.id == this.id &&  size == this.size && price == this.price ){
            this.count += count;
            tStr = this.paramEl.eq(3).text();
            tStr = tStr.substring( 0, tStr.lastIndexOf(":") +1) + " " + this.count;
            this.paramEl.eq(3).text(tStr);
            return true;
        }
        return false;
    };
}).call(EVE_ShoppingCarItem.prototype);

var EVE_ShoppingCar = function(deleteHandler,label01){
    var el = $(".comm_top_userGroup .shoppingcar");
    var popWinEl = el.find(".popWin");

    el.find(".topInfoPanel a").click(function(){
        popWinEl.removeClass("open");
    });
    el.mouseenter(function(){
        popWinEl.addClass("open");
    }).mouseleave(function(){
        popWinEl.removeClass("open");
    });
    var scrollTopEl = $(".mobileSide .scrollTop");
    var html7BodyEl = $("html, body");
    scrollTopEl.click(function(){
        html7BodyEl.animate({ scrollTop: 0 }, "slow");
    });
    var sideInfoPointEl = $(".mobileSide .toShoppingcarPage i");

    var count01El = el.find(">div>span");
    var count02El = el.find(".popWin .topInfoPanel>span>b");
    var emptyInfoEl =  el.find(".popWin .borderContent .empty");

    var listContainerEl = el.find(".popWin .borderContent .listContainer");
    var listEl = listContainerEl.find("ul");

    var totalPriceRowEl = el.find(".popWin .borderContent .statsRow");
    var totalPriceUnitEl = totalPriceRowEl.find("b:eq(0)");
    var totalPriceEl = totalPriceRowEl.find("b:eq(1)");
    var toPayBtnEl = el.find(".popWin .borderContent .toPay");

    var items = [];
    var i,item,tLiEl = listEl.find("li");
    for( i=0; i < tLiEl.length ;i++){
        item = new EVE_ShoppingCarItem(delItemHandler,label01);
        item.buildByEl( tLiEl.eq(i) );
        items.push( item );
    }
    function delItemHandler(item){
        var index = $.inArray( item , items);
        if(index==-1){return;}
        items.splice(index,1);
        item.el.remove();
        deleteHandler( item.id ,item.size );
        popWinEl.removeClass("open");
        update();
    }
    function update(){
        if( items.length == 0 ){
            emptyInfoEl.show();
            count01El.text("0");
            count02El.text("0");
            listContainerEl.hide();
            totalPriceRowEl.hide();
            toPayBtnEl.hide();
            sideInfoPointEl.hide();
            return;
        }
        var i,item,gCount = 0,gPrice=0;
        for( i=0; i < items.length;i++ ){
            gCount += items[i].count;
            gPrice += items[i].count * items[i].price;
        }
        if( items.length > 0){
            totalPriceUnitEl.text(  items[0].unit + " " );
        }else{
            totalPriceUnitEl.text("");
        }

        if( items.length < 4 ){
            listContainerEl.height( items.length * 116 -1);
            listContainerEl.removeClass("scroll");
        }else{
            listContainerEl.height( 3 * 115 );
            listContainerEl.addClass("scroll");
        }
        count01El.text( items.length );
        count02El.text( items.length );
        var formatPrice = gPrice.toFixed(2);
        var aArr = formatPrice.split(".");
        var pHolderCount = 3 - aArr[0].length%3;
        var pHolderStr = "";
        for(i=0; i < pHolderCount;i++){
            pHolderStr += " ";
        }
        var pStr = pHolderStr + aArr[0];
        var pFragmentCount = pStr.length/3;
        var pArr = [];
        for(i=0; i < pFragmentCount;i++){
            pArr.push(  pStr.substr( i*3,3) );
        }
        var lStr = aArr[1];
        if( lStr.length == 1){ lStr+="0"}

        totalPriceEl.text( $.trim( pArr.join(",") +"." + lStr ) );

        sideInfoPointEl.show();
        emptyInfoEl.hide();
        listContainerEl.show();
        totalPriceRowEl.show();
        toPayBtnEl.show();
    }
    function addGoods( data ){
        var i,item,hasSame = false;
        for(i=0; i < items.length;i++){
            item = items[i];
            hasSame = item.addSameGoods( data);
            if( hasSame ){ break;}
        }
        if( !hasSame ){
            item = new EVE_ShoppingCarItem(delItemHandler,label01);
            item.buildByData( data );
            listEl.append(item.el);
            items.push( item );
        }
        update();
    }
    update();
    return {"addGoods":addGoods};
};
var EBE_TopUserSearch = function(){
    var el = $(".comm_top_userGroup .search");
    var popWinEl = el.find(".popWin");
    var inputEl = el.find("input[type='text']");
    var formEl = el.find("form");
    var infoEl = el.find(".info");
    var borderEl = el.find(".inputBlock");
    var closeBtnEl = el.find(".close");

    function updateInfo(){
        if( $.trim( inputEl.val() ) == ""){
            infoEl.show();
        }else{
            infoEl.hide();
        }
    }
    inputEl.blur(updateInfo).focus(function(){
        infoEl.hide();
    });
    el.mouseenter(function(){
        popWinEl.addClass("show");
        borderEl.removeClass("warn");
    }).mouseleave(function(){
        popWinEl.removeClass("show");
    });
    formEl.submit(function(){
        if( $.trim( inputEl.val() ) == ""){
            borderEl.addClass("warn");
            return false;
        }
        borderEl.removeClass("warn");
    });
    closeBtnEl.click(function(){
        popWinEl.removeClass("show");
    });
    updateInfo();
};
var EBE_TopMobileSearch = function(){
    var openBtnEl = $(".comm_mobile_searchBtn");
    var el = $(".comm_mobile_searchBlock ");
    var formEl = el.find("form");
    var inputEl = el.find("input");
    var clearEl = el.find("i");
    var returnBtnEl =  el.find("a");
    var borderEl = el.find(".border");

    openBtnEl.click(function(){
        openBtnEl.css("visibility","hidden");
        el.css("visibility","visible");
        borderEl.removeClass("warn");
    });
    clearEl.click(function(){
        inputEl.val("");
    });
    returnBtnEl.click(function(){
        openBtnEl.css("visibility","visible");
        el.css("visibility","hidden");
    });
    formEl.submit(function(){
        if( $.trim( inputEl.val() ) == ""){
            borderEl.addClass("warn");
            return false;
        }else{
            borderEl.removeClass("warn");
        }
    });
};
var EBE_MobileMenu = function(){
    var menuEl = $(".common_mobileNav");
    if( menuEl.length == 0 ){return;}
    var menuOpenBtnEl = $(".common_mobile_topMenuBtn .open") ;
    var menuCloseBtnEl = $(".common_mobile_topMenuBtn .close");
    var pageContentEl = $(".common_normalContent");
    var fixedEl = $(".header .fixed");

    menuCloseBtnEl.hide();
    function closeHandler(){
        menuOpenBtnEl.show();
        menuCloseBtnEl.hide();
        menuEl.css("left","-100%");
        pageContentEl.removeClass("mobileOpen");
        fixedEl.removeClass("common_fixedWidth");
    }
    menuOpenBtnEl.click(function(){
        menuOpenBtnEl.hide();
        menuCloseBtnEl.show();
        menuEl.css("left",0);
        pageContentEl.addClass("mobileOpen");
        fixedEl.addClass("common_fixedWidth");

        pageContentEl.one("mousedown",closeHandler);
    });
};
var EBE_MobileToTop = function(){
    var el = $(".common_mobile_toTop");
    if( el.length == 0 ){return;}
    var html7BodyEl = $("html, body");
    var winEl = $(window);
    el.click(function(){
        html7BodyEl.animate({ "scrollTop": 0 }, "slow");
    });
    winEl.resize(scroll7ResizeHandler);
    winEl.scroll(scroll7ResizeHandler);

    function scroll7ResizeHandler(){
        var scrollTop = winEl.scrollTop();
        if( scrollTop < 5){
            el.removeClass("common_mobile_toTop_show");
        }else{
            el.addClass("common_mobile_toTop_show");
        }
    }
    scroll7ResizeHandler();
};
var EBE_HeightPlaceholderManager = function(){
    var winEl = $(window);
    var bodyEl = $("body");
    var screenHeightPlaceholderEl = $("<div class='common_screenHeightPlaceholder'></div>");
    $(".footer").before(screenHeightPlaceholderEl);

    function resizeHandler(){
        var tH = winEl.height() - (bodyEl.height()-screenHeightPlaceholderEl.height());
        if(tH < 0){
            screenHeightPlaceholderEl.height(0);
        }else{
            screenHeightPlaceholderEl.height(tH);
        }
    }
    winEl.resize( resizeHandler );
    resizeHandler();
};

var EBE_FooterManager = function(){
    if( !window.isCommon_footer ){return;}
    $(".footer .common_centerBlock").removeClass("common_centerBlock").addClass("common_footerCenterBlock");
};
var EBE_CategoryNavBarManager = function(){
    var el = $(".common_mainNavBar");
    if( el.length == 0 ){return;}
    var categoryBlockEls = el.find(".categoryBlock");
    categoryBlockEls.each(function(index){
        var categoryBlockEl = categoryBlockEls.eq(index);
        var aEls = categoryBlockEl.find("a");
        categoryBlockEl.empty();
        var i;
        for( i=0; i < 5;i++){
            $("<li><div class='border'></div></li>").appendTo(categoryBlockEl);
        }
        var borderEls = categoryBlockEl.find(".border");
        for( i=0; i < aEls.length;i++ ){
            aEls.eq(i).appendTo(  borderEls.eq( i%5)  );
        }
    });
};

var G_enable = true;
var G_shoppingCar = null;
$(function(){
    var bodyEl = $("body").css("visibility","visible");
    if(!$.support.style && !$.support.tbody ){
        bodyEl.empty().append( $("<h1 style='text-align: center;margin-top: 100px;'>请使用IE8以上现代浏览器查看本站！</h1>") );
        G_enable = false;
        return;
    }
    new EBE_FooterManager();
    new EBE_TopUserSearch();
    new EBE_TopMobileSearch();
    new EBE_MobileMenu();
    new EBE_MobileToTop();
    new EBE_HeightPlaceholderManager();
    new EBE_CategoryNavBarManager();

    G_shoppingCar = new EVE_ShoppingCar(function(id,size){
        console.log("删除购物车商品(商品ID/尺寸)",id,size);
        //请求服务器
    },"删除");

});