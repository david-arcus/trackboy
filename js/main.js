// set up variables for mobile devices
determineMobileProperties();

//globals
var interactionPhrase; // click or tap
var widthMeasurement; // varies depending on desktop or mobile
var heightMeasurement; // varies depending on desktop or mobile
var stageWidth = getStageCharacters(widthMeasurement, 9.6969697); // width in characters of stage
var stageHeight = getStageCharacters(heightMeasurement, 19.2); // height in characters of stage
var barrier = '#'; // character for not-road
var road = '&nbsp;'; // non breaking space for road
//var car = '@&#9786;@'; // character for car
var carX = parseInt(stageWidth*0.5); // initial x pos of car 
var carY = parseInt(stageHeight*0.5); // initial y pos of car
var roadWidth = 20; // width of the road
var matrix = []; // will contain track rows
var centrePosition = parseInt((stageWidth*0.5) - (roadWidth*0.5)); // this is the index of a track in the centre of the stage
var currentPosition = centrePosition; // this the starting point for the car
var distance = 0; // initialize distance travelled var
var speed = 40; // initialize setInterval time
var gameHasStarted = false;

var $stage = $('#stage, #logo'); // stage div (includes logo)
var $logo = $('#logo'); // logo (needs to be separate to remove it when game starts)
var $social = $('#social');
var $controls = $('.controls');
var $left = $('#left');
var $right = $('#right');

// functions

