/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {
	
	this.camera = camera;
	
	var enabled = false;
	
	var scope = this;
	var clock = new THREE.Clock();
	
	camera.rotation.set( 0, 0, 0 );
	
	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );
	
	var yawObject = new THREE.Object3D();
	yawObject.position.y += 10;
	yawObject.add( pitchObject );
	
	//yawObject.position.set(-153,-30,458);
	yawObject.position.set(-50,1,300);

	var dir=new THREE.Vector3();
	var raycast = new THREE.Raycaster();
	var norm = new THREE.Vector3();

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	
	var lookUp = false;
	var lookDown = false;
	var lookLeft = false;
	var lookRight = false;
	
	var movementX;
	var movementY;

	var velocity = new THREE.Vector3();
	
	var debugField = document.getElementById("debug");
	var debugOn = false; 

	var onMouseMove = function ( event ) {

		movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 37: // left
				lookLeft = true;
				break;
			
			case 38: // up
				lookUp = true;
				break;
			
			case 39: // right
				lookRight = true;
				break;
				
			case 40: // down
				lookDown = true;
				break;
				
			case 90: // z
				moveForward = true;
				break;

			case 81: // q
				moveLeft = true; break;
				
			case 83: // s
				moveBackward = true;
				break;

			case 68: // d
				moveRight = true;
				break;

			case 69: // e
				debugOn = !debugOn;
				if ( debugOn ) debugField.style.display = 'block' ;
				else debugField.style.display = 'none';
		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 37: // left
				lookLeft = false;
				break;
			
			case 38: // up
				lookUp = false;
				break;
			
			case 39: // right
				lookRight = false;
				break;
				
			case 40: // down
				lookDown = false;
				break;
		
			case 90: // z
				moveForward = false;
				break;

			case 81: // q
				moveLeft = false;
				break;

			case 83: // s
				moveBackward = false;
				break;

			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	
	this.enable = function (bool){
		this.enabled = bool;
		if(enabled) clock.start();
		else clock.stop();
		
	}

	this.getObject = function () {

		return yawObject;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();
	
	this.getRotation = function() {

		// assumes the camera itself is not rotated

		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( 0, yawObject.rotation.y, 0 );

			v.applyEuler( rotation );

			return v;

		}

	}();

	this.update = function () {
		
		var delta = 2 * clock.getDelta();

		var intersections;
		var distance;

		velocity.x -= velocity.x * 2 * delta;
		velocity.z -= velocity.z * 2 * delta;

		velocity.y -= 5 * delta;

		if ( moveForward ) velocity.z -= 4.0 * delta;
		if ( moveBackward ) velocity.z += 4.0 * delta;

		if ( moveLeft ) velocity.x -= 4.0 * delta;
		if ( moveRight ) velocity.x += 4.0 * delta;
		
		if ( lookUp ) pitchObject.rotation.x += delta ;
		if ( lookDown ) pitchObject.rotation.x -= delta ;
		if ( lookLeft ) yawObject.rotation.y += delta ;
		if ( lookRight ) yawObject.rotation.y -= delta ;
		
		raycast.ray.origin.copy( this.getObject().position );
		
		raycast.ray.direction.set(0,-1,0);
		raycast.near = 0;
		raycast.far = 10;
		intersections = raycast.intersectObjects( objects );
		
		if ( intersections.length > 0 ) {
			
			var obstacle = intersections[ 0 ];
			this.getObject().position.y += 9.9-obstacle.distance;
			velocity.y = Math.max(0,velocity.y);
			
		}
		
		raycast.ray.origin.copy( this.getObject().position );
		raycast.ray.origin.y -= 5;
		
		dir.set(velocity.x,0,velocity.z);
		this.getRotation(dir);
		dir.normalize();
		raycast.ray.direction.copy(dir);
		raycast.near = 0;
		raycast.far = 5;
		intersections = raycast.intersectObjects( objects );
		
		if ( intersections.length > 0 ) {
			var obstacle = intersections[ 0 ];
			norm.copy(obstacle.face.normal);
			this.getRotation(norm);
			if ( norm.x ) velocity.x = 0;
			if ( norm.z ) velocity.z = 0;
		}
		
		if ( debugOn ){
		
			var debug ="<table>"
			debug += "<tr><th>Velocity</th><th>Norm</th><th>Position</th><th>Ray Dir</th></tr>";
			debug += "<tr><td>"+Math.round(velocity.x * 100)/100+"</td><td>"+Math.round(norm.x * 100)/100+"</td><td>"+Math.round(yawObject.position.x * 100)/100+"</td><td>"+Math.round(raycast.ray.direction.x * 100)/100+"</td></tr>";
			debug += "<tr><td>"+Math.round(velocity.y * 100)/100+"</td><td>"+Math.round(norm.y * 100)/100+"</td><td>"+Math.round(yawObject.position.y * 100)/100+"</td><td>"+Math.round(raycast.ray.direction.y * 100)/100+"</td></tr>";
			debug += "<tr><td>"+Math.round(velocity.z * 100)/100+"</td><td>"+Math.round(norm.z * 100)/100+"</td><td>"+Math.round(yawObject.position.z * 100)/100+"</td><td>"+Math.round(raycast.ray.direction.z * 100)/100+"</td></tr>";
			debug +="</table>";
		
			debugField.innerHTML = debug;
		}
		
		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;
		
		movementX = 0;
		movementY = 0;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
		
		yawObject.translateX( velocity.x );
		yawObject.translateY( velocity.y ); 
		yawObject.translateZ( velocity.z );

	};
	
	this.getClass = function(){
		
		return "FirstPersonControls";
		
	}
	
	this.needPointerLock = function(){
	
		return true;
		
	}
	
	this.restart = function(){
	
		clock = new THREE.Clock();
		clock.start;
	
	}
	
	this.getCamera = function(){
	
		return camera;
		
	}

};
