$(document).ready(function() {

	/*
	 * Section heights
	 */
	function setHeights() {
		var navHeight = $('#navbar').height();
		var windowHeight = $(window).height();
		var displayHeight = windowHeight - navHeight;
		while(displayHeight % 3 != 0) {
			displayHeight -= 1;
		}
		var stepsHeight = displayHeight;
		var rightSectionsHeight = (displayHeight / 3) - 1; // -1 for bottom border
		$('#steps').height(stepsHeight);
		$('#options').height(rightSectionsHeight);
		$('#rhythms').height(rightSectionsHeight);
		$('#metronome').height(rightSectionsHeight);
		// Step heights
		var stepWidth = $('#steps #step-list li').width();
		$('#steps #step-list li').height(stepWidth);
		$('#steps #step-list li h2').css('line-height', (stepWidth*(8/10))+'px');

	}
	setHeights(); // On load
	$(window).resize(setHeights); // On resize


	/*
	 * Step clicking
	 */
	$('#steps #step-list > li').click(function() {
		if(!$(this).hasClass('active')) {
			$('.active').removeClass('active');
			$(this).addClass('active');
		}
	});


	/*
	 * Play/pause icon display/functionality
	 */
	var audio = new Audio('public/audio/2Chainz.mp3');
	$('#options div.content > i').click(function() {
		$(this).hide();
		if($(this).attr('id') == 'play') {
			audio.play();
			$('#options div.content #pause').show();	
		}
		else {
			audio.pause();
			$('#options div.content #play').show();
		}
	});

});