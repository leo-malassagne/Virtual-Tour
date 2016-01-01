THREE.ControllersManager = function( pointerLockElement){

	if ( 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document ) {

		var element = pointerLockElement;

		var pointerlockchange = function ( event ) {

			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
				 
				element.style.display = 'none';
				if ( curController.restart )  curController.restart();

			} else {

				element.style.display = '-webkit-box';
				element.style.display = '-moz-box';
				element.style.display = 'box';
				
			}
		
		}

		var pointerlockerror = function ( event ) {

			element.style.display = '';

		}

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		element.addEventListener( 'click', function ( event ) {

			element.style.display = 'none';

			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

			if ( /Firefox/i.test( navigator.userAgent ) ) {

				var fullscreenchange = function ( event ) {

					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

						element.requestPointerLock();
					}

				}

				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

				element.requestFullscreen();

			} else {

				element.requestPointerLock();

			}

		}, false );

	} else {

		blocker.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

	}

	var controllers = [];
	var curController;
	
	this.add = function ( controller ){
		controllers.push(controller);
	}
	
	this.setCurrentController = function ( newCurControl ){
		curController = null;
		var i = 0;
		while(i<controllers.length&&!curController){
			if (controllers[i].getClass() === newCurControl) curController = controllers[i];
			i++;
		}
		if ( curController.needPointerLock() ){
			
			element.style.display = '-webkit-box';
			element.style.display = '-moz-box';
			element.style.display = 'box';
		
		}
		else{
			
			element.style.display = 'none';
		
		}
	}
	
	this.getCurrentController = function(){
		return curController;
	}
	
	this.getCurrentCamera = function(){
		return curController.getCamera();
	}
	
	this.update = function (){
		if( !curController.needPointerLock() || isLocked() ) curController.update();
	}

	var isLocked = function (){
		return document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element;
	}
	
	var onMouseDown = function ( event ){
		if ( curController.onMouseDown ) curController.onMouseDown(event);
	}
	
	var onMouseUp = function ( event ){
		if ( curController.onMouseUp ) curController.onMouseUp(event);
	}
	
	var onMouseWheel = function ( event ){
		if ( curController.onMouseWheel ) curController.onMouseWheel(event);
	}
	
	var onMouseMove = function ( event ){
		if ( curController.onMouseMove ) curController.onMouseMove(event);
	}
	
	var onKeyUp = function ( event ){
		if ( curController.onKeyUp ) curController.onKeyUp(event);
	}
	
	var onKeyDown = function ( event ){
		if ( curController.onKeyDown ) curController.onKeyDown(event);
	}
	
	document.addEventListener("mousedown",onMouseDown,false);
	document.addEventListener("mouseup",onMouseUp,false);
	document.addEventListener("wheel",onMouseWheel,false);
	document.addEventListener("mousemove",onMouseMove,false);
	document.addEventListener("keydown", onKeyDown, false );
	document.addEventListener("keyup", onKeyUp, false );

}