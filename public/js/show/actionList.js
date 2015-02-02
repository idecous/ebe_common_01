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

$(function(){
    new EBE_TopActionManager();
});