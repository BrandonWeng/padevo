// Benson Pan June 2017
module MainAppController {
  export class SearchController {
    constructor(
      private $scope : any,
      private $http : ng.IHttpService,
      private $routeParams
    ) {

      (<any>angular.element('.monster-dropdown')).select2({
        width: '100%',
        placeholder: "Select a monster",
        ajax: {
          url: "/api/list",
          dataType: 'json',
          delay: 250,
          data: function (params) {
            return {
              q: params.term, // search term
              page: params.page
            };
          },
          processResults: function (data, params) {
            var pageSize = 20;
// parse the results into the format expected by Select2
// since we are using custom formatting functions we do not need to
// alter the remote JSON data, except to indicate that infinite
// scrolling can be used
            params.page = params.page || 1;
            // console.log("results: ", data);
            // console.log(params.page * 10, params, data);

            return {
              results: data,
              pagination: {
                more: (params.page * pageSize) <= data.length * params.page
              }
            };
          },
          cache: true
        }






      })
      .on("select2:select", (e) => {
        $scope.formData = {monster_id : parseInt(e.params.data.text)};
        window.location = '#!/monster?id=' + $scope.formData.monster_id;
      })
      .val($routeParams.id + ' ' + angular.element( '.monster-name').text())
      .trigger('change');

      angular.element( ".monster-dropdown").on("select2:open", function() {
        angular.element( ".select2-search__field").attr("placeholder", "Search for a monster...");
      });

      angular.element( ".monster-dropdown").on("select2:close", function() {
        angular.element( ".select2-search__field").attr("placeholder", null);
      });
    }
  }

  export interface IMainControllerScope extends ng.IScope {
    monsters : any;
    formData : any;
    monsterHint : any;

    getRequest : () => void;
    indexOfMonster : (id : number) => number;
    randMonsterImage : () => void;
    imageClick : (idx : number) => void;

    // evo material monster hint methods
    saveMonsterHint : (id : number) => void;
    showHint : (idx : number) => void;
    getNumber : (num : string) => any[];
  }

