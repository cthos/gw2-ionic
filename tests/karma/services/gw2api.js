describe('GW2API', function () {
  var GW2API, $scope, $q;
  var expect = chai.expect;

  beforeEach(module('app.services'));
  
  beforeEach(inject(function (_GW2API_, _$q_, $rootScope) {
   GW2API = _GW2API_;
   $scope = $rootScope;
   $q = _$q_;
  }));

  beforeEach(function () {
    sinon.stub(GW2API, 'reload', function () {
      return $q(function (fulfill, reject) {
        GW2API.achievements = {
          pve : []
        };
        return fulfill();
      });
    });
  });

  afterEach(function () {
    GW2API.reload.restore();
  });

  it('Should have a GW2API Service', function () {
    expect(GW2API).to.exist;
  });

  it('Should have API methods', function () {
    expect(GW2API.api).to.exist;

    expect(GW2API.api.getAccountMaterials).to.exist;
  });

  it('Should have cache enabled', function () {
    expect(GW2API.api.getCache()).to.be.true;
  });

  it('Should load daily pve', function () {
    GW2API.reload();
    $scope.$digest();

    expect(GW2API.achievements.pve).to.exist;
  });
});