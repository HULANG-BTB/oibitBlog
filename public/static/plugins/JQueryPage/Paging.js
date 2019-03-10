(function($,window,document){
    function Paging(elem,options) {
        this.elem = elem;
        this.options = {
            pageNo: options.initPageNo||1, // 初始页码
            totalPages: options.totalPages||1, // 总页数
            slideSpeed: options.slideSpeed||0, // 滑动速度
            callback: options.callback||function(){ } // 回调函数
        };
        this.init();
    }
    Paging.prototype = {
        constructor:Paging,
        init: function() {
            this.createDom();
            this.bindEvents();
        },
        createDom: function() {
            var elem = this.elem;
            var options = this.options;
            var Prev = "";
            var Next = "";
            var First = "";
            var Last = "";
            var Center = "";
            var Html = "";
            options.pageNo == 1 ? Prev = '<span class="prev-page button disabled" data-hover="&lt;">&lt;</span>'  : Prev = '<span class="prev-page button" data-hover="&lt;">&lt;</span>';
            options.pageNo == options.totalPages ? Next = '<span class="next-page button disabled" data-hover="&gt;">&gt;</span>'  : Next = '<span class="next-page button" data-hover="&gt;">&gt;</span>';
            
            if (options.totalPages > 5) {
                options.pageNo == 1 ? First = '<span class="first-page button disabled" data-hover="&laquo;">&laquo;</span>'  : First = '<span class="first-page button" data-hover="&laquo;">&laquo;</span>';
                options.pageNo == options.totalPages ? Last = '<span class="last-page button disabled" data-hover="&raquo;">&raquo;</span>' : Last = '<span class="last-page button" data-hover="&raquo;">&raquo;</span>';
            }
            Center += '<div class="page-select"><ul>';
            for (var i = 1 ; i <= options.totalPages ; i++ ) {
                i != options.pageNo ? Center += '<li class="button" data-hover="' + i + '">' + i + '</li>' : Center += '<li class="button active" data-hover="' + i + '">' + i + '</li>';
            }
            Center += '</ul></div>';
            Html = '<div class="page-box">' + First + Prev +  Center + Next + Last +'</div>';
            elem.html(Html);
        },
        bindEvents: function() {
            var elem = this.elem;
            var options = this.options;
            var Prev = elem.find('.page-box>.prev-page');
            var Next = elem.find('.page-box>.next-page');
            var First = elem.find('.page-box>.first-page');
            var Last = elem.find('.page-box>.last-page');
            var currPage = options.pageNo;
            var Page = elem.find(".page-box>.page-select>ul>li.button");
            Prev.on('click',function() {
                if (currPage > 1) {
                    currPage--;
                    handles(currPage);
                    options.callback(currPage);
                }
            });
            Next.on('click',function() {
                if (currPage < options.totalPages) {
                    currPage++;
                    handles(currPage);
                    options.callback(currPage);
                }
            });
            First.on('click',function() {
                if (currPage != 1) {
                    currPage = 1;
                    handles(currPage);
                    options.callback(currPage);
                }
            });
            Last.on('click',function() {
                if (currPage != options.totalPages) {
                    currPage = options.totalPages;
                    handles(currPage);
                    options.callback(currPage);
                }
            });
            Page.on('click',function(){
                var val = $(this).attr('data-hover');
                if ( /-?[1-9]\d*/.test(val) ) {
                    currPage = val;
                    handles(currPage);
                    options.callback(currPage);
                }
            });
            function handles(currPage) {
                Page.removeClass(['active','disabled']);
                elem.find('[data-hover="'+currPage+'"]').addClass('active');
                currPage == 1 ? Prev.addClass('disabled') && First.addClass('disabled') : Prev.removeClass('disabled') && First.removeClass('disabled');
                currPage == options.totalPages ? Next.addClass('disabled') && Last.addClass('disabled') : Next.removeClass('disabled') && Last.removeClass('disabled');
                var distance = 0;
                var liWidth = Page.width() + 1;
                if ($(window).width() >= 1024) {
                    if( currPage >= 3 && currPage <= options.totalPages-2 )
                            distance = ( currPage - 3 ) * liWidth;
                    if( currPage == 2 || currPage == 1)
                            distance = 0;
                    if( currPage > options.totalPages-2)
                        distance = ( options.totalPages - 5 ) * liWidth;
                } else {
                    if( currPage >= 2 && currPage <= options.totalPages - 1 )
                            distance = ( currPage - 2 ) * liWidth;
                    if( currPage == 2 || currPage == 1)
                            distance = 0;
                    if( currPage > options.totalPages - 1)
                        distance = ( options.totalPages - 3 ) * liWidth;
                }
                Page.css('transform','translateX(' + (-distance) + 'px)');
            }
            handles(options.pageNo);
        }
    }
    $.fn.paging=function(options) {
        return new Paging($(this),options);
    }
})(jQuery,window,document);