  export class MainController {
    constructor(
      private $scope : IMainControllerScope,
      private $http : ng.IHttpService,
      private $compile : ng.ICompileService,
      private $location
    ) {
      $scope.formData = {monster_id : 1};
      $scope.monsterHint = [];

      ////////////////////////////////
      // initalize the monster array
      ////////////////////////////////
      $http.get('/list_of_monsters').then((data) => {
        $scope.monsters = data.data;
      });

      //////////////////////////////////////////////////
      // perform get request with the selected monster
      //////////////////////////////////////////////////
      $scope.getRequest = () => {
        console.log('DATA', $scope.formData);
        $location.path('/monster').search('id',$scope.formData.monster_id);
      }

      ////////////////////////////////////////////////////////////////////
      // match monster by id (note array index not always == monster id)
      ////////////////////////////////////////////////////////////////////
      $scope.indexOfMonster = (id) => {
        console.log('looking for', id)
        for (var i = 0 ; i < $scope.monsters.length ; i++) {
            if ($scope.monsters[i].indexOf(id) !== -1)
            return i;
        }
        return -1; // not found
      }

      ////////////////////////////////////////////
      // handle image click, perform get request
      ////////////////////////////////////////////
      $scope.imageClick = (idx) => {
        $scope.formData = {monster_id: idx}
        $scope.getRequest();
      }

      ///////////////////////////////////////////
      // add a new monster image and transition
      ///////////////////////////////////////////
      $scope.randMonsterImage = () => {
        var id = Math.floor(Math.random() * ($scope.monsters.length));
        var img = angular.element( "<img ng-click='imageClick("+ parseInt($scope.monsters[id]) + ")' class='floating' src='/images/" + parseInt($scope.monsters[id]) + ".png'/>");
        angular.element( '#hover-img-container').append(img);
        $compile(img)($scope);
        setTimeout(function(){
            var min = 0, max = 100;
            var shift = Math.random() < 0.5 ? 120 : -120;
            var shiftY = Math.random() < 0.5 ? 100 : -100;
            var leftShift = Math.floor(Math.random() * (max - min + 1)) + min + shift;
            var topShift = Math.floor(Math.random() * (max - min + 1)) + min + shiftY;
            var rotate = (Math.floor(Math.random() * (max * 20 - 360 + 1)) + 360 )* shift / 100;

            img.css({
              'left': leftShift.toString() + '%',
              'top': topShift.toString() + '%',
              'transform': 'rotate(' + rotate.toString() + 'deg)'
            });

            img.mouseout((e)=>{
              img.css({
                  'left': leftShift.toString() + '%',
                  'top': topShift.toString() + '%',
                  'transform': 'rotate(' + rotate.toString() + 'deg)'
              })
            });

            img.mouseenter((e) => {
              var computed = window.getComputedStyle((<any>e).toElement);
              var shift = computed.getPropertyValue('transform');

              img.css({
                  'left': computed.getPropertyValue('left'),
                  'top': computed.getPropertyValue('top'),
                  'transform': computed.getPropertyValue('transform')
              })
            })
        }, 100);
      };

      // used for ng-repeat
      $scope.getNumber = (num) => {
        return new Array(num);
      }

      ///////////////////////////////////////////////
      // store monster ids to fetch for description
      ///////////////////////////////////////////////
      $scope.saveMonsterHint = (id) => {
        $scope.monsterHint.push(id);
      }

      /////////////////////
      // toggle help text
      /////////////////////
      $scope.showHint = (idx) => {
        angular.element( '.evo_material .tip-wrapper').eq(idx).toggleClass('showTip');

        if (angular.element( 'h4').eq(idx).hasClass('new')) {
          angular.element( 'h4').eq(idx).removeClass('new');
          angular.element( 'h4').eq(idx).append($scope.monsters[$scope.indexOfMonster($scope.monsterHint[idx])].substring($scope.monsterHint[idx].toString().length));
        }
      }

      /////////////////////////
      // initalize animations
      /////////////////////////
      if (angular.element( '#hover-img-container').length > 0){
        setInterval(() => {
            var windowRect = document.body.getBoundingClientRect();
            angular.element( '.floating').each((idx, obj) => {
              var imageRect = obj.getBoundingClientRect();
              if ((windowRect.right < imageRect.left || windowRect.left > imageRect.right))
              obj.remove();
            });
        },1000);

        setInterval(() => {
            if (Math.random() < 0.5 && !$scope.doNotCreate)
              $scope.randMonsterImage();
        }, 750)
      }


  //     $scope.$watch(function() {
  //     return angular.element(".nested:not(.closed)").length;
  // }, function (newVal, oldVal) {
  //     if(newVal !== oldVal) {
  //        console.log('changed!', newVal, oldVal);
  //        // do your changes here
  //     }
  // });

      // ensure animations are not running if MainController is not removed correctly
      $scope.$on("$destroy", function handler() {
        $scope.doNotCreate = true;
      });
    }
  }

  var mainModule = angular.module('MainAppController', ['ngSanitize', 'ngRoute']);
  mainModule.config(($routeProvider, $locationProvider) => {
    $routeProvider
      .when('', {
        redirectTo : '/'
      })
      .when('/', {
        templateUrl: '/home'
      })
      .when('/monster', {
        templateUrl : function(params) {
          if (params.id) {
            console.log(params); return '/monster/'+params.id
          }
        }
      })
      .when('/error', {
        templateUrl: '/error'
      })
      .otherwise({
        redirectTo : '/error'
      })
  });
  mainModule.controller('MainController', ['$scope', '$http', '$compile', '$location', MainAppController.MainController]);
  mainModule.controller('SearchController', ['$scope', '$http', '$routeParams', MainAppController.SearchController])
}
