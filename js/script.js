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
		var rightSectionsHeight = ((displayHeight-151) / 2) - 1; // -1 for bottom border
		$('#steps').height(stepsHeight);
		$('#options').height(150);
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
	$('#steps #step-list > li:nth-child(1)').addClass('active');
	$('#steps #step-list > li').click(function() {
		if(!$(this).hasClass('active')) {
			$('.active').removeClass('active');
			$(this).addClass('active');
		}
	});


	/*
	 * Beat option clicking
	 
	$('#options div.content #beat-options div.opts:first-child li:nth-child(4) button').addClass('active');
	$('#options div.content #beat-options div.opts:last-child li:nth-child(3) button').addClass('active');
	$('#options div.content #beat-options div.opts li button').click(function() {
		if(!$(this).hasClass('active')) {
			$parent = $(this).parent().parent();
			$
		}
	})*/


	/*
	 * Backstep/play/pause icon display/functionality
	 */
	$('#pause').hide();
	var audio = new Audio('public/audio/2Chainz.mp3');
	$('#options div.content #controls > i').click(function() {
		if($(this).attr('id') == "stepback") {
			audio.currentTime = 0;
			audio.pause();
			$('#pause').hide();
			$('#play').show();
		}
		else if($(this).attr('id') == 'play') {
			audio.play();
			$('#play').hide();
			$('#pause').show();	
		}
		else if($(this).attr('id') == 'pause') {
			audio.pause();
			$(this).hide();
			$('#play').show();
		}
	});

});