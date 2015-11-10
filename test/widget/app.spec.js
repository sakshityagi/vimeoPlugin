describe('Unit : vimeoPlugin widget app.js', function () {
  describe('Unit: app routes', function () {
    beforeEach(module('vimeoPluginWidget'));
    var location, route, rootScope;
    beforeEach(inject(function (_$location_, _$route_, _$rootScope_) {
      location = _$location_;
      route = _$route_;
      rootScope = _$rootScope_;
    }));
    describe('Video details route', function () {
      beforeEach(inject(
        function ($httpBackend) {
          $httpBackend.expectGET('templates/Item_Details.html')
            .respond(200);
          $httpBackend.expectGET('/video/:videoId')
            .respond(200);
        }));

      it('should load the home page on successful load of location path /video/:videoId', function () {
        location.path('/video/:videoId');
        rootScope.$digest();
        expect(route.current.controller).toBe('WidgetSingleCtrl')
      });
    });
  });

  describe('Unit: getImageUrl filter', function () {
    beforeEach(module('vimeoPluginWidget'));
    var filter;
    beforeEach(inject(function (_$filter_) {
      filter = _$filter_;
    }));

    it('it should returns resized image url', function () {
      var reSizedImage;
      reSizedImage = filter('getImageUrl')('https://www.facebook.com/photo.php?fbid=1008284442533844&set=a.359021657460129.98766.100000568920267&type=1&theater', 88, 124, 'resize');
      expect(reSizedImage).toEqual('http://s7obnu.cloudimage.io/s/resizenp/88x124/https://www.facebook.com/photo.php?fbid=1008284442533844&set=a.359021657460129.98766.100000568920267&type=1&theater');
    });
    it('it should pass if "getImageUrl" filter returns cropped image url', function () {
      var croppedImage;
      croppedImage = filter('getImageUrl')('https://www.facebook.com/photo.php?fbid=1008284442533844&set=a.359021657460129.98766.100000568920267&type=1&theater', 88, 124, 'crop');
      expect(croppedImage).toEqual('http://s7obnu.cloudimage.io/s/crop/88x124/https://www.facebook.com/photo.php?fbid=1008284442533844&set=a.359021657460129.98766.100000568920267&type=1&theater');
    });
  });

  describe('Unit: returnVimeoUrl filter', function () {
    beforeEach(module('vimeoPluginWidget'));
    var filter;
    beforeEach(inject(function (_$filter_) {
      filter = _$filter_;
    }));

    it('it should returns vimeoUrl', function () {
      var vimeoUrl;
      vimeoUrl = filter('returnVimeoUrl')("/videos/91353727");
      expect(typeof vimeoUrl).toEqual('object');
    });
  });

  describe('Unit: backgroundImage directive', function () {
    describe('backgroundImage directive have assigned a url value', function () {
      var $compile, $rootScope, backgroundImage, $scope;
      beforeEach(module('vimeoPluginWidget'));
      beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
      }));
      beforeEach(function () {
        backgroundImage = $compile('<div background-image="https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c386/6256a8e0-4b0e-11e5-8618-af6c4fe89f23.png"></div>')($scope);
        $rootScope.$digest();
      });

      it('it should pass and background of div should be given image url', function () {
        expect(backgroundImage.css('background')).toEqual('rgb(1, 1, 1) url(http://s7obnu.cloudimage.io/s/resizenp/342x770/https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c386/6256a8e0-4b0e-11e5-8618-af6c4fe89f23.png) repeat fixed 50% 0%');
      });
    });
    describe('backgroundImage directive have assigned a false value', function () {
      var $compile, $rootScope, backgroundImage, $scope;
      beforeEach(module('vimeoPluginWidget'));
      beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
      }));
      beforeEach(function () {
        backgroundImage = $compile('<div background-image=""></div>')($scope);
        $rootScope.$digest();
      });

      it('it should pass and background of div should be none', function () {
        expect(backgroundImage.css('background')).toEqual('none');
      });
    });
  });

  describe('Unit: buildFireCarousel directive', function () {
    var $compile, $rootScope, buildFireCarousel, $scope;
    beforeEach(module('vimeoPluginWidget'));
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
    }));
    beforeEach(function () {
      buildFireCarousel = $compile('<div buildFireCarousel=""></div>')($scope);
      $rootScope.$digest();
    });

    it('it should be defined', function () {
      expect(buildFireCarousel).toBeDefined();
    });
  });

});