angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $timeout) {
 //animación del boton movimiento
  $scope.moveButtons = function() {
      var buttons = document.getElementById('buttons');
      move(buttons)
      .ease('in-out')
      .y(200)
      .duration('0.5s')
      .end();
  };
//Apariencia
$scope.animateVisuals = function() {
	var bg = document.getElementById('contentBG');
	var header = document.getElementById('header');
	move(bg)
	.set('padding', '10%')
	.duration('2s')
	.end(function() {
		move(header)
		.set('background-color', '#4DB6AC')
		.duration('2s')
		.end();
	});
};

//Segunda animación
$scope.blink = function() {
	var bg = document.getElementById('contentBG');
 
	var highlightBack = move(bg)
	.set('background', '#FFFFFF')
	.duration('0.2s')
	.end();
 
	var highlight = move(bg)
	.set('background', '#B9F6CA')
	.duration('0.2s')
	.then(highlightBack)
	.end();
}

//cuarta 
function onTimerTimeout(){
	$scope.time++;
	var timer = document.getElementById('myTimer');
 
	move(timer)
	.ease('snap')
	.set('opacity', 1)
	.scale(1.4)
	.duration('0s')
	.end();
 
	move(timer)
	.ease('out')
	.x(150)
	.rotate(140)
	.scale(.1)
	.set('opacity', 0)
	.duration('1s')
	.end();
	$scope.timerTimeout = $timeout(onTimerTimeout,1000);
}

// tercera animación temporización
$scope.timer = function() {
	if($scope.timerTimeout) {
		$timeout.cancel($scope.timerTimeout);
	}
	$scope.time = 0;
	$scope.timerTimeout = $timeout(onTimerTimeout,0);
}
})
.controller('ChatsCtrl', function($scope, parseUrlFilter) {
  $scope.myHtmlText = "Take a look at my coding blog http://www.devdactic.com or send an email to saimon@devdactic.com";
  //$scope.myHtmlText = parseUrlFilter('Take a look at my coding blog http://www.devdactic.com or send an email to saimon@devdactic.com');
  

})

.controller('AccountCtrl', function($scope, $cordovaToast) {
		$scope.items = ['Ejemplo', 'Ejemplo 2', 'Ejemplo 3', 'Ejemplo 4'];
	 
		$scope.doRefresh = function() {
			$scope.items.push('More items ' + Math.random());
			$scope.$broadcast('scroll.refreshComplete');
	 
			$cordovaToast.showLongBottom('This could be your text!')
			.then(function(success) {
				// Do something on success
			}, function(error) {
				// Handle error
			});
		}
})
.controller('ImageController', function($scope, $cordovaDevice, $cordovaFile, $ionicPlatform, $cordovaEmailComposer, $ionicActionSheet, ImageService, FileService) {
	
	 $ionicPlatform.ready(function() {
		 $scope.images = FileService.images();
		 $scope.$apply();
	 });
	
	 $scope.urlForImage = function(imageName) {
		 var trueOrigin = cordova.file.dataDirectory + imageName;
		 return trueOrigin;
	 }
	
	 $scope.addMedia = function() {
		 $scope.hideSheet = $ionicActionSheet.show({
			 buttons: [
				 { text: 'Take photo' },
				 { text: 'Photo from library' }
			 ],
			 titleText: 'Add images',
			 cancelText: 'Cancel',
			 buttonClicked: function(index) {
				 $scope.addImage(index);
			 }
		 });
	 }
	
	 $scope.addImage = function(type) {
		 $scope.hideSheet();
		 ImageService.handleMediaDialog(type).then(function() {
			 $scope.$apply();
		 });
	 }
	 
	 $scope.sendEmail = function() {
		 if ($scope.images != null && $scope.images.length > 0) {
			 var mailImages = [];
			 var savedImages = $scope.images;
			 if ($cordovaDevice.getPlatform() == 'Android') {
				 // Currently only working for one image..
				 var imageUrl = $scope.urlForImage(savedImages[0]);
				 var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
				 var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
				 $cordovaFile.copyFile(namePath, name, cordova.file.externalRootDirectory, name)
				 .then(function(info) {
					 mailImages.push('' + cordova.file.externalRootDirectory + name);
					 $scope.openMailComposer(mailImages);
				 }, function(e) {
					 reject();
				 });
			 } else {
				 for (var i = 0; i < savedImages.length; i++) {
					 mailImages.push('' + $scope.urlForImage(savedImages[i]));
				 }
				 $scope.openMailComposer(mailImages);
			 }
		 }
	 }
	
	 $scope.openMailComposer = function(attachments) {
		 var bodyText = '<html><h2>My Images</h2></html>';
		 var email = {
				 to: 'some@email.com',
				 attachments: attachments,
				 subject: 'Devdactic Images',
				 body: bodyText,
				 isHtml: true
			 };
	
		 $cordovaEmailComposer.open(email).then(null, function() {
			 for (var i = 0; i < attachments.length; i++) {
				 var name = attachments[i].substr(attachments[i].lastIndexOf('/') + 1);
				 $cordovaFile.removeFile(cordova.file.externalRootDirectory, name);
			 }
		 });
	 }
	});