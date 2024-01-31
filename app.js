
const uniqueBuildings = 20;
const dragonflightAura = 10;
const radiantAppetiteAura = 15;

// conf
const holdBuyingBuildingsOnGoldenCookie = true;
const defaultBuildingLimit = 700;
const stockmarketEnabled = false;

var autoclicker = setInterval(function() {
  try {
    
    if (isAcending()) {
      ascend();
      return;
    }
    clickBigCookie();
    buyUpgrade();
    buyBuilding();
    clickGoldenCookie();
    clickFortune();
    castSpell();
    if (stockmarketEnabled)
    {
      stockMarket();
    }
 
  } catch (err) {
    console.error('Stopping auto clicker');
    clearInterval(autoclicker);
    throw(err);
  }
}, stockmarketEnabled ? 60000 : 1);

function clickBigCookie() {
  Game.lastClick -= 1000;
    document.getElementById('bigCookie').click();
}

function buyUpgrade() {
  let upgrades = document.getElementById('upgrades');
  let enabledUpgrades = Array.from(upgrades.getElementsByClassName('upgrade')).filter((each) => {
    return (each.classList.contains('enabled'))
  })
  enabledUpgrades.shift()?.click();
}

function buyBuilding(limit = defaultBuildingLimit) {
  if (holdBuyingBuildingsOnGoldenCookie && hasActiveGoldenCookie())
  {
    return;
  }
  let buildings = Array.from(document.getElementsByClassName('product')).filter((each) => {
    let ownedBuildings = parseInt(each.getElementsByClassName('owned')[0].innerText);
    ownedBuildings = Number.isNaN(ownedBuildings) ? 0 : ownedBuildings;
    return (each.classList.contains('enabled') && ownedBuildings < limit)
  })
  buildings.pop()?.click();
}

function hasActiveGoldenCookie() {
  let buffs = document.getElementsByClassName('buff');
  return buffs.length > 0;
}

function castSpell() {
  if (document.getElementById('grimoireBarText').innerText !== '114/114') {
    return;
  }

  let spell = document.getElementById('grimoireSpell1');
  if (spell.classList.contains('ready')) {
    spell.click()
  }
}

function clickGoldenCookie() {
  let shimmer = Array.from(document.getElementsByClassName('shimmer'))?.pop();
  let shimmerType = shimmer?.getAttribute('alt');
  if (shimmerType === 'Golden cookie' || shimmerType === 'Reindeer')
  {
    shimmer.click();
  }
}

function clickFortune() {
  Array.from(document.getElementsByClassName('fortune')).pop()?.click();
}

function isReincarnating() {
  return document.getElementById('ascendUpgrades').children.length;
}

function isAcending() {
  return !isReincarnating() && 
  (!isDragonTrained() 
    || !isValentinesUpgraded() 
    || !isEasterUpgraded() 
    || !isHalloweenUpgraded()
    || !isChristmasUpgraded());
}

function ascend() {
  
  if (!isDragonTrained()) {
    trainDragon();
    return;
  }

  if (!isChristmasUpgraded()) {
    seasonChristmas();
    return;
  }

  if (!isHalloweenUpgraded()) {
    seasonHalloween();
    return;
  }

  if (!isValentinesUpgraded()) {
    seasonValentines();
    return;
  }

  if (!isEasterUpgraded()) {
    seasonEaster();
    return;
  }
}

function isHalloweenUpgraded() {
  return Game.GetHowManyHalloweenDrops() === 7;
}

