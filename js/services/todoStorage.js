/*global angular */

/**
 * Service that persists and retrieves todos from localStorage.
 *
 * It returns promises for all changes to the model.
 */
angular.module('securitytodos')
    .factory('todoStorage', function ($injector) {
        'use strict';

        // Hand off the localStorage adapter
        return $injector.get('localStorage');
    })

    .factory('localStorage', function ($q) {
        'use strict';

        var STORAGE_ID = 'securitytodos';

        var store = {
            todos: [],

            _getFromLocalStorage: function () {
                return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
            },

            _saveToLocalStorage: function (todos) {
                localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
            },

            clearCompleted: function () {
                var deferred = $q.defer();

                var incompleteTodos = store.todos.filter(function (todo) {
                    return !todo.completed;
                });

                angular.copy(incompleteTodos, store.todos);

                store._saveToLocalStorage(store.todos);
                deferred.resolve(store.todos);

                return deferred.promise;
            },

            delete: function (todo) {
                var deferred = $q.defer();

                store.todos.splice(store.todos.indexOf(todo), 1);

                store._saveToLocalStorage(store.todos);
                deferred.resolve(store.todos);

                return deferred.promise;
            },

            get: function () {
                var deferred = $q.defer();

                angular.copy(store._getFromLocalStorage(), store.todos);
                deferred.resolve(store.todos);

                return deferred.promise;
            },

            insert: function (todo) {
                var deferred = $q.defer();

                store.todos.push(todo);

                store._saveToLocalStorage(store.todos);
                deferred.resolve(store.todos);

                return deferred.promise;
            },

            put: function (todo, index) {
                var deferred = $q.defer();

                store.todos[index] = todo;

                store._saveToLocalStorage(store.todos);
                deferred.resolve(store.todos);

                return deferred.promise;
            }
        };

        return store;
    });
