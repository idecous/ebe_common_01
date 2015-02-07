if(!Object.create){
    Object.create = function(o){
        function F(){}
        F.prototype = o;
        return new F();
    };
}
var EBE_DataPickerSelectorBase = function(ownerEl,rowEl,type){
    this.ownerEl = ownerEl;
    this.rowEl = rowEl;
    this.type = type;
    this.value = null;
    this.isBlockOpen = false;
};
(function(){
    this.extraBuild = function(){};
    this.build = function(){
        this.el = $("<div class='areaBlock "+ this.type +"'></div>").appendTo(this.rowEl);
        this.borderEl = $("<div class='border'></div>").appendTo(this.el);
        this.leftArrowEl = $("<a href='javascript:;' class='arrow leftArrow'><i></i></a>").appendTo(this.borderEl);
        this.rightArrowEl = $("<a href='javascript:;' class='arrow rightArrow'><i></i></a>").appendTo(this.borderEl);
        this.popBtnEl = $("<a href='javascript:;' class='arrow downArrow'><i></i></a>").appendTo(this.borderEl);
        var inputBorder = $("<div class='inputBorder'></div>").appendTo(this.borderEl);
        this.inputEl = $("<input type='text' readonly='readonly' value=''/>").appendTo(inputBorder);
        this.extraBuild();
    };
}).call(EBE_DataPickerSelectorBase.prototype);

var EBE_DataPickerYearSelector = function(ownerEl,rowEl){
    EBE_DataPickerSelectorBase.call(this,ownerEl,rowEl,"year");
    this.init();
};
EBE_DataPickerYearSelector.prototype = Object.create(EBE_DataPickerSelectorBase.prototype);
(function(){
    this.init = function(){
        this.build();
        var that = this;
        this.leftArrowEl.click(function(){
            that.setPreYearHandler( that.value );
        });
        this.rightArrowEl.click(function(){
            that.setNextYearHandler( that.value );
        });
        this.popBtnEl.click( $.proxy(this.openHandler,this) );
        this.inputEl.click( $.proxy(this.openHandler,this) );
        this.el.mouseleave($.proxy(this.closeHandler,this) );
        this.yearUnitEls.click(function(){
            var unitEl = that.yearUnitEls.eq( that.yearUnitEls.index(this) );
            if( unitEl.text() == that.inputEl.val() ){return;}
            that.closeHandler();
            that.setYearHandler( parseInt(unitEl.text()) );
        });

        this.yearUpArrowEl.click(function(){
            var firstVal = parseInt( that.yearUnitEls.eq(0).text() );
            firstVal = firstVal-12;
            for(var i=0; i < 12 ;i++){
                that.yearUnitEls.eq(i).text( firstVal+i );
            }
        });
        this.yearDownArrowEl.click(function(){
            var lastVal = parseInt( that.yearUnitEls.eq( that.yearUnitEls.length-1 ).text() );
            var firstVal = lastVal+1;
            for(var i=0; i < 12 ;i++){
                that.yearUnitEls.eq(i).text( firstVal+i );
            }
        });
    };
    this.openHandler = function(){
        if( this.isBlockOpen ){return;}
        this.isBlockOpen = true;
        this.yearSelectorEl.show();

    };
    this.closeHandler = function(){
        if( this.isBlockOpen ){
            this.isBlockOpen = false;
            this.yearSelectorEl.hide();
        }
    };
    this.setData = function(val){
        this.value = val;
        this.inputEl.val( val );
        var i,pos=0,isOdd = val%2==1?0:1;
        for(i=0; i < 5+isOdd ;i++){
            this.yearUnitEls.eq(pos).text( val - 5 +i   );
            pos++;
        }
        var curPos = pos-1;
        for( i=pos;i < 12;i++){
            this.yearUnitEls.eq(pos).text(  val + i - curPos  );
            pos++;
        }
    };
    this.extraBuild = function(){
        this.yearSelectorEl = $("<div class='selectorBlock'></div>").appendTo(this.borderEl);
        this.yearUpArrowEl = $("<a class='upArrow' href='javascript:;'><i></i></a>").appendTo(this.yearSelectorEl);
        var contentEl = $("<div></div>").appendTo(this.yearSelectorEl);
        this.yearDownArrowEl = $("<a class='downArrow' href='javascript:;'><i></i></a>").appendTo(this.yearSelectorEl);
        for(var i=0;i<12;i++){
            $("<a class='unit' href='javascript:;'></a>").appendTo(contentEl);
        }
        this.yearUnitEls = contentEl.find(".unit");
    };

}).call(EBE_DataPickerYearSelector.prototype);
var EBE_DataPickerMonthSelector = function(ownerEl,rowEl,monthNames){
    EBE_DataPickerSelectorBase.call(this,ownerEl,rowEl,"month");
    this.monthNames = monthNames;
    this.init();
};
EBE_DataPickerMonthSelector.prototype = Object.create(EBE_DataPickerSelectorBase.prototype);
(function(){
    this.init = function(){
        this.build();
        var that = this;
        this.leftArrowEl.click(function(){
            that.setPreMonthHandler( that.value );
        });
        this.rightArrowEl.click(function(){
            that.setNextMonthHandler( that.value );
        });
        this.popBtnEl.click( $.proxy(this.openHandler,this) );
        this.inputEl.click( $.proxy(this.openHandler,this) );
        this.el.mouseleave($.proxy(this.closeHandler,this) );
        this.monthUnitEls.click(function(){
            that.closeHandler();
            that.setMonthHandler( that.monthUnitEls.index(this) );
        });
    };
    this.openHandler = function(){
        if( this.isBlockOpen ){return;}
        this.isBlockOpen = true;
        this.monthSelectorEl.show();

    };
    this.closeHandler = function(){
        if( this.isBlockOpen ){
            this.isBlockOpen = false;
            this.monthSelectorEl.hide();
        }
    };
    this.setData = function(val){
        this.value = val;
        this.inputEl.val( val+1 );
    };
    this.extraBuild = function(){
        this.monthSelectorEl = $("<div class='selectorBlock'></div>").appendTo(this.borderEl);
        var contentEl = $("<div></div>").appendTo(this.monthSelectorEl);
        for(var i=0;i<12;i++){
            $("<a class='unit' href='javascript:;'>"+this.monthNames[i]+"</a>").appendTo(contentEl);
        }
        this.monthUnitEls = contentEl.find(".unit");
    };
}).call(EBE_DataPickerMonthSelector.prototype);

