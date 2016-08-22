describe('Tabs SubControllers', function () {
  var PVECtrl, PVPCtrl, WVWCtrl, $scope;
  var alertSpy;
  var expect = chai.expect;

  beforeEach(module('app.templates'));
  beforeEach(module('app.controllers'));
  beforeEach(module('app.services'));

  beforeEach(inject(function ($rootScope, $controller) {
   PVECtrl = $controller('PVECtrl', {$scope: $rootScope.$new()});
   PVPCtrl = $controller('PVPCtrl', {$scope: $rootScope.$new()});
   WVWCtrl = $controller('WVWCtrl', {$scope: $rootScope.$new()});
   $scope = $rootScope;
  }));

  it('Should have a PVECtrl', function () {
    expect(PVECtrl).to.exist;
  });

  it('Should have a PVPCtrl', function () {
    expect(PVPCtrl).to.exist;
  });

  it('Should have a WVWCtrl', function () {
    expect(WVWCtrl).to.exist;
  });
});