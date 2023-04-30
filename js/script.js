// function showMarkers
let markers = [];
function showMarkersOnMap(link = 'punktyNezlamnosty', image = 'lightning') {
	$.ajax({
		"method": "GET",
		"url": "/data/" + link + ".json",
		"success": function(data){
			let marker1;
			data.forEach(function(element) {
				function getIcon(element1){
					if (!element1.icon) {
						icon = '/img/' + image + '.svg'
					} else {icon = '/img/' + image + '-mod.svg'}
				}
				getIcon(element);
				function createNewMarker() {
					marker1 = new google.maps.Marker({
						position: element.coordinate,
						map,
						title: element.balans,
						icon: icon,
					});
					markers.push(marker1)
					marker1.addListener("click", function() {
						markers.forEach(function(element){
							element.setIcon(element.getIcon().replace('-big',''));
						})
						this.setIcon(this.getIcon().replace('.svg','-big.svg'));
						if (link == 'punktyNezlamnosty') {
							showAboutPunkt(element);
						} else if (link == 'shelters') {
							showAboutShelter(element);
						}
					});
				}
				createNewMarker();
			})
		}
	})
}

// Shelters
function showShelters() {
	showMarkersOnMap('shelters', 'shelter');
	$('.header__map-light,.header__punkty-nezlamnosty,.header__map-shelters').removeClass('punktsActive lightActive');
	$('.block-about-me,.search-form,.search-input').removeClass('active');
	$('.time-block').addClass('dn');
	$('.header__map-light,.header__punkty-nezlamnosty,.header__map-shelters').toggleClass('sheltersActive');
	$('.about-alerts-map').addClass('active');
	$('.header__update-time').addClass('none');
	$('.map-light-hint,.info__map-light,.info__map-punkts').addClass('none');
}
function showAboutShelter(element){
	$('.info-block-shelters').addClass('active');
	if (element.icon = "bombsWeapon") {
		$('.info-block-shelters__image_radioactive').removeClass('active');
		$('.info-block-shelters__image_bomb').addClass('active');
	} else if (element.icon = "nuclearWeapon") {
		$('.info-block-shelters__image_bomb').removeClass('active');
		$('.info-block-shelters__image_radioactive').addClass('active');
	}
	$('.sheltersTitle').text(element.balans);
	$('.sheltersAddress').text(element.address);
	$('.sheltersCapacity').text(element.info);
}
$('.info-block-shelters__hide').click(function(){
	markers.forEach(function(element){
		element.setIcon(element.getIcon().replace('-big',''));
	})
	$('.info-block-shelters').removeClass('active');
})




function initMap() {
	const center = { lat: 50.31021476602062, lng: 34.8965818949175 };
	map = new google.maps.Map(document.getElementById("map"), {
		center: center,
		zoom: 14,
		mapId: "b061204d7bd99792",
		mapTypeId: 'roadmap',
		zoomControl: true,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: false
  	});

	// AUTOCOMPLETE
	const infoWindow3 = new google.maps.InfoWindow();
	const marker = new google.maps.Marker({
		map,
	});
	const defaultBounds = {
		north: center.lat + 0.25,
		south: center.lat - 0.25,
		east: center.lng + 0.25,
		west: center.lng - 0.25,
	};
	const input = document.getElementById("pac-input");
	const options = {
		bounds: defaultBounds,
		strictBounds: true,
	};
	const autocomplete = new google.maps.places.Autocomplete(input, options);
	google.maps.event.addListener(autocomplete, 'place_changed', function(){
		marker.setVisible(false);
		infoWindow3.close();

		const place = autocomplete.getPlace();
		if(place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		}
		marker.setIcon({
			url:place,
			scaledSize: new google.maps.Size(35,35),
		});
		marker.setPosition(place.geometry.location);
		marker.setVisible(true);

		if(place.address_components) {
			address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
			].join(' ');
		}

		infoWindow3.setContent('<div><strong>' + place.name + '</strong><br>' + address);
		marker.addListener("click", function() {
			infoWindow3.open(map, marker);
		});
	});
	// END AUTOCOMPLETE

	showShelters();

	// Links maps
	$('.header__map-light').click(function() {
		$('.header__map-light,.header__punkty-nezlamnosty,.header__map-shelters').removeClass('sheltersActive punktsActive');
		$('.block-about-me,.search-form,.search-input,.about-alerts-map,.header__block-more').removeClass('active');
		$('.header__map-light,.header__punkty-nezlamnosty,.header__map-shelters').toggleClass('lightActive');
		$('.map-light-hint').removeClass('none');
		$('.info__map-punkts').addClass('none');
		$('.info__map-light').removeClass('none');
		$('.time-block').removeClass('dn');
	})
	const mapType = urlParams.get('mapType')
	if (mapType == 'punkts') {
		punktsActive();
		$('.header__map-light').click(function() {
			getZonesJson();
			loadNewVersion();
			getNewGrafik();
			setInterval(takeNewFileVersion, 10000);
			$('.header__map-light,.header__punkty-nezlamnosty,.header__map-shelters').removeClass('sheltersActive punktsActive');
			$('.block-about-me,.search-form,.search-input,.about-alerts-map,.header__block-more').removeClass('active');
			$('.header__map-light,.header__punkty-nezlamnosty,.header__map-shelters').toggleClass('lightActive');
			$('.map-light-hint').removeClass('none');
			$('.info__map-punkts').addClass('none');
			$('.info__map-light').removeClass('none');
			$('.time-block').removeClass('dn');
		})
	} else if (mapType == 'shelters') {
		showShelters()
		$('.header__map-light').click(function() {
			getZonesJson();
			loadNewVersion();
			getNewGrafik();
			setInterval(takeNewFileVersion, 10000);
			$('.header__map-light,.header__punkty-nezlamnosty,.header__map-shelters').removeClass('sheltersActive punktsActive');
			$('.block-about-me,.search-form,.search-input,.about-alerts-map,.header__block-more').removeClass('active');
			$('.header__map-light,.header__punkty-nezlamnosty,.header__map-shelters').toggleClass('lightActive');
			$('.map-light-hint').removeClass('none');
			$('.info__map-punkts').addClass('none');
			$('.info__map-light').removeClass('none');
			$('.time-block').removeClass('dn');
		})
	}

	// GEOLOCATION
	let location = new google.maps.Marker({
		icon: "img/geo-alt.svg",
		map,
		title: "Ваша геолокація",
	});
	const infoWindow2 = new google.maps.InfoWindow({
		content: "",
		disableAutoPan: true,
	});
	location.addListener("click", function() {
		infoWindow2.setContent('Current location');
		infoWindow2.open(map, location);
	});
	const locationButton = document.getElementById("geolocation");
	locationButton.classList.add("custom-map-control-button");
	locationButton.addEventListener("click", function() {
		// Try HTML5 geolocation.
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function(position) {
					const pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};
					location.setPosition(pos);
					map.setCenter(pos);
					map.setZoom(16);
				},
			);
		} else {
			// Browser doesn't support Geolocation
			handleLocationError(false, infoWindow2, map.getCenter());
		}
	});
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(
		browserHasGeolocation
		? "Error: The Geolocation service failed."
		: "Error: Your browser doesn't support geolocation."
	);
	infoWindow.open(map);
	// END GEOLOCATION
}
// END GEOLOCATION
window.initMap = initMap;