var EBE_DataPickerDateSelectorCell = function(container,index){
    this.container = container;
    this.index = index;
    this.date = null;
    this.isMain = false;
    this.isNow = false;
    this.init();
};
(function(){
    this.init = function(){
        this.build();
    };
    this.setData = function(val,isMain){
        this.date = val;
        this.el.text( val.getDate() );
        this.isMain = isMain;
        if( isMain ){
            this.el.addClass("main");
        }else{
            this.el.removeClass("main");
        }
        this.setNow(false);
    };
    this.setNow = function(val){
        this.isNow = val;
        if( val ){
            this.el.addClass("now");
        }else{
            this.el.removeClass("now");
        }
    };
    this.build = function(){
        this.el = $("<a class='cell' href='javascript:;'></a>").appendTo(this.container);
    };
}).call(EBE_DataPickerDateSelectorCell.prototype);

var EBE_DataPickerDateSelector = function(ownerEl,weekNames){
    this.ownerEl = ownerEl;
    this.weekNames = weekNames;
    this.init();
};
(function(){
    this.init = function(){
        this.build();
        var that = this;
        this.cellEls.click(function(){
            var tIndex  = that.cellEls.index(this);
            that.setDateHandler(that.dateEls[tIndex].date );
        });
    };
    this.setCurrentDate = function(val){
        this.curYear = val.getFullYear();
        this.curMonth = val.getMonth();
        this.curDate = val.getDate();
    };
    this.setData = function(val){
        this.value = new Date(val.getFullYear(),val.getMonth(),val.getDate() );
        this.firstDate = new Date(val.getFullYear(),val.getMonth(),1 );
        this.lastDate = new Date(val.getFullYear(),val.getMonth()+1,0 );
        this.preMonthLastDate = new Date(val.getFullYear(),val.getMonth(),0 );
        var nextYear = val.getFullYear();
        var nextMonth = val.getMonth();
        if(nextMonth==11){
            nextYear++;
            nextMonth = 0;
        }else{
            nextMonth++;
        }
        this.nextMonthFirstDate = new Date(nextYear,nextMonth,1 );
        this.update();
    };
    this.update = function(){
        var preLastday = this.preMonthLastDate.getDay();
        var preLastDate = this.preMonthLastDate.getDate();
        var preLastYear = this.preMonthLastDate.getFullYear();
        var preLastMonth = this.preMonthLastDate.getMonth();

        var curYear = this.value.getFullYear();
        var curMonth = this.value.getMonth();
        var curLastDate = this.lastDate.getDate();

        var i,cell,date,pos = 0,firstIndex;
        for(i=0; i <= preLastday;i++){
            date = new Date( preLastYear,preLastMonth, preLastDate - preLastday + i );
            this.dateEls[pos].setData( date ,false);
            pos++;
        }
        firstIndex = pos;
        for(i=0; i < curLastDate;i++){
            date = new Date( curYear,curMonth, i+1 );
            this.dateEls[pos].setData( date ,true);
            pos++;
        }
        var nextDay = this.nextMonthFirstDate.getDay();
        var nextYear = this.nextMonthFirstDate.getFullYear();
        var nextMonth = this.nextMonthFirstDate.getMonth();

        for( i=nextDay; i < 7;i++){
            date = new Date( nextYear,nextMonth,  i + 1 - nextDay);
            this.dateEls[pos].setData( date ,false);
            pos++;
        }
        if( curYear==this.curYear && curMonth==this.curMonth ){
            this.dateEls[ firstIndex+ this.curDate -1].setNow(true);
        }
    };

    this.build = function(){
        this.el = $("<div class='weekDateBlock'></div>").appendTo(this.ownerEl);
        var weekRowEl = $("<ul class='weekRow'></ul>").appendTo(this.el);
        var i,k,rowEl,cellEl,arr;
        for( i=0; i<this.weekNames.length;i++ ){
            $("<li>"+this.weekNames[i]+"</li>").appendTo(weekRowEl);
        }
        this.dateRowEls = [];
        this.dateEls = [];
        for(i=0;i<6;i++){
            rowEl = $("<div class='dateRow'></div>").appendTo(this.el);
            this.dateRowEls.push( rowEl );
            for(k=0;k<7;k++){
                cellEl = new EBE_DataPickerDateSelectorCell(rowEl,this.dateEls.length);
                this.dateEls.push(cellEl);
            }
        }
        this.cellEls = this.el.find(".cell");
    };
}).call(EBE_DataPickerDateSelector.prototype);

