$(function(){
    $('.p-con').css("minHeight",$(window).height()-120+'px')
	// 头部下拉
	 $(".drop-item").hover(function () {
        $(this).addClass('drop-on');
     }, function () {
        $(this).removeClass('drop-on');
     })
     //二级导航展开隐藏
     $(".sub-menu ul > .sub-menu-a >a:not(.no-sub)" ).on("click",function(){
        $(this).toggleClass("open")
        var self = this;
        $(this).siblings(".sub-menu-b").toggle(0,function(){
            if(this.style.display=='none' && $(this).find("a").hasClass("open")){
               $(self).addClass("current")
            }else{
               $(self).removeClass("current")
            }
        });
     })
    //收起展开左侧菜单
    $(".side-bar-coll").on("click",function(){
        $("body").toggleClass("p-sidebar-closed")
    })
    //收起展开二级 菜单
    $("#menu-switch").on("click",function(){

        $(".p-con").toggleClass("sub-menu-closed") 
    }) 
    $(".sub-menu-b li a,.sub-menu ul .no-sub").on("click", function () {
        $(".sub-menu-a a.current").removeClass("current")
        $(this).parents('.sub-menu').find("a").removeClass("open");
        $(this).addClass("open");
    });
    /*$(".openurl ").on("click", function () {
        $(".sub-menu-a a.current").removeClass("current")
        $(this).parents('.sub-menu').find("a").removeClass("open");
        $(this).addClass("open");
    });*/
})
    

//设置菜单高度
function setMenuheight(){
	var windh = $(window).height();
    var bodyh = $("body").height();
    var barh = bodyh;
    if (bodyh < windh) barh = windh;
    $(".p-sidebar").css('height', barh + 'px');
    $(".sub-menu").css('height', (barh-80) + 'px');
}
//滚动窗口触发菜单高度调整
$(window).scroll(function () {
    setMenuheight()
});
$(window).resize(function () {
    setMenuheight()
});