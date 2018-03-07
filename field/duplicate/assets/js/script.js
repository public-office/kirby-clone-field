(function($) {
  $.fn.duplicate = function() {
    return this.each(function() {
      var fieldname = 'duplicate';
          field = $(this);
          btn = $('.btn-duplicate');
          container = $('.message-duplicate');
          input = $('.input-duplicate');


      btn.click(function() {
        container.hide().removeClass("success error");
        input.val('').toggleClass('active');
      });

      input.keypress(function(e) {
        if (e.which == 13) {
          if($(this).val() == "") {
            container.show().html('The field cannot be empty. Please enter a page title.').addClass('error').append('<i class="icon fa fa-close"></i>')
            return false;
          }
          $.fn.ajaxDuplicate(fieldname);
          return false;
        }
      });

      container.on('click', '.fa-close', function(e){
        $(this).parent().hide().removeClass("success error");
      });

    });

  };

  // Ajax function
  $.fn.ajaxDuplicate = function(fieldname) {
    var newID = $('[data-field="' + fieldname + '"]').find('.input-duplicate').val();
    var newID = newID.replace(/[\/\\\)\($%^&*<>"'`´:;.\?=]/g, " ");
    var blueprintKey = $('[data-field="' + fieldname + '"]').find('button').data('fieldname');
    var base_url = window.location.href.replace(/(\/edit.*)/g, '/field') + '/' + blueprintKey + '/' + fieldname + '/api/duplicate/';

    $.ajax({
      url: base_url + encodeURIComponent(newID),
      type: 'GET',
      success: function(response) {
        var r = JSON.parse(response);
        if(r.class == 'error') {
          container.show().html(r.message).addClass(r.class).append('<i class="icon fa fa-close"></i>');
          input.removeClass('active');
        }

        if(r.class == 'success' && r.uri) {
          container.show().html(r.message).addClass(r.class);
          new_url = window.location.href.replace(/(pages\/.*\/edit.*)/g, 'pages/' + r.uri + '/edit');
          container.append('You will be redirected to the new page ...')
          setTimeout(function () {
              window.location.replace(new_url);
          }, 2000);

        }
      }
    });
  };

})(jQuery);
