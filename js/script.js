var loadHeight = $(window).height(); //Ignore scrollbars
$(document).ready(function() {

	/*
	 * Initializations
	 */
	var step  = "Right";
	var steps = {"Right": 1, "Left": 2, "Both": 3};
	var typeMap = {"Right": "primary", "Left": "secondary"};
	var type = typeMap[step];
	var pBeat = 3;
	var sBeat = 2;
	var tempo = 120;
	var t = 3000;
	var dt = 1000 * (60 / tempo);
	var dtP = dt * pBeat / pBeat;
	var dtS = dt * pBeat / sBeat;
	var dtX = {"primary": dtP, "secondary": dtS};
	var shoot;
	var shootP;
	var shootS;

	$('#step-list li:nth-child('+steps[step]+')').addClass('active');
	$('#pBeatOpt li:nth-child('+pBeat+') button').addClass('active');
	$('#sBeatOpt li:nth-child('+sBeat+') button').addClass('active');
	$('#tempo-opt input').val(tempo);

	setHeights(loadHeight);
	setStep(step);


	/*
	 * Functions
	 */
	/* Set,resize window & element size */
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
		$('#steps #step-list li h2').css('line-height', (stepWidth*(10/13))+'px');

		//Controls height
		var controlsHeight = 250;
		$('#controls').height(controlsHeight);
		$('#steps').height(displayHeight-controlsHeight-1); //top border

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
	/* Set hand feedback */
	function setStep(hand) {
		//if shooting, stop
		stopShooting();

		var left = hand;
		var right = "hand";
		var text;
		//plural hand for both
		if(hand == "Both") right = right+'s';
		//put text together
		text = left+' '+right;
		//update text in rhythm section
		$('#hand').html(text);
		//change global step, print
		step = hand;
		type = typeMap[step];
		console.log('New step: ' + step);
	}
	/* Set primary,secondary beat */
	function setBeat(parent, beat) {
		//change global beat variable
		if(parent == "pBeatOpt") { pBeat = beat; }
		else if(parent == "sBeatOpt") { sBeat = beat; }
		setRates();
		//print change
		var whichBeat = parent.replace('Opt','');
		console.log('New '+whichBeat+': '+beat);
	}
	/* Set tempo */
	function setTempo(newTempo) {
		if(newTempo!=tempo) {
			stopShooting();
			tempo = newTempo;
			dt = 1000 * (60 / tempo);
			setRates();
			console.log('New tempo: '+tempo);
		}
	}
	/* Set primary, secondary rates */
	function setRates() {
		dtP = dt * pBeat / pBeat;
		dtS = dt * pBeat / sBeat;
		dtX['primary'] = dtP;
		dtX['secondary'] = dtS;
	}
	/* Add note element to note stream */
	function addNote(typeX) {
		/*
		Structure:
		<div class="type note">
		  	<div class="note-x">
		  		<div class="note-stem"></div>
		  		<div class="note-x-l">
		  			<div class="note-x-r"></div>
	  			</div>
  			</div>
		</div>';
		*/
		var note = '<div class="'+typeX+' note"><div class="note-x"><div class="note-stem"></div><div class="note-x-l"><div class="note-x-r"></div></div></div></div>';
		//add note to end of note stream
		$('#note-stream').append(note);
		console.log('Note added');
		//return the note
		var $justAdded = $('#note-stream div.note:last-child');
		return $justAdded
	}
	/* Calculate length of note stream */
	function calculateLength() {
		var length = $(window).width()-$('#steps').width()-57;
		return length;
	}
	/* Calculate individual shoot rates */
	function calculateShootRate(typeX) {
		var rate;
		if(typeX=="primary") rate = dt / pBeat * pBeat;
		else if(typeX=="secondary") rate = dt / pBeat * sBeat;
	}
	/* Shoot first notes of stream */
	function shootFirstNotes() {
		var $note1;
		var $note2;
		var $notes;

		//new notes
		$note1 = addNote('primary');
		$note2 = addNote('secondary');
		$notes = $note1.add($note2);

		//shoot em
		$notes.transition({
			x:-calculateLength()
		}, t, "linear", function() {
			setTimeout(function() {
				$notes.remove();
			}, 100);
		});
	}
	/* Shoot note across note-stream */
	function shootNote(typeX) {
		var $note;

		//new note
		$note = addNote(typeX);

		//shoot it
		$note.transition({
			x: -calculateLength()
		}, t, "linear", function() {
			setTimeout(function() {
				$note.remove();
			}, 100);
		});
	}
	/* Start shooting notes down stream */
	function startShooting() {
		var both = (step == "Both");

		//either right or left
		if(!both) {
			shootNote(type);
			shoot = setInterval(function() {
				shootNote(type);
			}, dtX[type]);
		}

		//both
		else if(both) {
			var rateP = dtX['primary'];
			var rateS = dtX['secondary']

			//shoot first notes together
			shootFirstNotes();

			//primary shooter
			shootP = setInterval(function() {
				shootNote('primary');
			}, rateP);
			//secondary shooter
			shootS = setInterval(function() {
				shootNote('secondary');
			}, rateS);
		}
	}
	/* Stop all shooting */
	function stopShooting() {
		//if shooting, stop
		if(shoot || shootP || shootS) {
			console.log("Stopping...");
			$('#stop').fadeOut(50);
			$('#play').delay(50).fadeIn(50);
			clearInterval(shoot);
			clearInterval(shootP);
			clearInterval(shootS);
			$('.note').hide();
		}
	}

	/*
	 * Events
	 */
	/* Resize window & elements */
	$(window).resize(function() {
		console.log("Resizing");
		setHeights($(window).height());
	});
	/* Step change */
	$('#step-list li').click(function() {
		//this isn't active
		if(!$(this).hasClass('active')) {
			//remove active from current
			$('#step-list li.active').removeClass('active');
			//add active to this
			$(this).addClass('active');
			//change hand text
			var hand = $(this).children('h2').html();
			setStep(hand);
		}
	});
	/* Beat change */
	$('div.opts li button').click(function() {
		//this isn't active
		if(!$(this).hasClass('active')) {
			//remove active from current
			$(this).parent().parent().find('.active').removeClass('active');
			//add active to this
			$(this).addClass('active');
			var parent = $(this).parent().parent().attr('id');
			var beat = $(this).html();
			setBeat(parent, beat);
		}
	});
	/* Tempo change */
	$('#tempo-opt input').change(function() {
		var val = $('#tempo-opt input').val();
		setTempo(val);
	});
	/* Play pressed */
	$('#play').click(function() {
		console.log("Playing...");

		//hide play, show stop
		$(this).fadeOut(50);
		$('#stop').delay(50).fadeIn(50);

		//shoot note woooo
		startShooting();
	});
	/* Stop note stream */
	$('#stop').click(function() {
		//stop
		stopShooting();
	});

});