/**
 * @fileOverview Scaling Group detail page JS
 * @requires AngularJS
 *
 */

// Volume page includes the AutoScale tag editor, so pull in that module as well.
angular.module('ScalingGroupPage', ['AutoScaleTagEditor'])
    .controller('ScalingGroupPageCtrl', function ($scope) {
        $scope.minSize = 1;
        $scope.desiredCapacity = 1;
        $scope.maxSize = 1;
        $scope.initChosenSelectors = function () {
            $('#launch_config').chosen({'width': '60%', search_contains: true});
            $('#availability_zones').chosen({'width': '80%', search_contains: true});
            $('#load_balancers').chosen({'width': '80%', search_contains: true});
            $('#termination_policies').chosen({'width': '80%', search_contains: true});
        };
        $scope.setInitialValues = function () {
            $scope.minSize = parseInt($('#min_size').val(), 10);
            $scope.desiredCapacity = parseInt($('#desired_capacity').val(), 10);
            $scope.maxSize = parseInt($('#max_size').val(), 10);
        };
        $scope.initController = function (scalingGroupName, policiesCount) {
            $scope.scalingGroupName = scalingGroupName;
            $scope.policiesCount = policiesCount;
            $scope.setInitialValues();
            $scope.initChosenSelectors();
            $scope.setWatch();
            $scope.setFocus();
            $scope.revealModal();
        };
        $scope.handleSizeChange = function () {
            // Adjust desired/max based on min size change
            if ($scope.desiredCapacity < $scope.minSize) {
                $scope.desiredCapacity = $scope.minSize;
            }
            if ($scope.maxSize < $scope.desiredCapacity) {
                $scope.maxSize = $scope.desiredCapacity;
            }
        };
        $scope.setWatch = function () {
            $(document).on('submit', '[data-reveal] form', function () {
                $(this).find('.dialog-submit-button').css('display', 'none');                
                $(this).find('.dialog-progress-display').css('display', 'block');                
            });
        };
        $scope.setFocus = function () {
            $(document).on('ready', function(){
                $('.tabs').find('a').get(0).focus();
            });
            $(document).on('opened', '[data-reveal]', function () {
                var modal = $(this);
                var modalID = $(this).attr('id');
                if( modalID.match(/terminate/)  || modalID.match(/delete/) || modalID.match(/release/) ){
                    var closeMark = modal.find('.close-reveal-modal');
                    if(!!closeMark){
                        closeMark.focus();
                    }
                }else{
                    var inputElement = modal.find('input[type!=hidden]').get(0);
                    var modalButton = modal.find('button').get(0);
                    var modalLink = modal.find('a').get(0);
                    if (!!inputElement) {
                        inputElement.focus();
                    } else if (!!modalButton) {
                        modalButton.focus();
                    } else if (!!modalLink) {
                        modalLink.focus();
                    }
               }
            });
        };
        $scope.revealModal = function () {
            var thisKey = "do-not-show-nextstep-for-" + $scope.scalingGroupName;
            if ($scope.policiesCount == 0 && Modernizr.localstorage && localStorage.getItem(thisKey) != "true") {
                var modal = $('#nextstep-scalinggroup-modal');
                modal.foundation('reveal', 'open');
                modal.on('click', '.close-reveal-modal', function(){
                    if( modal.find('input#check-do-not-show-me-again').is(':checked') ){
                        Modernizr.localstorage && localStorage.setItem(thisKey, "true");
                    }
                });
            }
        };
    })
;