var EBE_DataPicker = function(el,monthNames,weekNames,todayText){
    var currentDate = new Date();
    var isOpen = false;
    var inputEl = $("<input name='aaa' type='text' class='dateInput' readonly='readonly'/>").appendTo(el);
    var infoEl = $("<span class='info'>YYYY/MM/DD</span>").appendTo(el);
    var popBtnEl = $("<a href='javascript:;' class='popBtn'></a>").appendTo(el);
    var popBlockEl = $("<div class='popBlock'></div>").appendTo(el);
    var ymRowEl = $("<div class='YM_Row'></div>").appendTo(popBlockEl);
    var yearSelector = new EBE_DataPickerYearSelector(popBlockEl,ymRowEl);
    var monthSelector = new EBE_DataPickerMonthSelector(popBlockEl,ymRowEl,monthNames);
    var dataPickerDateSelector = new EBE_DataPickerDateSelector(popBlockEl,weekNames);
    var bottomBlockEl = $("<div class='bottomBlock'></div>").appendTo(popBlockEl);
    var todayBtnEl = $("<a href='javascript:;'>"+todayText+"</a>").appendTo(bottomBlockEl);

    yearSelector.setPreYearHandler = function(yearVal){
        setDate( new Date(yearVal-1,monthSelector.value,1) );
    };
    yearSelector.setNextYearHandler = function(yearVal){
        setDate( new Date(yearVal+1,monthSelector.value,1) );
    };
    yearSelector.setYearHandler = function(yearVal){
        setDate( new Date(yearVal,monthSelector.value,1) );
    };
    monthSelector.setPreMonthHandler = function(monthVal){
        if( monthVal == 0 ){
            setDate( new Date(yearSelector.value-1,11,1) );
        }else{
            setDate( new Date(yearSelector.value,monthVal-1,1) );
        }
    };
    monthSelector.setNextMonthHandler = function(monthVal){
        if( monthVal == 11 ){
            setDate( new Date(yearSelector.value+1,0,1) );
        }else{
            setDate( new Date(yearSelector.value,monthVal+1,1) );
        }
    };
    monthSelector.setMonthHandler = function(monthVal){
        setDate( new Date(yearSelector.value,monthVal,1) );
    };
    dataPickerDateSelector.setDateHandler = function(dateVal){
        currentDate = dateVal;
        dataPickerDateSelector.setCurrentDate(dateVal);
        setDate( dateVal );

        infoEl.hide();
        inputEl.val( formatDate(dateVal) );
        closePopHandler();
    };
    todayBtnEl.click(function(){
        currentDate = new Date();
        dataPickerDateSelector.setCurrentDate(currentDate);
        setDate( currentDate );
        infoEl.hide();
        inputEl.val( formatDate(currentDate) );
        closePopHandler();
    });
    el.mousedown(function(){
        if( isOpen ){return;}
        isOpen = true;
        popBlockEl.show();
        return false;
    }).mouseleave(closePopHandler);

    function closePopHandler(){
        if( !isOpen ){return;}
        isOpen = false;
        popBlockEl.hide();
    }
    function formatDate(val){
        return val.getFullYear()+"/"+(val.getMonth()+1)+"/"+val.getDate();
    }
    function setDate(val){
        yearSelector.setData( val.getFullYear() );
        monthSelector.setData( val.getMonth() );
        dataPickerDateSelector.setData( val );
    }
    dataPickerDateSelector.setCurrentDate(currentDate);
    setDate( currentDate );
};
var EBE_AppointmentModule = function( type ){
    var openBtn = $(".comm_appointmentBlock ."+type);
    if(openBtn.length==0){return;}
    var windEl = $(window);
    var bodyEl = $("body");
    var eMailReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    var isPop = false;

    var popWinEl = $(".comm_appointmentPopWindow");
    var blockEls = popWinEl.find(".block");
    var blockEl = popWinEl.find(".block."+type);
    if(type=="en"){
        new EBE_DataPicker(
            blockEl.find(".com_dateSelector"),
            ["January","February","March","April","May","June",
                "July","August","September","October","November","December"],
            ["Mon","Tue","Wed","Thur","Fri","Sat","Sun"],
            "Today"
        );
    }else{
        new EBE_DataPicker(
            blockEl.find(".com_dateSelector"),
            ["一月","二月","三月","四月","五月","六月",
                "七月","八月","九月","十月","十一月","十二月"],
            ["一","二","三","四","五","六","七"],
            "今日"
        );
    }
    var closeBtnEl = blockEl.find(".closeBtn,.topBar>a");
    var formEl = blockEl.find("form");
    var borderEl = formEl.find(">div>div>.inputBorder");
    var inputEls = borderEl.find(">input,>select");

    openBtn.click(function(){
        isPop = true;
        blockEl.addClass("show");
        popWinEl.addClass("show");
        updateView();
    });
    closeBtnEl.click(function(){
        popWinEl.removeClass("show");
        blockEls.removeClass("show");
    });
    function updateView(){
        if( !isPop ){return;}
        blockEl.css({"left": (windEl.width()-blockEl.outerWidth())/2,
            "top":(windEl.height()-blockEl.outerHeight())/2});
    };
    windEl.resize(updateView);
    formEl.submit(function(){
        var result = true;
        for(var i=0; i < 7;i++){
            if( $.trim( inputEls.eq(i).val() ) == "" ){
                result = false;
                borderEl.eq(i).addClass("warn");
            }else{
                borderEl.eq(i).removeClass("warn");
            }
        }
        if( eMailReg.test(  $.trim( inputEls.eq(7).val()) ) ){
            borderEl.eq(i).removeClass("warn");
        }else{
            result = false;
            borderEl.eq(i).addClass("warn");
        }
        return result;
    });
};

var EBE_AppointmentManager = function(){
    new EBE_AppointmentModule("zh");
    new EBE_AppointmentModule("en");
};

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
var EBE_LetterNews = function(){
    var el = $(".common_interaction .letterNewsBlock");
    if( el.length == 0){
        return;
    }
    var eMailReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    var inputEl = el.find("input[type='text']").val("");
    var spanEl = el.find("span");
    var formEl = el.find("form");
    inputEl.focus(function(){
        spanEl.hide();
    }).blur(function(){
        if(!eMailReg.test( $.trim(inputEl.val() ) ) ){
            spanEl.show();
            inputEl.val("");
        }
    });
    formEl.submit(function(){
        if(!eMailReg.test( $.trim(inputEl.val() ) ) ){
            return false;
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

    new EBE_AppointmentManager();
    new EBE_MobileMenu();
    new EBE_TopUserSearch();
    new EBE_TopMobileSearch();
    new EBE_CategoryNavBarManager();
    new EBE_LetterNews();

    G_shoppingCar = new EVE_ShoppingCar(function(id,size){
        console.log("删除购物车商品(商品ID/尺寸)",id,size);
        //请求服务器
    },"删除");

});