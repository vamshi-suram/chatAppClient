var router = angular.module('chatApp.router', ['ui.router']);

router.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/users');

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

});

