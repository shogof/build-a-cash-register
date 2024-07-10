const buttons = document.querySelectorAll('.btn');
const cash = document.querySelector('#cash');
const delBtn = document.querySelector('.delet');
const purchaseBtn = document.querySelector('#purchase-btn');
const keyboard = document.querySelector('.keyboard');
const disChangeDue = document.getElementById('change-due');
const priceScreen = document.getElementById('price-screen');
const displayChangeDue = document.getElementById('change-due');
const cashDrawerDisplay = document.getElementById('cash-drawer-display');

let chars = [];

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    cash.value += btn.innerText;
    chars = cash.value.split('');
  });
});

delBtn.addEventListener('click', () => {
  chars.pop();
  cash.value = chars.join('');
});

purchaseBtn.addEventListener('click', () => {
  keyboard.style.display = 'none';
  disChangeDue.style.display = 'block';
});

const price = 200;
const cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100],
];

const formatResults = (status, change) => {
  displayChangeDue.innerHTML = `<p>Status: ${status}</p>`;
  change.forEach((money) => {
    displayChangeDue.innerHTML += `<p>${money[0]}: $${money[1]}p></p>`;
  });
};

const updateUI = (change) => {
  const currencyNameMap = {
    PENNY: 'Pennies',
    NICKEL: 'Nickels',
    DIME: 'Dimes',
    QUARTER: 'Quarters',
    ONE: 'Ones',
    FIVE: 'Fives',
    TEN: 'Tens',
    TWENTY: 'Twenties',
    'ONE HUNDRED': 'Hundreds',
  };

  if (change) {
    change.forEach((changeArr) => {
      const targetArr = cid.find((cidArr) => cidArr[0] === changeArr[0]);
      targetArr[1] = parseFloat((targetArr[1] - changeArr[1]).toFixed(2));
    });
  }

  cash.value = '';
  priceScreen.textContent = `Total: $${price}`;
  cashDrawerDisplay.innerHTML = `<p><strong>Change in drawer:</strong></p>
    ${cid.map((money) => `<p>${currencyNameMap[money[0]]}: $${money[1]}</p>`).join('')}`;
};

const checkCashRegister = () => {
  if (Number(cash.value) < price) {
    alert('Customer does not have enough money to purchase the item');
    cash.value = '';
    return;
  }

  if (Number(cash.value) === price) {
    displayChangeDue.innerHTML = '<p>No change due - customer paid with exact cash</p>';
    cash.value = '';
    return;
  }

  let changeDue = Number(cash.value) - price;
  const reversedCid = [...cid].reverse();
  const denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
  const result = { status: 'OPEN', change: [] };
  const totalCID = parseFloat(cid.map((total) => total[1])
  .reduce((prev, curr) => prev + curr).toFixed(2));

  if (totalCID < changeDue) {
    displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
    return;
  }

  if (totalCID === changeDue) {
    result.status = 'CLOSED';
  }

  for (let i = 0; i < reversedCid.length; i++) {
    if (changeDue >= denominations[i] && changeDue > 0) {
      let count = 0;
      let total = reversedCid[i][1];
      while (total > 0 && changeDue >= denominations[i]) {
        total -= denominations[i];
        changeDue = parseFloat((changeDue - denominations[i]).toFixed(2));
        count++;
      }
      if (count > 0) {
        result.change.push([reversedCid[i][0], count * denominations[i]]);
      }
    }
  }

  if (changeDue > 0) {
    displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
    return;
  }

  formatResults(result.status, result.change);
  updateUI(result.change);
};

const checkResults = () => {
  if (!cash.value) {
    return;
  }
  checkCashRegister();
};

purchaseBtn.addEventListener('click', checkResults);

cash.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    checkResults();
  }
});

updateUI();
