app.filter('dateFromNow', function() {
    return function(date) {
        if (!moment) {
            console.log('Error: momentJS is not loaded as a global');
            return '!momentJS';
        }
        return moment(date).fromNow();
    }
});

app.directive("fileread", [() => ({
        scope: {
            fileread: "="
        },

        link(scope, element, attributes) {
            element.bind("change", changeEvent => {
                const reader = new FileReader();
                reader.onload = loadEvent => {
                    scope.$apply(() => {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    })]);

app.directive('time', [
    '$timeout',
    '$filter',
    function($timeout, $filter) {

        return function(scope, element, attrs) {
            var time = attrs.time;
            var intervalLength = 1000 * 10; // 10 seconds
            var filter = $filter('dateFromNow');

            function updateTime() {
                element.text(filter(time));
            }

            function updateLater() {
                timeoutId = $timeout(function() {
                    updateTime();
                    updateLater();
                }, intervalLength);
            }

            element.bind('$destroy', function() {
                $timeout.cancel(timeoutId);
            });

            updateTime();
            updateLater();
        };

    }
]);