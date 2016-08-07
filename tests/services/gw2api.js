describe('GW2API', function () {
  var GW2API, $scope;
  var expect = chai.expect;


  beforeEach(module('app'));
  beforeEach(module('app.services'));
  
  beforeEach(inject(function (_GW2API_, $rootScope) {
   GW2API = _GW2API_;
   $scope = $rootScope;
  }));

  it('Should have a GW2API Service', function () {
    expect(GW2API).to.exist;
  });

  it('Should have API methods', function () {
    expect(GW2API.api).to.exist;

    expect(GW2API.api.getAccountMaterials).to.exist;
  });

  it('Should have cache enabled', function () {
    expect(GW2API.api.getCache()).to.be.false;
  });
});