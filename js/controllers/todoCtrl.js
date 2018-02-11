/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('securitytodos')
    .controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, store) {
        'use strict';

        var todos = $scope.todos = store.todos;

        $scope.newTodo = '';
        $scope.editedTodo = null;

        $scope.$watch('todos', function () {
            $scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
            $scope.completedCount = todos.length - $scope.remainingCount;
            $scope.allChecked = !$scope.remainingCount;

            // calculate points for all completed items
            $scope.points = $scope.countPoints();

            $scope.showAddAnyTodos          = $scope.isShowAddAnyTodos();
            $scope.showAddBeginnerTodos     = $scope.isShowAddBeginnerTodos();
            $scope.showAddIntermediateTodos = $scope.isShowAddIntermediateTodos();
            $scope.showAddAdvancedTodos     = $scope.isShowAddAdvancedTodos();
        }, true);

        // Monitor the current route for changes and adjust the filter accordingly.
        $scope.$on('$routeChangeSuccess', function () {
            var status = $scope.status = $routeParams.status || '';

            // status param is now overloaded to include level
            if (status === 'active') {
                $scope.statusFilter = { completed: false };
            } else if (status === 'completed') {
                $scope.statusFilter = { completed: true };
            } else if (status === 'beginner') {
                $scope.statusFilter = { level: 'beginner' };
            } else if (status === 'intermediate') {
                $scope.statusFilter = { level: 'intermediate' };
            } else if (status === 'advanced') {
                $scope.statusFilter = { level: 'advanced' };
            } else {
                $scope.statusFilter = {};
            }
        });

        $scope.countPoints = function () {
            var points = 0

            todos.forEach(function (todo) {
                if (todo.completed && todo.points > 0) {
                    points += todo.points
                }
            });

            return points;
        }


        // Level-specific functions

        // Beginner
        $scope.isShowAddBeginnerTodos = function () {
            return $scope.levelTodosAreAllAdded(suggestedBeginnerTodos);
        }
        $scope.addBeginnerTodos = function () {
            $scope.addUniqueTodos(suggestedBeginnerTodos);
        }

        // Intermediate
        $scope.isShowAddIntermediateTodos = function () {
            return $scope.levelTodosAreAllAdded(suggestedIntermediateTodos);
        }
        $scope.addIntermediateTodos = function () {
            $scope.addUniqueTodos(suggestedIntermediateTodos);
        }

        // Advanced
        $scope.isShowAddAdvancedTodos = function () {
            return $scope.levelTodosAreAllAdded(suggestedAdvancedTodos);
        }
        $scope.addAdvancedTodos = function () {
            $scope.addUniqueTodos(suggestedAdvancedTodos);
        }

        // End: Level-specific functions


        $scope.addUniqueTodos = function (todosToAdd) {

            todosToAdd.forEach(function (todo) {

                // only add if it's not there already
                if (!$scope.todoExistsByTitle(todo.title)) {

                    $scope.saving = true;
                    store.insert($scope.copyTodo(todo))
                        .then(function success() {

                        })
                        .finally(function () {
                            $scope.saving = false;
                        });
                }
           });
        }

        $scope.levelTodosAreAllAdded = function (levelTodos) {
            var foundNewTodo = false;

            levelTodos.forEach(function (todo) {
                if (!$scope.todoExistsByTitle(todo.title)) {
                    foundNewTodo = true;
                    return;
                }
            });

            return foundNewTodo;
        }


        $scope.copyTodo = function (todo) {
            var copyTodo = {
                title:       todo.title.slice(0),
                completed:   todo.completed,
                points:      todo.points,
                level:       todo.level,
                description: todo.description
            };
            return copyTodo;
        }


        $scope.isShowAddAnyTodos = function () {
            return $scope.isShowAddBeginnerTodos() || $scope.isShowAddIntermediateTodos() || $scope.isShowAddAdvancedTodos();
        }

        $scope.todoExistsByTitle = function (title) {
            return $filter('filter')(todos, { title: title }).length > 0;
        }

        $scope.addTodo = function () {
            var newTodo = {
                title: $scope.newTodo.trim(),
                completed: false,
                points: 1,
                level: 'custom',
                description: ''
            };

            if (!newTodo.title) {
                return;
            }

            $scope.saving = true;
            store.insert(newTodo)
                .then(function success() {
                    $scope.newTodo = '';
                })
                .finally(function () {
                    $scope.saving = false;
                });
        };

        $scope.editTodo = function (todo) {
            $scope.editedTodo = todo;
            // Clone the original todo to restore it on demand.
            $scope.originalTodo = angular.extend({}, todo);
        };

        $scope.saveEdits = function (todo, event) {

            // Blur events are automatically triggered after the form submit event.
            // This does some unfortunate logic handling to prevent saving twice.
            if (event === 'blur' && $scope.saveEvent === 'submit') {
                $scope.saveEvent = null;
                return;
            }

            $scope.saveEvent = event;

            if ($scope.reverted) {
                // Todo edits were reverted-- don't save.
                $scope.reverted = null;
                return;
            }

            todo.title = todo.title.trim();

            if (todo.title === $scope.originalTodo.title) {
                $scope.editedTodo = null;
                return;
            }

            store[todo.title ? 'put' : 'delete'](todo)
                .then(function success() {}, function error() {
                    todo.title = $scope.originalTodo.title;
                })
                .finally(function () {
                    $scope.editedTodo = null;
                });
        };

        $scope.revertEdits = function (todo) {
            todos[todos.indexOf(todo)] = $scope.originalTodo;
            $scope.editedTodo = null;
            $scope.originalTodo = null;
            $scope.reverted = true;
        };

        $scope.removeTodo = function (todo) {
            store.delete(todo);
        };

        $scope.saveTodo = function (todo) {
            store.put(todo);
        };

        $scope.toggleCompleted = function (todo, completed) {
            if (angular.isDefined(completed)) {
                todo.completed = completed;
            }
            store.put(todo, todos.indexOf(todo))
                .then(function success() {}, function error() {
                    todo.completed = !todo.completed;
                });
        };

        $scope.clearCompletedTodos = function () {
            store.clearCompleted();
        };

        $scope.markAll = function (completed) {
            todos.forEach(function (todo) {
                if (todo.completed !== completed) {
                    $scope.toggleCompleted(todo, completed);
                }
            });
        };
    });
