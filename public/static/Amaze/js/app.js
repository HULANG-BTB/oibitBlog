(function($) {
  'use strict';

  $(function() {
    var $fullText = $('.admin-fullText');
    $('#admin-fullscreen').on('click', function() {
      $.AMUI.fullscreen.toggle();
    });

    $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
      $fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
    });
  });

  $(document).keydown(function(event) {
       if(event.keyCode == 116) {
            if ( top != self ) {
               event.preventDefault();
               location=location;
           }
       } 
   });

})(jQuery);
