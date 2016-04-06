describe('Unit : vimeoPlugin content.home.controller.js', function () {
  var ContentHome, $rootScope, $controller, q, $scope, Buildfire, DataStore, TAG_NAMES, STATUS_CODE, CONTENT_TYPE, VIMEO_KEYS, Utils, $timeout, LAYOUTS, _mockData;
  beforeEach(module('vimeoPluginContent'));
  beforeEach(inject(function (_$rootScope_, _$controller_, _$q_, _DataStore_, _TAG_NAMES_, _STATUS_CODE_, _CONTENT_TYPE_, _VIMEO_KEYS_, _Utils_, _$timeout_, _LAYOUTS_) {
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    $controller = _$controller_;
    q = _$q_;
    DataStore = _DataStore_;
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    CONTENT_TYPE = _CONTENT_TYPE_;
    VIMEO_KEYS = _VIMEO_KEYS_;
    Utils = _Utils_;
    $timeout = _$timeout_;
    LAYOUTS = _LAYOUTS_;
    Buildfire = {
      components: {
        carousel: {
          editor: function (name) {
            return {}
          },
          viewer: function (name) {
            return {}
          }
        }
      }
    };
    _mockData = {
      "content": {
        "carouselImages": [],
        "description": '',
        "rssUrl": TAG_NAMES.DEFAULT_FEED_URL,
        "type": "",
        "feedID": null,
        "videoID": null
      },
      "design": {
        "itemListLayout": LAYOUTS.listLayouts[0].name,
        "itemListBgImage": "",
        "itemDetailsBgImage": ""
      },
      "default": true
    };
  }));

  beforeEach(function () {
    ContentHome = $controller('ContentHomeCtrl', {
      $scope: $scope,
      $q: q,
      DataStore: DataStore,
      Buildfire: Buildfire,
      TAG_NAMES: TAG_NAMES,
      STATUS_CODE: STATUS_CODE,
      CONTENT_TYPE: CONTENT_TYPE,
      VIMEO_KEYS: VIMEO_KEYS,
      Utils: Utils,
      LAYOUTS: LAYOUTS
    });
    ContentHome.data = _mockData;
  });

  describe('Units: units should be Defined', function () {
    it('it should pass if ContentHome is defined', function () {
      expect(ContentHome).toBeDefined();
    });
    it('it should pass if DataStore is defined', function () {
      expect(DataStore).toBeDefined();
    });
    it('it should pass if Buildfire is defined', function () {
      expect(Buildfire).toBeDefined();
    });
    it('it should pass if TAG_NAMES is defined', function () {
      expect(TAG_NAMES).toBeDefined();
    });
    it('it should pass if STATUS_CODE is defined', function () {
      expect(STATUS_CODE).toBeDefined();
    });
    it('it should pass if CONTENT_TYPE is defined', function () {
      expect(CONTENT_TYPE).toBeDefined();
    });
    it('it should pass if VIMEO_KEYS is defined', function () {
      expect(VIMEO_KEYS).toBeDefined();
    });
    it('it should pass if Utils is defined', function () {
      expect(Utils).toBeDefined();
    });
    it('it should pass if LAYOUTS is defined', function () {
      expect(LAYOUTS).toBeDefined();
    });

    it('it should pass if ContentHome.masterData match the object', function () {
      expect(ContentHome.masterData).toEqual(_mockData);
    });
    it('it should pass if ContentHome.CONTENT_TYPE match the object', function () {
      expect(ContentHome.CONTENT_TYPE).toEqual({ CHANNEL_FEED: 'Channel Feed', USER_FEED: 'User Feed', SINGLE_VIDEO: 'Single Video' });
    });
    it('it should pass if ContentHome.data match the object', function () {
      expect(ContentHome.data).toEqual(_mockData);
    });
    it('it should pass if ContentHome.validLinkSuccess equal to false', function () {
      expect(ContentHome.validLinkSuccess).toEqual(false);
    });
    it('it should pass if ContentHome.validLinkFailure is equal to false', function () {
      expect(ContentHome.validLinkFailure).toEqual(false);
    });
    it('it should pass if ContentHome.contentType is equal to "Single Video"', function () {
      expect(ContentHome.contentType).toEqual("Channel Feed");
    });
    it('it should pass if ContentHome.failureMessage is equal to  "Error. Please check and try again"', function () {
      expect(ContentHome.failureMessage).toEqual("Error. Please check and try again");
    });
    it('it should pass if ContentHome.descriptionWYSIWYGOptions match the object', function () {
      expect(ContentHome.descriptionWYSIWYGOptions).toEqual({
        plugins: 'advlist autolink link image lists charmap print preview',
        skin: 'lightgray',
        trusted: true,
        theme: 'modern'
      });
    });
  });

  describe('Units: ContentHome.validateRssLink function', function () {
    it('it should be exist and be a function', function () {
      expect(typeof ContentHome.validateRssLink).toEqual('function');
    });
  });

  describe('Units: ContentHome.clearData function', function () {
    it('it should be exist and be a function', function () {
      expect(typeof ContentHome.clearData).toEqual('function');
    });
    it('it should pass if ContentHome.clearData called successfully', function () {
      ContentHome.rssLink = '';
      ContentHome.data.content.rssUrl = 'https://vimeo.com/133130486';
      ContentHome.data.content.type = 'Single Video';
      ContentHome.data.content.videoID = '133130486';
      ContentHome.data.content.playListID = null;
      ContentHome.clearData();
      $rootScope.$digest();
      expect(ContentHome.data.content.rssUrl).toEqual(null);
      expect(ContentHome.data.content.type).toEqual(CONTENT_TYPE.CHANNEL_FEED);
      expect(ContentHome.data.content.videoID).toEqual(null);
      expect(ContentHome.data.content.playListID).toEqual(null);
    });
  });

});