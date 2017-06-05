import $ from 'jquery';

$(document).ready(() => {
  var location;
  if (window.location.hostname == 'localhost' || window.location.hostname == 'ubuntu')
    location = 'http://'+ window.location.hostname + ':8080';
  else
    location = 'http://'+ window.location.hostname;

  $('#submit').click(() => {
    let user = $('#user').val();
    let code = $('#code').val();
    $.post(location +'/temp', { user, code }, data => {
      if (data === 'done')
        window.location.href = location +'/admin';
      else if (data === 'false') {
        $('#user').css('border', '1.5px solid rgba(255,0,0,0.6)');
        $('#user').val('');
        $('#code').css('border', '1.5px solid rgba(255,0,0,0.6)');
        $('#code').val('');
      }
    });
  });
});
