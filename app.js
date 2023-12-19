const uniqueBuildings = 20;
const dragonflightAura = 10;
const radiantAppetiteAura = 15;

// conf
let holdBuyingBuildingsOnGoldenCookie = true;
let defaultBuildingLimit = 700;

var autoclicker = setInterval(function(){
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
    //stockMarket();
 
  } catch (err) {
    console.error('Stopping auto clicker');
    clearInterval(autoclicker);
    throw(err);
  }
}, 1);
// 1 default, 60000 for stockmarket

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
  if (shimmer?.getAttribute('alt') === 'Golden cookie')
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
  return !isReincarnating() && (!isDragonTrained() || !isValentinesUpgraded() || !isEasterUpgraded() || !isHalloweenUpgraded());
}

function isHalloweenUpgraded() {
  return Game.GetHowManyHalloweenDrops() === 7;
}

function seasonHalloween() {
  let halloweenSwitch = document.querySelector('[data-id="183"]');

  if (Game.season === '' && halloweenSwitch.classList.contains('enabled')) {
    halloweenSwitch.click();
  }

  let grandmaUpgrade = document.getElementById('techUpgrades').children[0] ?? document.getElementById('vaultUpgrades').children[0];
  if (grandmaUpgrade?.classList.contains('enabled')) {
    grandmaUpgrade.click();
    document.getElementById('promptOption0')?.click();
  }

  Game.PopRandomWrinkler();
  
  clickBigCookie();
  buyUpgrade();
  buyBuilding(10);
  clickGoldenCookie();
  clickFortune();
  castSpell();

  if (isHalloweenUpgraded()) {
    halloweenSwitch.click();
  }
}

function ascend() {
  if (!isHalloweenUpgraded()) {
    seasonHalloween();
    return;
  }

  if (!isDragonTrained()) {
    trainDragon();
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

  if (Game.season === '' && valentinesSwitch.classList.contains('enabled')) {
    valentinesSwitch.click();
  }
  
  clickBigCookie();
  buyUpgrade();
  buyBuilding(10);
  clickGoldenCookie();
  clickFortune();
  castSpell();

  if (isValentinesUpgraded()) {
      valentinesSwitch.click();
  }
}

function isEasterUpgraded() {
  return Game.GetHowManyEggs() === 19 && document.querySelector('[data-id="227"]') !== null;
}

function seasonEaster(){
  let easterSwitch = document.querySelector('[data-id="209"]');
  
  if (Game.season === '' && easterSwitch.classList.contains('enabled')) {
    easterSwitch.click();
  }
  
  if (Game.season !== 'easter') {
    return;
  }
  
  clickBigCookie();
  buyUpgrade();
  buyBuilding();
  clickGoldenCookie();
  clickFortune();
  castSpell();

  if (isEasterUpgraded()) {
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