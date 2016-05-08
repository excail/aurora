angular.module('Aurora', ['router', 'authCtrl', 'userListCtrl', 'loginFormCtrl', 'authService'])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });