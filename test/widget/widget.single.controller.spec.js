describe('Unit : vimeoPluginWidget widget.single.controller.js', function () {
  describe('Unit : when routeParams.videoId have false value', function () {
    var WidgetSingle, $controller, routeParams, $scope;
    beforeEach(module('vimeoPluginWidget'));
    beforeEach(inject(function (_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      routeParams = {
        videoId: ""
      };
    }));

    beforeEach(function () {
      WidgetSingle = $controller('WidgetSingleCtrl', {
        $routeParams: routeParams,
        $scope: $scope
      });
    });

    describe('Function : WidgetSingle.getSingleVideoDetails Not Called', function () {
      it('it should if WidgetSingle.video is null', function () {
        expect(WidgetSingle.video).toEqual(null);
      });
    });
  });

  describe('Unit :  when routeParams.videoId have valid videoId', function () {
    var WidgetSingle, $httpBackend, $scope, VimeoApi, _url, LAYOUTS, videoItemDetailMoke, VIMEO_KEYS, $rootScope, q, $controller, DataStore, routeParams, TAG_NAMES, STATUS_CODE, STATUS_MESSAGES, CONTENT_TYPE;
    beforeEach(module('vimeoPluginWidget'));
    beforeEach(inject(function (_$rootScope_, _$q_, _$httpBackend_, _$controller_, _VimeoApi_, _VIMEO_KEYS_, _LAYOUTS_, _TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_) {
      q = _$q_;
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      $controller = _$controller_;
      VimeoApi = _VimeoApi_;
      TAG_NAMES = _TAG_NAMES_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
      $httpBackend = _$httpBackend_;
      VIMEO_KEYS = _VIMEO_KEYS_;
      LAYOUTS = _LAYOUTS_;
      DataStore = {};
      DataStore = jasmine.createSpyObj('DataStore', ['get', 'onUpdate', 'clearListener']);
      DataStore.get.and.callFake(function () {
        var deferred = q.defer();
        deferred.resolve({
          data: {
            "content": {
              "carouselImages": [],
              "description": '<p>&nbsp;<br></p>',
              "rssUrl": "",
              "type": ""
            },
            "design": {
              "itemListLayout": LAYOUTS.listLayouts[0].name,
              "itemListBgImage": "",
              "itemDetailsBgImage": ""
            }
          }
        });
        return deferred.promise;
      });
      DataStore.onUpdate.and.callFake(function () {
        var deferred = q.defer();
        deferred.notify({
          tag: 'VimeoInfo',
          data: {
            "content": {
              "carouselImages": [],
              "description": '<p>&nbsp;<br></p>',
              "rssUrl": "",
              "type": ""
            },
            "design": {
              "itemListLayout": LAYOUTS.listLayouts[1].name,
              "itemListBgImage": "",
              "itemDetailsBgImage": ""
            }
          }
        });
        return deferred.promise;
      });
      routeParams = {
        videoId: "133130486"
      };
    }));

    beforeEach(function () {
      WidgetSingle = $controller('WidgetSingleCtrl', {
        $routeParams: routeParams,
        $q: q,
        $scope: $scope,
        DataStore: DataStore,
        TAG_NAMES: TAG_NAMES,
        STATUS_CODE: STATUS_CODE,
        STATUS_MESSAGES: STATUS_MESSAGES
      });
    });

    describe('Units: units should be Defined', function () {
      it('it should pass if routeParams is defined', function () {
        expect(routeParams).toBeDefined();
      });
      it('it should pass if routeParams.videoId is defined', function () {
        expect(routeParams.videoId).toBeDefined();
      });
      it('it should pass if DataStore is defined', function () {
        expect(DataStore).not.toBeUndefined();
      });
      it('it should pass if TAG_NAMES is defined', function () {
        expect(TAG_NAMES).not.toBeUndefined();
      });
      it('it should pass if STATUS_CODE is defined', function () {
        expect(STATUS_CODE).not.toBeUndefined();
      });
      it('it should pass if STATUS_MESSAGES is defined', function () {
        expect(STATUS_MESSAGES).not.toBeUndefined();
      });
      it('it should pass if LAYOUTS is defined', function () {
        expect(LAYOUTS).not.toBeUndefined();
      });
      it('it should pass if WidgetSingle.data  is null', function () {
        expect(WidgetSingle.data).toEqual(null);
      });
      it('it should pass if WidgetSingle.video  is null', function () {
        expect(WidgetSingle.video).toEqual(null);
      });
    });

    describe('Function : WidgetSingle.getSingleVideoDetails returns error', function () {
      beforeEach(function () {
        var deferred = q.defer();
        deferred.reject();
        _url = 'https://api.vimeo.com/videos/' + routeParams.videoId;
        $httpBackend.expectGET(_url).respond(500, '');
        $httpBackend.flush();
      });
      it('it should if WidgetSingle.data is not null', function () {
        expect(WidgetSingle.video).toEqual(null);
      });
    });

    describe('Function : WidgetSingle.getSingleVideoDetails returns success', function () {
      beforeEach(function () {
        videoItemDetailMoke = {
          created_time: "2015-07-10T10:20:17+00:00",
          language: "en-GB",
          license: null,
          link: "https://vimeo.com/mahaliabelo/volumetshort",
          uri: "/videos/133130486"
        };
        _url = 'https://api.vimeo.com/videos/' + routeParams.videoId;
        $httpBackend.expectGET(_url).respond(videoItemDetailMoke);
        $httpBackend.flush();
      });
      it('it should if WidgetSingle.data is not null', function () {
        expect(WidgetSingle.video).toEqual(videoItemDetailMoke);
      });
    });
  });
});