function seasonHalloween() {
  let halloweenSwitch = document.querySelector('[data-id="183"]');

  if (Game.season !== 'halloween' && halloweenSwitch.classList.contains('enabled')) {
    halloweenSwitch.click();
  }

  clickBigCookie();
  buyUpgrade();
  buyBuilding();
  clickGoldenCookie();
  clickFortune();
  castSpell();

  if (Game.season !== 'halloween') {
    return;
  }

  let grandmaUpgrade = document.getElementById('techUpgrades').children[0] ?? document.getElementById('vaultUpgrades').children[0];
  if (grandmaUpgrade?.classList.contains('enabled')) {
    grandmaUpgrade.click();
    if (document.getElementById('prompt')?.innerHTML.includes('purchasing this will have unexpected, and potentially undesirable results!')) {
      document.getElementById('promptOption0')?.click();
    }
  }

  if (Game.wrinklers.filter((w) => w.close === 1).length > 5) {
    Game.PopRandomWrinkler();
  }

  
  let store = document.getElementById('store')

  let elderPledge = store.querySelector('[data-id="74"]');
  let elderCovenant = store.querySelector('[data-id="84"]');
  let revokeElderCovenant = store.querySelector('[data-id="85"]');
 
  if (elderCovenant === null) {
    elderPledge?.click();
  }

  if (!elderPledge?.classList.contains('enabled')) {
    elderCovenant?.click();
  }

  revokeElderCovenant?.click();
  
  if (Game.season === 'halloween' && isHalloweenUpgraded() && elderCovenant !== null) {
    halloweenSwitch.click();
    elderCovenant.click();
  }
}

function isChristmasUpgraded() {
  return Game.GetHowManySantaDrops() === 14 
    && Game.GetHowManyReindeerDrops() === 7
    && Game.santaLevel === 14
}

function seasonChristmas() {
  let christmasSwitch = document.querySelector('[data-id="182"]');
  if (Game.season !== 'christmas' && christmasSwitch.classList.contains('enabled')) {
    christmasSwitch.click();
  }
  
  clickBigCookie();
  buyUpgrade();
  buyBuilding();
  clickGoldenCookie();
  clickFortune();
  castSpell();

  if (Game.season !== 'christmas') {
    return;
  }

  Game.UpgradeSanta();
  Game.specialTab = 'dragon'
  Game.ToggleSpecialMenu();
  
  if (Game.season === 'christmas' && isChristmasUpgraded()) {
    christmasSwitch.click();
  }
}

function isDragonTrained() {
  return Game.dragonAura2 === dragonflightAura || Game.dragonAura === radiantAppetiteAura;
}

function trainDragon() {
  clickBigCookie();
  buyUpgrade();
  clickGoldenCookie();
  clickFortune();
  castSpell();

  if (Game.dragonLevel < 5) {
    Game.UpgradeDragon()
  }
  
  if (Game.dragonLevel <= 5 && !hasBuildings(100)) {
    buyBuilding(100);
    return;
  }

  if (Game.dragonLevel < 25) {
    Game.UpgradeDragon()
    return;
  }

  if (Game.dragonLevel === 25 && !hasBuildings(50)) {
    buyBuilding(50);
    return;
  }

  if (Game.dragonLevel < 26) {
    Game.UpgradeDragon();
    return;
  }

  if (Game.dragonLevel === 26 && !hasBuildings(200)) {
    buyBuilding(200);
    return;
  }

  Game.UpgradeDragon();
  
  Game.SetDragonAura(dragonflightAura, 1)
  let dragonflightAuraConfirmButton = document.getElementById('promptOption0');
  dragonflightAuraConfirmButton.click();

  Game.SetDragonAura(radiantAppetiteAura, 0)
  let radiantAppetiteAuraConfirmButton = document.getElementById('promptOption0');
  radiantAppetiteAuraConfirmButton.click();

  Game.specialTab = 'dragon'
  Game.ToggleSpecialMenu();
}

function hasBuildings(numberOfBuildings) {
  let buildings = Array.from(document.getElementsByClassName('product')).filter((each) => {
    let ownedBuildings = parseInt(each.getElementsByClassName('owned')[0].innerText);
    ownedBuildings = Number.isNaN(ownedBuildings) ? 0 : ownedBuildings;
    return (each.classList.contains('enabled') && ownedBuildings === numberOfBuildings)
  })
  return buildings.length === uniqueBuildings;
}

