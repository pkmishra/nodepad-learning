(function() {
  // Easily get an item's database ID based on an id attribute
  $.fn.itemID = function() {
    try {
      var items = $(this).attr('id').split('-');
      return items[items.length - 1];
    } catch (exception) {
      return null;
    }
  };
//Edit request
  $.put = function(url, data, success) {
    data._method = 'PUT';
    $.post(url, data, success, 'json');
  };
 //delete request
   $.del = function(url, data, success) {
    data._method = 'DELETE';
    $.post(url, data, success, 'json');
  };

  $('.destroy').live('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure?')) {
      var element = $(this),
          form = $('<form></form>');
      form
        .attr({
          method: 'POST',
          action: element.attr('href')
        })
        .hide()
        .append('<input type="hidden" />')
        .find('input')
        .attr({
          'name': '_method',
          'value': 'delete'
        })
        .end()
        .submit();
    }
  });

  // Correct widths and heights based on window size
  function resize() {
    var height = $(window).height() - $('#header').height() - 1,
        width = $('.content').width(),
        ov = $('.outline-view'),
        ed = $('#editor'),
        toolbar = $('.toolbar'),
        divider = $('.content-divider'),
        content = $('.content'),
        controls = $('#controls');

    $('#DocumentTitles').css({ height: height - toolbar.height() + 'px' });
    ov.css({ height: height + 'px' });
    toolbar.css({ width: ov.width() + 'px' });

    content.css({
      height: height - controls.height() + 'px',
      width: $('body').width() - ov.width() - divider.width() - 1 + 'px'
    });

    divider.css({ height: height + 'px' });

    ed.css({
      width: content.width() - 5 + 'px',
      height: content.height() - 5 + 'px'
    }).focus();

    $('#controls').css({
      width: content.width() + 'px'
    });
  }
//Document title click function
  $('#document-list li a').live('click', function(e) {
    var li = $(this);

    $.get(this.href + '.json', function(data) {
      $('#document-list .selected').removeClass('selected');
      li.addClass('selected');
      $('#editor').val(data.data);
      $('#editor').focus();
    });

    e.preventDefault();
  });
//by default select first note
  if ($('#document-list .selected').length == 0) {
    $('#document-list li a').first().click();
  }
//save 
  $('#save-button').click(function() {
    var id = $('#document-list .selected').itemID(),
        params = { d: { title:$('#document-list .selected').text(),  data: $('#editor').val(), id: id } };
    $.put('/documents/' + id + '.json', params, function(data) {
      // Saved, will return JSON
    });
  });
//delete  
  $('#delete-document').click(function() {
    var id = $('#document-list .selected').itemID(),
        params = { d: { id: id } };
    $.del('/documents/' + id + '.json', params, function(data) {
      // Saved, will return JSON
    });
  });

  $(window).resize(resize);
  $(window).focus(resize);
  resize();
})();