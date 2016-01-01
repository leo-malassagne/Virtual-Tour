
THREE.TrackballControls = function ( camera ) {
	
	this.camera = camera;
	
	camera.position.set( 0, 0, 500 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.add( pitchObject );
	
	var curX = 0, curY = 0 , lastX = 0, lastY = 0;
	
	var hold = false;
	
	this.getObject = function (){
		
		return yawObject;
		
	}
	
	this.update = function (){
	
		if( hold ){
			pitchObject.rotation.x -= (curY - lastY) * 0.01;
			var angle = Math.abs(pitchObject.rotation.x % (2 * Math.PI)) - Math.PI;
			yawObject.rotation.y -= (curX - lastX) * 0.01;
			
			lastX = curX;
			lastY = curY;
		}
		
	}
	
	this.needPointerLock = function(){
	
		return false;
		
	}
	
	this.getCamera = function(){
	
		return camera;
	
	}
	
	this.onMouseDown = function ( event ){
	
		curX = event.clientX;
		lastX = event.clientX;
		curY = event.clientY;
		lastY = event.clientY;
		hold = true;
		
	}
	
	this.onMouseUp = function ( event ) {
	
		hold = false;
		
	}
	
	this.onMouseMove = function ( event ){
		if( hold ){
			curX = event.clientX;
			curY = event.clientY;
		}
	}
	
	this.onMouseWheel = function ( event ){
		
		var move = 30 * (event.deltaY / Math.abs(event.deltaY))
		var dist = camera.position.distanceTo( yawObject.position );
		if( dist + move >= 100 && dist + move <= 1000) camera.position.z += move ;
		
	}
	
	this.getClass = function(){
		
		return "TrackballControls";
		
	}
	
}