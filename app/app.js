angular.module('Aurora', ['router', 'authCtrl', 'authService'])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });