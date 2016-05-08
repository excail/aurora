angular.module('userService', [])
    .factory('User', function ($http, $q) {
        var userFactory = {};

        userFactory.createNew = function (userData) {
            var deferred = $q.defer();

            userFactory.getAll().success(function (data) {
                var usernameExists = data.find(function (user) {
                    return user.username == userData.username;
                });

                if (usernameExists) {
                    deferred.reject({message: "User with this name already exists."});
                } else {
                    deferred.resolve($http.post('/api/signup', userData));
                }
            });

            return deferred.promise;
        };

        userFactory.getAll = function () {
            return $http.get('/api/users');
        };

        return userFactory;
    });