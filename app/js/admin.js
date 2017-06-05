import $ from 'jquery';
import copy from 'copy-to-clipboard';

$(document).ready(() => {
  var location;
  if (window.location.hostname == 'localhost' || window.location.hostname == 'ubuntu')
    location = 'http://'+ window.location.hostname + ':8080';
  else
    location = 'http://'+ window.location.hostname;

  $('.content').css('height', window.innerHeight - 180 - 112 - 20);
  $('#logout').on('click', () => {
    window.location.replace(location +'/logout');
  });

  $.post(location +'/users', {}, data => {
    data = JSON.parse(data);
    var listHtml = '';
    var listCopy = '';
    data.forEach( e => {
      listHtml = listHtml + '<li>' + e + ', ' + '</li>';
      listCopy = listCopy + e + ', ';
    });
    $('#main-content').html(listHtml);
    $('#copy').on( 'click', () => {
      copy(listCopy);
      $('#copy').val('in clipboard !');
      setTimeout(() => {
        $('#copy').val('copy');
      }, 3000);
    });
  });
});
