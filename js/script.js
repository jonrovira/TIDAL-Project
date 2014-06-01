var loadHeight = $(window).height(); //Ignore scrollbars

$(document).ready(function() {



	/*
	 * Setting sizes/resizing
	 */
	function setHeights(windowHeight) {
		var navHeight = $('#navbar').height()+1;//bottom border
		var displayHeight = windowHeight-navHeight;
		var leftHeight = displayHeight;
		var rightHeight = displayHeight;
		//Left, right heights
		$('#left').height(displayHeight);
		$('#right').height(displayHeight);
		//Step circle heights, line height
		var stepWidth = $('#steps #step-list li').width();
		$('#steps #step-list li').height(stepWidth);
		$('#steps #step-list li h2').css('line-height', (stepWidth*(8/11))+'px');
		//Controls height
		var controlsHeight = 250;
		$('#controls').height(controlsHeight);
		$('#steps').height(displayHeight-controlsHeight);
		//Right section heights
		var rhythmPercent = 0.66;
		var rhythmHeight = Math.floor(displayHeight*rhythmPercent);
		var metronomeHeight = displayHeight-rhythmHeight-1;//bottom border
		$('#rhythms').height(rhythmHeight);
		$('#metronome').height(metronomeHeight);
		//Metronome (widths)
		var sceneWidth = $('#metronome div.content #scene').width();
		$('#metronome div.content #scene #tree').width(sceneWidth/10);
		$('#metronome div.content #scene #landscape').width(sceneWidth);

	}
	setHeights(loadHeight); // On load
	$(window).resize(function() {
		var resizeHeight = $(window).height();
		setHeights(resizeHeight);
	}); // On resize



	/*
	 * Step clicking
	 */
	$('#steps #step-list > li:nth-child(1)').addClass('active');
	$('#rhythms #hand').html("Left hand");
	$('#steps #step-list > li').click(function() {
		if(!$(this).hasClass('active')) {
			$('#steps #step-list > li.active').removeClass('active');
			$(this).addClass('active');
			// Change hand text
			var step = $(this).children('h2').html();
			var hand;
			if(step == 1) {
				hand = "Left hand";
			}
			else if(step == 2) {
				hand = "Right hand";
			}
			else if(step == 3) {
				hand = "Both hands";
			}
			$('#rhythms #hand').html(hand);
		}
	});



	/*
	 * Beat option clicking
	 */
	var $pBeatOptActive = $('#beat-options div.opts:first-child li:nth-child(3) button');
	var $sBeatOptActive = $('#beat-options div.opts:last-child li:nth-child(2) button');
	var $pOptFeedback = $('#opts-feedback h2:last-child');
	var $sOptFeedback = $('#opts-feedback h2:first-child');
	$pBeatOptActive.addClass('active');
	$sBeatOptActive.addClass('active');
	function setBeatOptionsFeedback() {
		var pBeatOpt = $('#beat-options div.opts:first-child li button.active').html();
		var sBeatOpt = $('#beat-options div.opts:last-child li button.active').html();
		$pOptFeedback.html(pBeatOpt);
		$sOptFeedback.html(sBeatOpt);
	}
	setBeatOptionsFeedback();
	// On click
	$('#beat-options div.opts li button').click(function() {
		if(!$(this).hasClass('active')) {
			$(this).parent().parent().find('.active').removeClass('active');
			$(this).addClass('active');
		}
		setBeatOptionsFeedback();
	});



	/*
	 * Backstep/play/pause icon display/functionality
	 */
	$('#pause').hide();
	var audio = new Audio('public/audio/2Chainz.mp3');
	$('#go i').click(function() {
		if($(this).attr('id') == "stepback") {
			audio.currentTime = 0;
			audio.pause();
			$('#stepback').fadeOut(100).fadeIn(100);
			$('#pause').hide();
			$('#play').show();
		}
		else if($(this).attr('id') == 'play') {
			//audio.play();
			$('#play').fadeOut(100);
			$('#pause').delay(200).fadeIn(100);	
		}
		else if($(this).attr('id') == 'pause') {
			audio.pause();
			$('#pause').fadeOut(100);
			$('#play').delay(200).fadeIn(100);
		}
	});


	/*
	 * Note adding into document
	 */
	$('#note-stream div.note').html('<div class="note-stem"></div><div class="note-x"><div class="note-x-l"><div class="note-x-r"></div></div></div>');


	/*
	 * Note stream animation
	 */
	$('#play').click(function() {
		var step = $('#steps #step-list li.active h2').html();
		var notes;
		var numHands;
		var beats;
		var tpn;
		var shootRate = 500;
		var i=0;
		var j=0;
		var pBeats = $('.opts:first-child ul li button.active').html();
		var sBeats = $('.opts:last-child ul li button.active').html();
		var pTpn = 3000;
		var sTpn = pTpn * sBeats / pBeats;
		console.log("step: " + step);
		console.log("pBeats: " + pBeats);
		console.log("sBeats: " + sBeats);
		console.log("pTpn: " + pTpn);
		console.log("sTpn: " + sTpn)
		treeMove();

		if(step==1) {
			notes = $('#note-stream').children('.primary');
			oneHand = 1;
			beats = $('.opts:first-child ul li.active button').html();
			tpn = pTpn;
		}
		else if(step==2) {
			notes = $('#note-stream').children('.secondary');
			oneHand = 1;
			beats = $('.opts:last-child ul li.active button').html();
			tpn = sTpn;
		}
		else if(step==3) {
			notes = $('#note-stream').children();
			oneHand = 0;
		}
		console.log("oneHand: " + oneHand);
		console.log("tpn: " + tpn);

		if(oneHand) {
			var noteStreamInterval = setInterval(function() {
				$(notes[i]).show();
				$(notes[i]).transition({
					x: -($(window).width()-$('#steps').width()-60)
				}, tpn+3000, "linear", function() {
					//$(this).hide();
				});
				i++;
				if(i == notes.length) {
					window.clearInterval(noteStreamInterval);
					$(notes).delay(tpn).transition({x:0}, 0);
					$('#pause').delay(tpn).fadeOut(100);
					$('#play').delay(tpn+200).fadeIn(100);
				}
			}, shootRate);
		}

		else if(!oneHand) {
			var pStreamInterval = setInterval(function() {
				if($(notes[i]).hasClass('primary')) {
					$(notes[i]).show();
					$(notes[i]).transition({
						x: -($(window).width()-$('#steps').width()-80)
					}, pTpn, "linear", function() {
						$(this).hide();
					});
					i++;
				}
			}, shootRate);
			var sStreamInterval = setInterval(function() {
				if($(notes[i]).hasClass('secondary')) {
					$(notes[i]).show();
					$(notes[i]).transition({
						x: -($(window).width()-$('#steps').width()-80)
					}, sTpn, "linear", function() {
						$(this).hide();
					});
					i++;
				}
			}, shootRate);
		}

	}); 


	/*
	 * Metronome
	 */	
	function treeMove() {
		$('#giraffe').attr('src', 'public/images/giraffe.gif');
		$('#tree').transition({
			x: -($(window).width()-$('#steps').width()-160)
		}, 3000, "linear", function() {
			$('#tree').transition({x:0}, 0);
			treeMove();
		});
	}

});