function determineMobileProperties() {
	// start with device type detection - this will determine how me measure the screen and what language to use for interactions
	
	if (Modernizr.touch) {   
		widthMeasurement = window.outerWidth;
		heightMeasurement = screen.height;
		interactionPhrase = 'tap';
	} else {   
		widthMeasurement = $(window).width();
		heightMeasurement = $(window).height();
		interactionPhrase = 'click';
	}  	
	
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function getRandomInt (min, max) {
	
    return Math.floor(Math.random() * (max - min + 1)) + min;
	
}

function getStageCharacters(orientation, ratio) {
	
	// orientation will be either window.outerWidth or screen.height (http://tripleodeon.com/wp-content/uploads/2011/12/table.html?r=outerwidth&c=)
	// which gives us the device's width or height
	
	// ratio is the number of characters required to fill the screen of a specified height or width:
	// e.g a 320px wide screen requires 33 characters at a font size of 16px (monospaced)
	// 320 / 33 = 9.6969697
	
	// so screen width / 9.6969697 gives us the number of characters (width) we need
	
	var numberOfCharacters = Math.ceil(orientation/ratio);
	return numberOfCharacters;	
	
}

function addTrackRow(roadStart, roadWidth) { 
	
	var row = [];
		
	var i;
	//left side of barrier
	for (i = 0; i<roadStart; i++) {
		row.push(barrier);
	}
	
	//road
	for (i = 0; i<roadWidth; i++) {
		row.push(road);	
	}
	
	//right side of barrier
	for (i = 0; i<(stageWidth-roadStart-roadWidth); i++) {
		row.push(barrier);
	}	

	row.push('<br />');
	
	return row;
		
}

function outputTrackArray() {
	
	var appendRow = '';
	
	for (var row=0;row<stageHeight; row++) {
		for (var col=0; col<=stageWidth; col++) {
			
			appendRow += matrix[row][col];
			
		}
	}
	
	return appendRow;
	
}

function initializeTrack() {
	
	gameHasStarted = true;
	
	if (Modernizr.touch) {   
		$controls.show();
	}
	
	$stage.html('');
		
	for (var i=0;i<stageHeight;i++) {
		matrix[i] = addTrackRow(centrePosition, roadWidth);
	}
	
	$stage.append(outputTrackArray());
	//console.log(matrix);
	//$stage.append(matrix[0][0]);
	
}

// positions the car
function posCar() {	

	matrix[carY-1][carX-1] = '&nbsp;';
	matrix[carY-1][carX] = '&nbsp;';
	matrix[carY-1][carX+1] = '&nbsp;';
	
	matrix[carY][carX-1] = '@';
	matrix[carY][carX] = '&#9786;';
	matrix[carY][carX+1] = '@';
		
}

function moveCar(direction) {
		
	if (direction == 'left') {
		matrix[carY-1][carX+1] = '&nbsp;';
		carX -= 1;
	}
	
	if (direction == 'right') {
		matrix[carY-1][carX-1] = '&nbsp;';
		carX += 1;
	}

	
}

function moveTrack() {
	
	distance++;
	
	currentPosition += getRandomInt(-1, 1);
	
	if (currentPosition <= 0) {
		currentPosition = 1;
	}
	
	if (currentPosition >= (stageWidth - roadWidth)) {
		currentPosition = stageWidth - roadWidth - 1;
	}
	
	matrix.splice(0,1);
	matrix[parseInt(stageHeight-1)] = (addTrackRow(currentPosition, roadWidth));
		
	$stage.html(outputTrackArray());
		
	//speed -= distance/1000;
	
	// i know this is terrible
	if (distance > 200) {
		roadWidth = 19;
	}
	if (distance > 300) {
		roadWidth = 18;
	}
	if (distance > 400) {
		roadWidth = 17;
	}
	if (distance > 500) {
		roadWidth = 16;
	}
	if (distance > 1000) {
		roadWidth = 15;
	}
	if (distance > 1200) {
		roadWidth = 14;
	}
	if (distance > 1400) {
		roadWidth = 13;
	}
	if (distance > 1600) {
		roadWidth = 12;
	}
	if (distance > 1800) {
		roadWidth = 11;
	}
	if (distance > 2000) {
		roadWidth = 10;
	}
	if (distance > 2200) {
		roadWidth = 9;
	}
	
}

function checkCollision() {
	
	if (matrix[carY][carX-1] == '#') {
		return true;
	}
	
	if (matrix[carY][carX+1] == '#') {
		return true;
	}
	
}

function resetGame() {
	
	carX = parseInt(stageWidth*0.5); // initial x pos of car 
	carY = parseInt(stageHeight*0.5); // initial y pos of car
	matrix = [];
	roadWidth = 20; // width of the road
	centrePosition = parseInt((stageWidth*0.5) - (roadWidth*0.5)); // this is the index of a track in the centre of the stage
	currentPosition = centrePosition; // this the starting point for the car
	distance = 0; // initialize distance travelled var
	speed = 40; // initialize setInterval time
	
}

function showDieMessage() {
	
	var dieMessage = '<div id="end-message">YOU DIED. YOUR SCORE WAS ' + distance + '<br />'+interactionPhrase+' to restart</div>';
	$stage.append(dieMessage);
	
}

function showHomeScreen() {
	
	var $stagePreBg = $('#stage pre#bg');
	var $interactionPhrase = $('#logo span#interaction-phrase');
	
	$interactionPhrase.text(interactionPhrase); 
	
	var appendRow = '';
	
	for (var row=0;row<stageHeight; row++) {
		for (var col=0; col<=stageWidth; col++) {
			
			appendRow += barrier;
			
		}
		
		appendRow += '<br />';
	}
	
	$stagePreBg.html(appendRow);
	
}

function updateControlsPosition() {
	// on ios when the chrome disappears sometimes the controls are left floating, this should ensure they always stick to the bottom of the page
		
	$controls.animate({'bottom':0});
}

document.ontouchstart = function(e){ 
    e.preventDefault(); 
}

$(function() {
	
	showHomeScreen();
	
	var $portfolio = $('#portfolio');
	
	$portfolio.on({ 'touchstart' : function(e) {
		
			e.stopPropagation(); 
			e.preventDefault();
		
			window.location.href = 'http://www.davidarcus.co.nz';
		
		}
		
	});
				
	$stage.on({ 'touchstart click' : function(e){ 
		
		e.stopPropagation(); 
		e.preventDefault();
		
		$logo.hide();
		$social.hide();
		
			if (gameHasStarted != true) {
			
				initializeTrack();
				updateControlsPosition();
			
				var game = setInterval(
					function() {
						posCar();
						moveTrack();
						if (checkCollision()) {
							clearInterval(game);
							$social.show();
							showDieMessage();
							resetGame();
							gameHasStarted = false;
						} 
					}, 
				speed);
				
			}
			
		}
		
	});
	
	$left.on({ 'touchstart click' : function(e){
			e.stopPropagation(); 
			e.preventDefault();
			
			moveCar('left'); 
		} 
	});
	
	$right.on({ 'touchstart click' : function(e){
			e.stopPropagation(); 
			e.preventDefault();
			
			moveCar('right'); 
		} 
	});
	
});

$(document).keydown(function(e) {
	
    switch(e.which) {
        case 37: // left
			moveCar('left');
        break;

        case 39: // right
			moveCar('right');
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
	
});