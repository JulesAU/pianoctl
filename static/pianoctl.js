var focused = true;
var running = false;

$(document).ready(function() {
  // When the form  is clicked on, don't actually submit -- just send message.
  $('#form').submit(function() {
    $.post('ajax.html', { text: $('#text').val() });
    $('#text').val('');
    scrollToBottom();
    return false;
  });
  $('#text').focus(function() {
    if (this.value == "Type manual commands here...") {
      $(this).val("");
    }
    scrollToBottom();
  });

  // Send command when buttons are clicked on.
  $('td').click(function() {
    $.post('ajax.html', { text: $(this).attr('command') });
    scrollToBottom();
  });


  // Update the volume when clicked.
  $('#volume').click(function(e) {
    $('#volumepos').css('left', e.pageX);
    var scaled = Math.round(100 * e.pageX / $('hr').width());
    $.get('volume.html', { level: scaled });
  });
  // And set the initial position.
  $('#volumepos').css('left', $('#initialvolume').text());

  // Defer waitForUpdate so android browser thinks page is fully lodaed.
  setTimeout('waitForUpdate()', '1000');

  $(window).blur(function() {
    focused = false;
  });
  $(window).focus(function() {
    focused = true;
    if (!running) waitForUpdate();
  });

  scrollToBottom();
  $(window).resize(function() {
    scrollToBottom();
  });
});

function scrollToBottom() {
  $('#logs').scrollTop(10000000);
}

function waitForUpdate() {
  if (focused == false) {
    running = false;
    return;
  }
  running = true;

  $.ajax({
    type: "GET",
    url: "ajax.html",
    async: true,
    cache: false,
    timeout: 60000,

    success: function(data) {
      $('#logmessages').text(data);
      waitForUpdate();
    },

    error: function(XMLHttpRequest, textStatus, errorThrown) {
      setTimeout('waitForUpdate()', '5000');
    },
  });
}
