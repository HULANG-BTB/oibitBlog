(function(window){
    
    // 博客描述 多余显示 防止CSS样式不可用...
    var blogTextList = $('.blogtext a');
    for (var i = blogTextList.length - 1; i >= 0; i--) {
        var textContent = blogTextList[i].textContent;
        if ( textContent.length > 150) {
            textContent = textContent.substring(0,71) + "...";
            $(blogTextList[i]).html(textContent);
        } else {
            textContent += '...';
            $(blogTextList[i]).html(textContent);
        }
    }


    // sidebar 二维码悬浮 滚动
    $(document).on('mousewheel DOMMouseScroll', function(e) {  
        var cur_top = $(window).scrollTop();
        var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
        if (cur_top > 770 && delta == -1) {
            $('.donation').addClass('float');
        }
        if( cur_top < 1000 && delta == 1) {
            $('.donation').removeClass('float');
        }
        var back_to_top = $('.container .top');
        ( cur_top > 480 ) ? back_to_top.addClass('visible') : back_to_top.removeClass('visible fade-out');
        ( cur_top > 1200 ) ? back_to_top.addClass('fade-out') : null;
        return true;  
    });

    // 导航栏 - 手机端
    $(window).width() <= 768 && $('.nav ul').height() > ($(window).height()-50) ? $('.nav ul').css('height', ($(window).height()-50)+'px') : null; // 手机端下拉 滑动菜单
    $('.menu>.logo>.icon').click(function() {
        $(this).toggleClass("icon-click icon-out");
        $(".menu>.logo~ul").slideToggle(250);
    });
    
    // 全屏浏览
    $(".menu>.logo>a").click(function() {
      $(".container").addClass('bg-grey').fullScreen();
    });

    // 屏蔽右键
    // $(document).bind("contextmenu",function(e){
    // 	console.log(e);
    //     return false;
    // });
    // 
    
    $(window).resize(function(){
       var menuWidth = $("div.menu").width();
       var ulMaxWidth = menuWidth - 40 - $(".logo").width();
       $(".menu ul").width(ulMaxWidth);
    });

})(window);