var EBE_ModuleGroup = function(){
    $(".common_rightPanel .moduleGroup").css("visibility","visible");
    var navBarEls = $(".common_rightPanel .shortcutBar a");
    var moduleEls = $(".common_rightPanel .moduleGroup .module");

    moduleEls.each(function(index){
        var moduleEl = moduleEls.eq(index);
        var itemEls =  moduleEl.children(".item");
        var extraCount = 3 - itemEls.length % 3;
        for(var i=0; i < extraCount;i++){
            $("<div class='item'></div>").appendTo(moduleEl);
        }
        $("<div class='common_justifyFix'></div>").appendTo(moduleEl);
    });

    navBarEls.click(function(){
        var tIndex = navBarEls.index(this);
        var navBtnEl = navBarEls.eq(tIndex);
        if( navBtnEl.hasClass("current") ){
            return;
        }
        navBarEls.removeClass("current");
        moduleEls.removeClass("current");
        navBarEls.eq(tIndex).addClass("current");
        moduleEls.eq(tIndex).addClass("current");
    });
};

var EBE_DeleteOrderManager = function(delHandler){
    var delBtnEls = $(".common_rightPanel table a[class='del']");
    delBtnEls.each(function(index){
        var btnEl = delBtnEls.eq(index);
        btnEl.data("url",btnEl.attr("href"));
        btnEl.attr("href","javascript:;");
    });
    delBtnEls.click(function(){
        var btnEl = delBtnEls.eq( delBtnEls.index(this) );
        var orderIDColEl =  btnEl.parents("tr").children("td:eq(0)");
        if( delHandler( $.trim( orderIDColEl.text() ) )){
            window.location.href = btnEl.data("url");
        }
    });
};

var EBE_Confirmation = function(confirmationHandler){
    var confirmationBtnEls = $(".common_rightPanel table a[class='confirmation']");
    confirmationBtnEls.each(function(index){
        var btnEl = confirmationBtnEls.eq(index);
        btnEl.data("url",btnEl.attr("href"));
        btnEl.attr("href","javascript:;");
    });
    confirmationBtnEls.click(function(){
        var btnEl = confirmationBtnEls.eq( confirmationBtnEls.index(this) );
        var orderIDColEl =  btnEl.parents("tr").children("td:eq(0)");
        if( confirmationHandler( $.trim( orderIDColEl.text() ) )){
            window.location.href = btnEl.data("url");
        }
    });
};
var EBE_Remind = function(remindHandler){
    var remindBtnEls = $(".common_rightPanel table a[class='remind']");
    remindBtnEls.each(function(index){
        var btnEl = remindBtnEls.eq(index);
        btnEl.data("url",btnEl.attr("href"));
        btnEl.attr("href","javascript:;");
    });
    remindBtnEls.click(function(){
        var btnEl = remindBtnEls.eq( remindBtnEls.index(this) );
        var orderIDColEl =  btnEl.parents("tr").children("td:eq(0)");
        if( remindHandler( $.trim( orderIDColEl.text() ) )){
            window.location.href = btnEl.data("url");
        }
    });
};

$(function(){
    new EBE_ModuleGroup();
    new EBE_DeleteOrderManager(function(orderID){
        return ( confirm("是否删除订单："+orderID+"?") );
    });
    new EBE_Confirmation(function(orderID){
        return ( confirm("是否确认订单："+orderID+" 收货?") );
    });
    new EBE_Remind(function(orderID){
        return ( confirm("订单："+orderID+" 发货提醒?") );
    });
});
