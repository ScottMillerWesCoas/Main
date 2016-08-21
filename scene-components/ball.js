'use strict';

var textureLoader = new THREE.TextureLoader();
var ballGeometry = new THREE.SphereGeometry(.3, 28.8, 14.4),
handleCollision = function( collided_with, linearVelocity, angularVelocity ) {
        switch ( ++this.collisions ) {
          case 2:
            console.log('HIT GROUND!', collided_with.position, 'ball pos', this.position, 'target pos', target.position);
            this.material.color.setHex(0xcc8855);
            if ( user.pointFlag === true && ((this.position.x - target.position.x) > -2) && ((this.position.x - target.position.x) < 2)  && ((this.position.z - target.position.z) < 2)  && ((this.position.z - target.position.z) < 2) ){
              user.points += 2;
              user.pointFlag = false;
              console.log("Player got 2 points!", user);
              setTimeout(stopAnimation(), 2000);
            }
            else if ( user.pointFlag === true && ((this.position.x - target.position.x) > -3.5) && ((this.position.x - target.position.x) < 3.5)  && ((this.position.z - target.position.z) < 3.5)  && ((this.position.z - target.position.z) < 3.5) ){
              user.points += 1;
              user.pointFlag = false;
              console.log("Player got 1 point!", user);
              setTimeout(stopAnimation(), 2000);
            } // else {
            //   console.log('Tough break, no points!!', target.position);
            //   setTimeout(stopAnimation(), 2000);
            // }
        }
    };

var moonNormal  = textureLoader.load('assets/finalMoonPics/normal.jpg');
var moonMap = textureLoader.load('assets/finalMoonPics/moonPic.jpg');
var ballTexture = new THREE.MeshPhongMaterial( { map: moonMap, normalMap: moonNormal} );//TEST RED BALL FOR LOAD TIME
var ballTexture2 = new THREE.MeshPhongMaterial( { color: 0xFF0000} );

var ball = new Physijs.SphereMesh(ballGeometry, ballTexture, undefined, .9 );
ball.castShadow = true;
ball.collisions = 0;
ball.__dirtyPosition = true;
ball.receiveShadow = true;
ball.addEventListener( 'collision', handleCollision );

var ball2 = new Physijs.SphereMesh(ballGeometry, ballTexture, undefined, .9 );
