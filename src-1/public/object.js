'use strict';

function Tank(position) {
  this.position = position;
  this.velocity = new Vector(1, 0);
  this.rotation = degreesToRadians(90);

  let alpha = Math.random() + 0.2;
  let r = getRandomInt(0, 255);
  let g = getRandomInt(0, 255);
  let b = getRandomInt(0, 255);

  this.color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  this.width = 50;
  this.height = 20;
  this.center = new Vector(this.position.x + this.width/2, this.position.y + this.height/2);

  this.wheelRadius = 5;

  this.rotationSpeed = 5;
  this.moveSpeed = 5;

  this.nearestDistToCheckpoint = Number.POSITIVE_INFINITY;
  this.checkpointIndex = 0;
  this.checkpoints = [
    new Checkpoint(new Vector(170000, 170000))
  ];

  this.allPositions = [];
  this.recentMovements = [];
  this.totalDistance = 0

  this.stopped = false;

  this.sensors = {
      frontLeft: {
          offsetPos: new Vector(this.width-8, 8),
          position: new Vector(this.width, 15),
          offsetAngle: degreesToRadians(-10),
          direction: Vector.zero,
          length: 2000,
          hitDistance: 1500
      },
      frontRight : {
          offsetPos: new Vector(this.width-8, this.height-8),
          position: new Vector(this.width, this.height - 15),
          offsetAngle: degreesToRadians(+10),
          direction: Vector.zero,
          length: 2000,
          hitDistance: 1500
      },
      leftSide : {
          offsetPos: new Vector(this.width - 15, 15),
          offsetAngle: degreesToRadians(+30),
          position: new Vector(this.width - 15, 0),
          direction: Vector.zero,
          length: 2000,
          hitDistance: 2000
      },
      rightSide: {
          offsetPos: new Vector(this.width - 15, this.height - 15),
          position: new Vector(this.width - 15, this.height),
          offsetAngle: degreesToRadians(-30),
          direction: Vector.zero,
          length: 2000,
          hitDistance: 2000
      }
  };
}

function Checkpoint(position) {
  this.radius = 50;
  this.position = position;
  this.checked = false;
}