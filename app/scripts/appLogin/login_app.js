// The app/scripts/app.js file, which defines our AngularJS app
define(['angular', 'common/controllers',
    'common/services', 'common/filters',
    'common/directives'
], function (angular) {
    return angular.module('MyApp', ['controllers', 'services',
        'filters', 'directives','ui.router'
    ]);
});
