define(['common/directives'], function (directives) {
    directives.directive('pagination', function () {
        return {
            restrict: 'E',
            template: '',
            replace: true,
            link: function (scope, element, attrs) {
                scope.$watch('numPages', function (value) {
                    scope.pages = [];
                    for (var i = 1; i <= value; i++) {
                        scope.pages.push(i);
                    }
                    if (scope.currentPage > value) {
                        //scope.selectPage(value);
                    }
                });
                scope.isActive = function (page) {
                    return scope.currentPage === page;
                };
                scope.selectPage = function (page) {
                    if (!scope.isActive(page)) {
                        scope.currentPage = page;
                        scope.onSelectPage(page);
                    }
                };
                scope.dialogSelectPage = function (page) {

                        scope.dialogCurrentPage = page;
                        scope.onDialogSelectPage(page);

                };
                scope.selectPrevious = function () {
                    if (!scope.noPrevious()) {
                        scope.selectPage(scope.currentPage - 1);
                    }
                };
                scope.selectNext = function () {
                    if (!scope.noNext()) {
                        scope.selectPage(scope.currentPage + 1);
                    }
                };
                scope.noPrevious = function () {
                    return scope.currentPage == 1;
                };
                scope.noNext = function () {
                    return scope.currentPage == scope.numPages;
                };

            }
        };
    });
    directives.directive('pagination2', function () {
        return {
            restrict: 'E',
            template: '',
            replace: true,
            link: function (scope, element, attrs) {
                scope.$watch('dialogPageCount', function (value) {
                    scope.dialogPages = [];
                    for (var i = 1; i <= value; i++) {
                        scope.dialogPages.push(i);
                    }
                    if (scope.dialogCurrentPage > value) {
                        scope.dialogSelectPage(value);
                    }
                });
                scope.isActive = function (page) {
                    return scope.currentPage === page;
                };
                scope.selectPage = function (page) {
                    if (!scope.isActive(page)) {
                        scope.currentPage = page;
                        scope.onSelectPage(page);
                    }
                };
                scope.dialogSelectPage = function (page) {

                    scope.dialogCurrentPage = page;
                    scope.onDialogSelectPage(page);

                };
                scope.activitySelectPage = function (page) {

                    scope.dialogCurrentPage = page;
                    scope.onActivitySelectPage(page);

                };
                scope.selectPrevious = function () {
                    if (!scope.noPrevious()) {
                        scope.selectPage(scope.currentPage - 1);
                    }
                };
                scope.selectNext = function () {
                    if (!scope.noNext()) {
                        scope.selectPage(scope.currentPage + 1);
                    }
                };
                scope.noPrevious = function () {
                    return scope.currentPage == 1;
                };
                scope.noNext = function () {
                    return scope.currentPage == scope.numPages;
                };

            }
        };
    });
    directives.directive('draggable', ['$document', function($document) {
        return function(scope, element, attr) {
            var startX = 0, startY = 0, x = 0, y = 0;
            element= angular.element(document.getElementsByClassName("modal-dialog"));
            element.css({
                position: 'relative',
                cursor: 'move'
            });

            element.on('mousedown', function(event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                element.css({
                    top: y + 'px',
                    left:  x + 'px'
                });
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        };
    }]);
    directives.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
});
