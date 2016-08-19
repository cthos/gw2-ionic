describe('GW2API', function () {
  var CurrencyFormatter, $scope, $q;
  var expect = chai.expect;

  beforeEach(module('app.services'));
  
  beforeEach(inject(function (_CurrencyFormatter_, _$q_, $rootScope) {
   CurrencyFormatter = _CurrencyFormatter_;
   $scope = $rootScope;
   $q = _$q_;
  }));

  it('Should have a CurrencyFormatter Service', function () {
    expect(CurrencyFormatter).to.exist;
  });

  it('Should Format Gold Properly', function () {
    var copperRes = CurrencyFormatter.formatGold(10);
    var silverRes = CurrencyFormatter.formatGold(1224);
    var goldRes   = CurrencyFormatter.formatGold(234224);

    expect(copperRes).to.be.an('object');
    expect(copperRes.copper).to.equal(10);
    expect(copperRes.silver).to.equal(0);
    expect(copperRes.gold).to.equal(0);

    expect(silverRes).to.be.an('object');
    expect(silverRes.copper).to.equal(24);
    expect(silverRes.silver).to.equal(12);
    expect(silverRes.gold).to.equal(0);

    expect(goldRes).to.be.an('object');
    expect(goldRes.copper).to.equal(24);
    expect(goldRes.silver).to.equal(42);
    expect(goldRes.gold).to.equal(23);
  });

  it('Should format Currency Properly', function () {
    var coinRes = CurrencyFormatter.formatCurrency('Coin', 234224);

    expect(coinRes).to.be.a('string');
    expect(coinRes).to.equal('23g 42s 24c');
  });
});