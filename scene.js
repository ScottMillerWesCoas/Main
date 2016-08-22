// START THREE.JS
//FOR TESTING POINTS
// 'use strict';

$(function() {
Physijs.scripts.worker = 'lib/physijs_worker.js'; //webworker used to minimize latency re phys.js
Physijs.scripts.ammo = 'ammo.js';

// in case window changes
function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth, window.innerHeight );
   render();
}

window.addEventListener( 'resize', onWindowResize, false );

var camera, renderer, mesh;
var startTime  = Date.now();
var keyboard = {};
scene = new Physijs.Scene;
scene.setGravity(new THREE.Vector3( 0, -20, 0 ));
scene.addEventListener(
  'update',
  function() {
    scene.simulate( undefined, 2 );
  }
);

renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true } );
renderer.setClearColor(0x000000, 0);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// choose camera
camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.x = 13;
camera.position.y = 3;
camera.position.z = 0;
camera.lookAt(new THREE.Vector3(0,3,0))


// add earth w/ clouds to scene
scene.add( earth );

// add ball
addBall = function() {
  if (user.myTurn === true) {
    ball.position.z = 0;
    ball.position.x = 5;
    ball.position.y = .3;
    console.log('ball added!')
    ball.collisions = 0;
    scene.add( ball );
  } else {
    ball2.position.z = 0;
    ball2.position.x = -7;
    ball2.position.y = .3;
    console.log('ball2 added!')
    ball.collisions = 0;
    scene.add( ball2 );
  }
}
addBall();

//add target
scene.add( target );

// add second target
scene.add( target2 );

// add astronaut
objLoader.load( 'assets/astronaut/player2_body.OBJ', function ( object ) {
  object.traverse( function ( child ) {
       if ( child instanceof THREE.Mesh ) {
        child.material.map = imageMap;
        child.material.normalMap = normalMap;
        child.material.specularMap = specMap;
        child.castShadow = true;
      }
    });
  scene.add(object);
});

// add hand
objLoader.load( 'assets/astronaut/player1_hand.OBJ', function ( object ) {
  object.traverse( function ( child ) {
       if ( child instanceof THREE.Mesh ) {
        child.material.map = imageMap;
        child.material.normalMap = normalMap;
        child.material.specualarMap = specMap;
        child.castShadow = true;
      }
    });

  scene.add( object );
});

// add moon floor
var floorImage = new THREE.Texture();

imgLoader.load('assets/finalMoonPics/Larissa-Texture.png', function(img) {
  floorImage.image = img;
  floorImage.needsUpdate = true;
});

objLoader.load( 'assets/finalMoonPics/moon_floor.OBJ', function ( object ) {
  object.traverse( function ( child ) {
       if ( child instanceof THREE.Mesh ) {
        child.material.map = floorImage;
        child.receiveShadow = true;
      }
    });
  scene.add( object );
});

//fake floor (invisible)
scene.add( fakeFloor );

// add lighting
scene.add( spotLight );
scene.add( spotLight2 );


function render() {

  scene.simulate(); // run physics

  earth.rotation.x += parameters.rotateX;
  earth.rotation.y -= parameters.rotateY;
  earth.rotation.z += parameters.rotateZ;

  cloudMesh.rotation.x -= parameters.cRotateX;
  cloudMesh.rotation.y -= parameters.cRotateY;

  // continue send condition
  if (moved === true && user.myTurn === true) {
    var xPos = -7 + (5 - ball.position.x);
    var yPos = ball.position.y;
    var zPos = ball.position.z;
    var xRot = ball.rotation.x
    var yRot = ball.rotation.y
    var zRot = ball.rotation.z;
    displayMessage('Height: ' + Math.abs(ball.position.y), 'Distance: ' + Math.abs(ball.position.x - 6));
    sendPosition(xPos, yPos, zPos, xRot, yRot, zRot);
  }

  // received condition
  if (moved === true && user.myTurn === false) {
    ball2.position.x = message.position[0];
    ball2.position.y = message.position[1];
    ball2.position.z = message.position[2];
    ball2.rotation.x = -(message.rotation[0]);
    ball2.rotation.y = -(message.rotation[1]);
    ball2.rotation.z = -(message.rotation[2]);
  }

  // start sending condition, sets projectile motion
  if (keyboard[32]){
    ball.setLinearVelocity(new THREE.Vector3(-5, 7, 0));
    moved = true;
    dataChannel.send(JSON.stringify({ 'moved': moved }));
    sendPosition((-7 + (5 - ball.position.x)), ball.position.y, ball.position.z, ball.rotation.x, ball.rotation.y, ball.rotation.z);
  }

  // press 's' to stop sending and animation, testing purposes only
  if (keyboard[83]) {
    moved = false;
    dataChannel.close();
    stopAnimation();
  }

  if (delayedTrackerTime.counter >= 10 && delayedTrackerTime.flag === true){
    console.log('sp1', trackerTime.counter);
    ball.setLinearVelocity(new THREE.Vector3(-9, 13, 0));
    delayedTrackerTime.flag = false;
    delayedTrackerTime.counter = 0;
    demo.clear();
  }

  if (delayedTrackerTime.counter >= 5 && delayedTrackerTime.counter < 10 && delayedTrackerTime.flag === true){
    console.log('sp2', delayedTrackerTime.counter);
    ball.setLinearVelocity(new THREE.Vector3(-8.4, 12, 0));
    delayedTrackerTime.flag = false;
    delayedTrackerTime.counter = 0;
    demo.clear();
  }

  if (delayedTrackerTime.counter > 3 && delayedTrackerTime.counter < 5 && delayedTrackerTime.flag === true){
    console.log('sp3', trackerTime.counter);
    ball.setLinearVelocity(new THREE.Vector3(-9, 13, 0));
    delayedTrackerTime.flag = false;
    delayedTrackerTime.counter = 0;
    demo.clear();
   }

  if (delayedTrackerTime.counter > 0 && delayedTrackerTime.counter <= 3 && delayedTrackerTime.flag === true){
    console.log('sp4', trackerTime.counter);
    ball.setLinearVelocity(new THREE.Vector3(-9, 13, 0));
    delayedTrackerTime.flag = false;
    delayedTrackerTime.counter = 0;
    demo.clear();
   }

  var spaceScene = requestAnimationFrame( render );
  renderer.render( scene, camera );
}

render();

function keyDown(event){
  keyboard[event.keyCode] = true;
}

function keyUp(event){
  keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);


// for appending game messages to the DOM
$('#bg').prepend( renderer.domElement );

var throwBall = $( "<button id='throwBall'>Click anywhere to throw!</button>" );
var pointsDiv = $( "<div id='pointsDiv'>Player 1 Points: <span id ='p1Points'>" + user.points + "</span><br>Player 2 Points: <span id='p2Points'>" + user.points + " </span> </div>" );
$('#bg').append(pointsDiv);
$('#bg').append(throwBall);
$('#pointsDiv').fadeOut(0);
$('#throwBall').fadeOut(0);

});

function sendPosition(x, y, z, xr, yr, zr) {
  var toSend = { 'type': 'ballPos', 'position': [ x, y, z ], 'rotation': [ xr, yr, zr ] };
  dataChannel.send(JSON.stringify(toSend));
}

function stopAnimation() {
  cancelAnimationFrame( spaceScene );
  console.log('Animation stopped!')
}
