var router = angular.module('chatApp.router', ['ui.router']);

router.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('register');

  $stateProvider
    .state('register', {
            url: '/register',
            templateUrl: 'views/register.html',
            controller: 'mainController'
    })

    .state('users', {
            url: '/users',
            templateUrl: 'views/users.html',
            controller: 'mainController'
    })

    .state('chat', {
            url: '/chat',
            templateUrl: 'views/chat.html',
            controller: 'mainController'
    })

    .state('rooms', {
            url: '/rooms',
            templateUrl: 'views/rooms.html',
            controller: 'mainController'
    })

    .state('room', {
            url: '/room',
            templateUrl: 'views/room.html',
            controller: 'mainController'
    })

    .state('choose', {
            url: '/choose',
            templateUrl: 'views/choose.html',
            controller: 'mainController'
    })

});

