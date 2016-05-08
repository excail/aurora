angular.module('router', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './html/page/login.html'
            })
            .when('/home', {
                templateUrl: './html/page/home.html'
            })
            .when('/welcome', {
                templateUrl: './html/page/welcome.html'
            })
            .when('/signup', {
                templateUrl: './html/page/signup.html'
            })
            .when('/users', {
                templateUrl: './html/page/users.html'
            })
    });