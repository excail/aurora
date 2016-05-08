angular.module('authService', [])
    .factory('Auth', function ($http, $q, authToken) {
        var authFactory = {};

        authFactory.login = function (username, password) {
            return $http.post('/api/login', {
                username: username,
                password: password
            }).success(function (data) {
                authToken.setToken(data.token);
                return data;
            });
        };

        authFactory.logout = function () {
            authToken.setToken();
        };

        authFactory.isLoggedIn = function () {
            return !!authToken.getToken();
        };

        authFactory.getUser = function () {
            if (authToken.getToken()) {
                return $http.get('/api/me');
            } else {
                return $q.reject({message: "User has no token"});
            }
        };

        return authFactory;
    })
    .factory('authToken', function ($window) {
        var authTokenFactory = {};

        authTokenFactory.getToken = function () {
            return $window.localStorage.getItem('token');
        };

        authTokenFactory.setToken = function (token) {
            if (token) {
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        };

        return authTokenFactory;
    })
    .factory('AuthInterceptor', function ($q, $location, authToken) {
        var interceptorFactory = {};

        interceptorFactory.request = function (config) {
            var token = authToken.getToken();

            if (token) {
                config.headers['x-access-token'] = token;
            }

            return config;
        };

        interceptorFactory.responseError = function (response) {
            if (response.status == 403) {
                $location.path('/login');
            }
            return $q.reject(response);
        };

        return interceptorFactory;
    });