function isValentinesUpgraded() {
  return Game.GetHowManyHeartDrops() === 7;
}

function seasonValentines() {
  let valentinesSwitch = document.querySelector('[data-id="184"]');

  if (Game.season !== 'valentines' && valentinesSwitch.classList.contains('enabled')) {
    valentinesSwitch.click();
  }
  
  clickBigCookie();
  buyUpgrade();
  buyBuilding();
  clickGoldenCookie();
  clickFortune();
  castSpell();

  if (Game.season === 'valentines' && isValentinesUpgraded()) {
      valentinesSwitch.click();
  }
}

function isEasterUpgraded() {
  let chocolateEgg = document.querySelector('[data-id="227"]');
  return Game.GetHowManyEggs() === 19 && chocolateEgg !== null;
}

function seasonEaster(){
  let easterSwitch = document.querySelector('[data-id="209"]');
  
  if (Game.season !== 'easter' && easterSwitch.classList.contains('enabled')) {
    easterSwitch.click();
  }
  
  clickBigCookie();
  buyUpgrade();
  buyBuilding();
  clickGoldenCookie();
  clickFortune();
  castSpell();

  if (Game.season === 'easter' && isEasterUpgraded()) {
      easterSwitch.click();
  }
}

function stockMarket(){
  const thresholdAboveRestingValue = 0;
  const thresholdBelowRestingValue = 999;
  const minBuyPrice = 10;
  const restingValues = [
    {key: 'CRL', value: 45},
    {key: 'CHC', value: 55},
    {key: 'BTR', value: 65},
    {key: 'SUG', value: 75},
    {key: 'NUT', value: 85},
    {key: 'SLT', value: 95},
    {key: 'VNL', value: 105},
    {key: 'EGG', value: 115},
    {key: 'CNM', value: 125},
    {key: 'CRM', value: 135},
    {key: 'JAM', value: 145},
    {key: 'WCH', value: 155},
    {key: 'HNY', value: 165},
    {key: 'CKI', value: 175},
    {key: 'RCP', value: 185},
    {key: 'SBD', value: 195},
    {key: 'PBL', value: 205},
    {key: 'YOU', value: 215}]

  let stockValue = 0;

  for (let i = 0; i < restingValues.length; i++) {
    let price = parseFloat(document.getElementById(`bankGood-${i}-val`).innerHTML.replace('$',''));
    
    let buyPrice = restingValues[i].value - thresholdBelowRestingValue;
    if (buyPrice < minBuyPrice) {
      buyPrice = minBuyPrice;
    }

    let stock = parseInt(document.getElementById(`bankGood-${i}-stock`).innerHTML.replace(',',''));
    let stockMax = parseInt(document.getElementById(`bankGood-${i}-stockMax`).innerHTML.replace(',','').replace('/',''));

    if (price <= buyPrice && stock !== stockMax) {
      document.getElementById(`bankGood-${i}_Max`).click();
      console.log(`${restingValues[i].key} buy: $${price}`);
    }

    let sellPrice = restingValues[i].value + thresholdAboveRestingValue;
    if (price >= sellPrice && stock === stockMax) {
      document.getElementById(`bankGood-${i}_-All`).click();
      console.log(`${restingValues[i].key} sell: $${price} (profit $${((price - buyPrice)*stockMax/1000).toFixed()}k)`);
    }

    let bankGoodStock = parseInt(document.getElementById(`bankGood-${i}-stock`).innerHTML.replace(',',''));
    stockValue = stockValue + (bankGoodStock * price);
  }

  let bankBalance = parseFloat(document.getElementById('bankBalance').innerHTML.replace('$','').replace(' million', ''));
  stockValue = stockValue / 1000000 + bankBalance;
  console.log(`$${stockValue.toFixed(1)} million`);

  return;
}