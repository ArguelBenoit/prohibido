import $ from 'jquery';
// import debouce from 'debounce';
$(document).ready(() => {
  var location;
  if (window.location.hostname == 'localhost' || window.location.hostname == 'ubuntu')
    location = 'http://'+ window.location.hostname + ':8080';
  else
    location = 'http://'+ window.location.hostname;

  /////////ALERTE/////////////////////////////////

  $('.reservation-alert').click( () => alert("Nous sommes fermé tout au long du mois d’août. Notre réouverture est prévue le 6 Septembre.") );
  // remove style on line ~ 100

  /////////MENU/////////////////////////////////

  $('#menu').on('click', e => {
    $(['#menu', '#menu2', '#arrow-menu']).toggleClass('clicked');
    e.preventDefault();
  });

  /////////SMOOTHSCROLL//////////////////////////

  $('a[href^="#"]').click(function(){
  	let the_id = $(this).attr('href');
  	$('html, body').animate({
  		scrollTop:$(the_id).offset().top
  	}, 'slow');
  	return false;
  });

  /////////HOMEPAGEMOBILE////////////////////////

  if ($('#homepage').height() < window.innerHeight ) {
    let dif = window.innerHeight - $('#homepage').height();
    $('#homepage').css('height', $('#homepage').height() + dif);
    $('#homepage .container.my-full-size').css({
      position: 'absolute',
      bottom: '0px'
    });
  }

  /////////MEDIAS///////////////////////////////

  var countClickMedias = 0;
  var width = $(window).width();
  var height = (width/16)*9;
  var length = $('#medias .container-medias > div').length;

  $('#medias').css({'width': width, 'height': height, 'overflow': 'hidden' });
  $('#medias .container-medias').css({'width': width*length, 'height': height});
  $('#medias .container-medias .media').css({width, height});

  $('#medias img').on('click', e => {
    if (e.target.className == 'right-button')
      countClickMedias = countClickMedias+1;
    else if (e.target.className == 'left-button')
      countClickMedias = countClickMedias-1;
    $('#medias .container-medias').css('margin-left', -countClickMedias*width);
    $('#medias img.right-button').css('display', countClickMedias == length-1 ? 'none' : 'inherit');
    $('#medias img.left-button').css('display', countClickMedias == 0 ? 'none' : 'inherit');
    e.preventDefault();
  });

  $('#team').css({ width, height: width/2});

  $('#medias img.right-button').css({
    'margin-top': ( height / 2 ) - 25,
    'margin-left': width - 50,
    'display': countClickMedias == length ? 'none' : 'inherit'
  });
  $('#medias img.left-button').css({
    'transform': 'rotateY(180deg)',
    'margin-top': ( height / 2 ) - 25,
    'display': countClickMedias == 0 ? 'none' : 'inherit'
  });

  /////////H3ORNEMENTS//////////////////////////

  const h3s = [
    '#h3-information',
    '#h3-carte',
    '#h3-team'
  ];
  h3s.forEach( e => {
    $(e).css({
      'margin-left': ( width - $(e + ' .container-h3-ornement').width()) / 2
    });
  });

  /////////PARALLAXVIDEO/////////////////////////

  window.addEventListener('scroll', () => {
    let scroll = $(document).scrollTop();
    $('video#bgvid').css({top: scroll/2});
  }, true);

  /////////RESIZE///////////////////////////////

  window.addEventListener('resize', () => {
    width = $(window).width();
    height = (width/16)*9;
    const h3s = [
      '#h3-information',
      '#h3-carte',
      '#h3-team'
    ];
    h3s.forEach( e => {
      $(e).css({
        'margin-left': ( width - $(e + ' .container-h3-ornement').width()) / 2
      });
    });
    $('#team').css({ width, height: width/2});
    $('#medias img.right-button').css({
      'margin-top': ( height / 2 ) - 25,
      'margin-left': width - 50
    });
    $('#medias img.left-button').css({'margin-top': ( height / 2 ) - 25});
    $('#medias').css({'width': width, 'height': height });
    $('#medias .container-medias').css({'width': width*length, 'height': height});
    $('#medias .container-medias .media').css({width, height});
    $('#medias .container-medias').css('margin-left', -countClickMedias * width);
  });

  ////////AJAX////////////////////////////////////

  $('#submit-registration').click(() => {
    let mail = $('#email-registration').val();
    $.post(location +'/registration', { mail }, data => {
      if (data === 'done') {
        $('#email-registration').css('border', 'rgba(255,255,255,0.4) solid 1px');
        $('#email-registration, #submit-registration').css({'opacity': '0', 'pointer-events': 'none'});
        $('#replace-registration').css({'opacity': '1', 'pointer-events': 'inherit'});
        var widthMap = Math.round((window.innerHeight / 100)*70 );
        $('#map-container').css('height', widthMap);
        $('#map').css('height', widthMap);
        $('#password-map div p span').html('1803');

        mapboxgl.accessToken = 'pk.eyJ1IjoicHJvaGliaWRvIiwiYSI6ImNqMmxscjczODAwMHQyd283eGI1MTdtN3oifQ.mgVTX3Bp6O61PVWpiFMNBQ';
        var map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/prohibido/cj2pyocwz004w2smti3wedsme',
          center: [-1.473, 43.489],
          zoom: 14
        });

        var geojson = {
          'id': 'marker',
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'properties': {
                'iconSize': [50, 60],
                'description': 'test'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [ -1.473789, 43.489048 ],
              }
            }
          ]
        };

        geojson.features.forEach((marker) => {
          var el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundImage = 'url(img/layer.svg)';
          el.style.width = marker.properties.iconSize[0] + 'px';
          el.style.height = marker.properties.iconSize[1] + 'px';
          el.style.margin = '-30 0 0 0';
          new mapboxgl.Marker(el, {offset: [-marker.properties.iconSize[0] / 2, -marker.properties.iconSize[1] / 2]})
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
        });

        setTimeout(() => {
          $('#arrow-map').css({'opacity': '1', 'margin-top': '-25px'});
          $('html, body').animate({scrollTop: $('#map').offset().top - Math.round((window.innerHeight / 100)*15 )}, 500 );
          $('#password-map').css('transform', 'translateY(-100px)');
        }, 1000);
        setTimeout(() => {
          $('#email-registration, #submit-registration').css({'opacity': '1', 'pointer-events': 'inherit'});
          $('#replace-registration').css({'opacity': '0', 'pointer-events': 'none'});
          $('#email-registration').val('');
          $('#email-registration').attr('placeholder', 'E-mail*');
        }, 7000);
      } else if (data === 'false') {
        $('#email-registration').css('border', '1.5px solid red');
        $('#email-registration').val('');
        $('#email-registration').attr('placeholder', 'Veuillez saisir une adresse valide');
      }
    });
  });

  $('#submit-sendmail').click(() => {
    if($('#select-sendmail').val() == 'empty')
      $('#select-sendmail').css('border', '1.5px solid red');
    else
      $('#select-sendmail').css('border', 'rgba(255,255,255,0.4) solid 1px');
    const elements = [
      $('#email-sendmail'),
      $('#number-sendmail'),
      $('#date-sendmail'),
      $('#peoples-sendmail')
    ];
    elements.forEach(e => {
      if (!e.val())
        e.css({border: '1.5px solid red'});
      else
        e.css({border: 'rgba(255,255,255,0.4) solid 1px'});
    });
    if (
      $('#select-sendmail').val() != 'empty' &&
      $('#email-sendmail').val() &&
      $('#number-sendmail').val() &&
      $('#date-sendmail').val() &&
      $('#peoples-sendmail').val()
    ) {
      let mail = {
        objet : $('#select-sendmail').val(),
        email : $('#email-sendmail').val(),
        tel : $('#number-sendmail').val(),
        date : $('#date-sendmail').val(),
        nombre : $('#peoples-sendmail').val(),
        message : $('#txt-sendmail').val()
      };
      $.post(location +'/sendmail', mail, data => {
        if (data === 'done') {
          $('#form-sendmail').css({'opacity': '0', 'pointer-events': 'none'});
          $('#replace-sendmail').css({'opacity': '1', 'pointer-events': 'inherit'});
          setTimeout(() => {
            $('#form-sendmail').css({'opacity': '1', 'pointer-events': 'inherit'});
            $('#replace-sendmail').css({'opacity': '0', 'pointer-events': 'none'});
            $('#txt-sendmail').val('');
            elements.forEach(e => {
              e.val('');
            });
          }, 7000);
        }
      });
    }
  });
});
