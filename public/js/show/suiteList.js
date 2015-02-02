var EBE_List = function(totalPage,loadPageHandler,bgUrl){
    var winEl = $(window);
    var el = $(".common_mainPanel .listBlock");
    var loadingEl = $(".common_mainPanel .loadingRow");
    var isLoading = false;
    var page = 1;

    function scroll7ResizeHandler(){
        if( isLoading || page == totalPage){return;}
        var offsetTop = el.offset().top;
        var scrollTop = winEl.scrollTop();
        var viewHeight = winEl.height();
        var bottom = loadingEl.offset().top;
        if( scrollTop + viewHeight > bottom + 20){
            setIsLoading( true );
            loadPageHandler( page + 1 );
        }
    };
    function setIsLoading(val){
        isLoading = val;
        loadingEl.css("visibility",val?"visible":"hidden");
    };
    function appendData(data,newPage){
        var i,item;
        for( i=0; i < data.length ;i++){
            $("<li><a href='"+data[i].url+"'><img class='bg' src='"+bgUrl+"'/><img src='"+data[i].img+"'/></a></li>").appendTo(el);
        }
        page = newPage;
        setIsLoading(false);
    }
    winEl.resize(scroll7ResizeHandler).scroll(scroll7ResizeHandler);
    return {"appendData":appendData};
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

function buildPageData(size){
    var i,arr=[];
    for( i=0; i < size;i++){
        arr.push({"url":"#","img":"public/source/show/suit_list/001.jpg"});
    }
    return arr;
}
$(function(){
    $("body").css({"background":"url("+bgUrl+") no-repeat center top","backgroundSize":"100%"});
    new EBE_PopManager();
    var list = new EBE_List(totalPage,function(page){
        console.log("载入页面数据(页数)",page);
        //请求服务器
        list.appendData( buildPageData(12),page);

    },"public/img/show/holder_351_234.png");
});
