/*global angular */

/**
 * The main Security TODOs app module
 *
 * @type {angular.Module}
 */
angular.module('securitytodos', ['ngRoute', 'ngResource'])
	.config(function ($routeProvider) {
		'use strict';

		var routeConfig = {
			controller: 'TodoCtrl',
			templateUrl: 'securitytodos-index.html',
			resolve: {
				store: function (todoStorage) {
					// Get the storage module
					todoStorage.get();
					return todoStorage;
				}
			}
		};

		$routeProvider
			.when('/', routeConfig)
			.when('/:status', routeConfig)
			.otherwise({
				redirectTo: '/'
			});
	});
