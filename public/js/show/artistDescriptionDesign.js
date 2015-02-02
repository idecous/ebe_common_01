var EBE_VideoHtml5 = function(){
    var videoEl = $(".top_videoBlock video");
    var playBtnEl = $(".top_videoBlock a");

    playBtnEl.click(function(){
        playBtnEl.hide();
        videoEl[0].play();
    });
};
var EBE_VideoSwf = function(swfID){
    var videoPlayerEl = $(".top_videoBlock");
    var bgEl = videoPlayerEl.children("img");
    var playBtnEl = videoPlayerEl.children("a");
    var videoUrl = videoPlayerEl.children("video").attr("src");
    videoPlayerEl.empty().append(bgEl);
    $("<div id='"+swfID+"'></div>").appendTo(videoPlayerEl);
    playBtnEl.appendTo(videoPlayerEl);

    var flashvars = {};
    flashvars.title = "";
    flashvars.description = "";
    flashvars.video = videoUrl;
    var params = {};
    params.quality = "high";
    params.allowscriptaccess = "sameDomain";
    params.allowfullscreen = "true";
    params.allowScriptAccess = "always";
    params.allowFullScreen = "true";
    params.wmode = "opaque";

    var attributes = {};
    attributes.id = swfID;
    attributes.name = swfID;
    attributes.align = "middle";

    swfobject.embedSWF(
        "public/swf/videoPlayer.swf", swfID,
        "100%", "100%", "11.4.0",null,flashvars,params,attributes);
    swfobject.createCSS("#"+swfID, "display:block;position: absolute;left:0;top:0;z-index:0");

    playBtnEl.click(function(){
        playBtnEl.hide();
        $("#"+swfID)[0].firstPlay();
    });
};
var EBE_VideoManager = function(){
    if(!$("<video></video>").prop("canPlayType")){
        new EBE_VideoSwf("swf____ID");
    }else{
        new EBE_VideoHtml5();
    }
};
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
        arr.push({"url":"#","img":"public/source/show/artist_list/001.jpg",
            "nameA":"eve by eve`s_" + countID,
            "nameB":"黑灰色饰翻盖纽扣针织连衣裙",
            "currency":"rmb",
            "price":"2500.00"});
        countID++;
    }
    return arr;
}
$(function(){
    new EBE_VideoManager();
    var list = new EBE_ListManager(totalPage,"public/img/show/artist_list_holder_item_border.png",function(page){
        console.log("载入页面数据(页数)",page);
        //请求服务器
        list.appendData( buildPageData(12),page);
    });
});