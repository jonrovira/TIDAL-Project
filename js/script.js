$(document).ready(function() {

	/*
	 * Section heights
	 */
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


	/*
	 * Step clicking
	 */
	$('#steps > div').click(function() {
		if(!$(this).hasClass('step-active')) {
			$('.step-active').removeClass('step-active');
			$(this).addClass('step-active');
		}
	});


});