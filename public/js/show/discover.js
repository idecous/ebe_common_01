var EBE_ListManager = function(totalPage,bgImg,loadPageHandler){
    var winEl = $(window);
    var el = $(".common_mainPanel .listBlock ul");
    var loadingEl = $(".common_mainPanel .loadingRow");
    var isLoading = false;
    var page = 1;

    scroll7ResizeHandler = function(){
        if( isLoading || page == totalPage){return;}
        var offsetTop = el.offset().top;
        var scrollTop = winEl.scrollTop();
        var viewHeigth = winEl.height();
        var bottom = loadingEl.offset().top;
        if( scrollTop + viewHeigth > bottom + 20){
            setIsLoading( true );
            loadPageHandler( page + 1 );
        }
    };
    setIsLoading = function(val){
        isLoading = val;
        loadingEl.css("visibility",val?"visible":"hidden");
    };
    function appendData(data,newPage){
        var i,item;
        for( i=0; i < data.length ;i++){
            $("<li>"+
            '<img class="bg" src="'+bgImg+'" />'+
            '<a href="'+ data[i].url+'">'+
            '<div class="border"><img src="'+data[i].img+'"/></div>'+
            '<div class="descriptBlock"><h3>'+data[i].nameA
            +'</h3><h4>'+data[i].nameB+'</h4><h1 class="enFontFamily"><span>'
            +'</span><b>'+data[i].price+'</b></h>'+
            +"</div></a></li>").appendTo(el);
        }
        page = newPage;
        setIsLoading(false);
    }
    winEl.resize(scroll7ResizeHandler).scroll(scroll7ResizeHandler);

    return {"appendData":appendData};
};

var countID = 600;
function buildPageData(size){
    var i,arr=[];
    for( i=0; i < size;i++){
        arr.push({"url":"#","img":"public/source/show/discover/i_001.jpg",
            "nameA":"eve by eve`s_" + countID,
            "nameB":"黑灰色饰翻盖纽扣针织连衣裙",
            "currency":"rmb",
            "price":"2500.00"});
        countID++;
    }
    return arr;
}
var EBE_IE8Manager = function(){
    if( $.support.leadingWhitespace ){return;}
    var liEls = $(".keywordGroup ul li");

    liEls.filter(":nth-child(3n+1)").addClass("C3n1");
    liEls.filter(":nth-child(3n+2)").addClass("C3n2");
    liEls.filter(":nth-child(3n+3)").addClass("C3n3");
};
$(function(){
    new EBE_IE8Manager();
    var list = new EBE_ListManager(totalPage,"public/img/show/discover_holder_item_border.png",function(page){
        console.log("载入页面数据(页数)",page);
        //请求服务器
        list.appendData( buildPageData(12),page);
    });
});