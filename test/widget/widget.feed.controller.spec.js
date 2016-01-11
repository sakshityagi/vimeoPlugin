describe("Unit : vimeoPluginWidget widget.feed.controller.js", function () {
  var WidgetFeed, $controller, $rootScope, Buildfire, $httpBackend, DataStore, q, $scope, TAG_NAMES, STATUS_CODE, VimeoApi, Location, $routeParams, LAYOUTS, VIDEO_COUNT;

  beforeEach(module('vimeoPluginWidget'));

  beforeEach(inject(function (_$controller_, _$rootScope_, _$httpBackend_, _$q_, _TAG_NAMES_, _LAYOUTS_, _STATUS_CODE_, _VimeoApi_, _Location_, _VIDEO_COUNT_) {
    q = _$q_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    $httpBackend = _$httpBackend_;
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    LAYOUTS = _LAYOUTS_;
    VimeoApi = _VimeoApi_;
    Location = _Location_;
    VIDEO_COUNT = _VIDEO_COUNT_;
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
    Buildfire = {
      spinner: {}
    };
    Buildfire.spinner = jasmine.createSpyObj('Buildfire.spinner', ['show', 'hide']);
    Buildfire.spinner.show.and.callFake(function () {
      console.log('Buildfire.spinner.show have called');
    });
    Buildfire.spinner.hide.and.callFake(function () {
      console.log('Buildfire.spinner.hide have called');
    });
    $routeParams = {
      channelID: 'staffpicks'
    };
  }));

  beforeEach(function () {
    WidgetFeed = $controller('WidgetFeedCtrl', {
      $routeParams: $routeParams,
      $scope: $scope,
      DataStore: DataStore,
      TAG_NAMES: TAG_NAMES,
      STATUS_CODE: STATUS_CODE,
      VimeoApi: VimeoApi,
      Buildfire: Buildfire
    });
  });

  describe('Unit : units should be Defined', function () {
    it('it should pass if WidgetFeed is defined', function () {
      expect(WidgetFeed).toBeDefined();
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
    it('it should pass if VimeoApi is defined', function () {
      expect(VimeoApi).not.toBeUndefined();
    });
    it('it should pass if Location is defined', function () {
      expect(Location).not.toBeUndefined();
    });
    it('it should pass if $routeParams is defined', function () {
      expect($routeParams).not.toBeUndefined();
    });
    it('it should pass if $routeParams.channelID is defined', function () {
      expect($routeParams.channelID).not.toBeUndefined();
    });
    it('it should pass if VIDEO_COUNT is defined', function () {
      expect(VIDEO_COUNT).not.toBeUndefined();
    });
    it('it should pass if VimeoApi is defined', function () {
      expect(VimeoApi).not.toBeUndefined();
    });

    it('WidgetFeed.videos should be defined and is an empty array', function () {
      expect(WidgetFeed.videos).not.toBeUndefined();
      expect(WidgetFeed.videos.length).toEqual(0);
    });
    it('WidgetFeed.data should be defined and is equal to null', function () {
      expect(WidgetFeed.data).not.toBeUndefined();
      expect(WidgetFeed.data).toEqual(null);
    });
    it('WidgetFeed.busy should be defined and is equal to false', function () {
      expect(WidgetFeed.busy).not.toBeUndefined();
      expect(WidgetFeed.busy).toEqual(false);
    });
    it('WidgetFeed.nextPageToken should be defined and is equal to 1', function () {
      expect(WidgetFeed.nextPageToken).not.toBeUndefined();
      expect(WidgetFeed.nextPageToken).toEqual(1);
    });
  });

  describe('Function : WidgetFeed.safeHtml function', function () {
    it('it should if WidgetFeed.safeHtml  returns $sce.trustAsHtml', function () {
      var html = '<p>&nbsp;Sandeep Chhapola<br></p>';
      var trustAsHtml = WidgetFeed.safeHtml(html);
      $rootScope.$digest();
      expect(typeof trustAsHtml).toEqual('object');
    });
  });

  describe('Function :  WidgetFeed.loadMore function', function () {
    var videosDataMoke, _url;
    beforeEach(function () {
      videosDataMoke = [{
        created_time: "2015-07-10T10:20:17+00:00",
        language: "en-GB",
        license: null,
        link: "https://vimeo.com/mahaliabelo/volumetshort",
        uri: "/videos/133130486"
      }];
      _url = 'https://api.vimeo.com/channels/' + $routeParams.channelID + '/videos?page=1&per_page=' + VIDEO_COUNT.LIMIT;
      $httpBackend.expectGET(_url).respond({
        data: videosDataMoke
      });
    });

    it('it should pass if WidgetFeed.loadMore called and returned because WidgetFeed.busy is true', function () {
      WidgetFeed.busy = true;
      WidgetFeed.loadMore();
      $rootScope.$digest();
      expect(WidgetFeed.busy).toEqual(true);
    });
  });

  describe('Function :  WidgetFeed.showDescription function', function () {
    it('it should pass if WidgetFeed.showDescription called and returns true', function () {
      var description = '<p>&nbsp; Cool <br></p>';
      var isDescription = WidgetFeed.showDescription(description);
      $rootScope.$digest();
      expect(isDescription).toEqual(true);
    });
    it('it should pass if WidgetFeed.showDescription called and returns false', function () {
      var description = '<p>&nbsp;<br></p>';
      var isDescription = WidgetFeed.showDescription(description);
      $rootScope.$digest();
      expect(isDescription).toEqual(false);
    });
  });
});