'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// -------------CREATING DISPLAY MOVEMENT FUNCTION-------------

const displayMovements=function(movements, sort=false){
  containerMovements.innerHTML= ''
  
  const movs = sort ? movements.slice().sort((a,b)=>a-b) : movements

  movs.forEach(function(mov , i){
    const type=mov > 0 ? 'deposit' : 'withdrawal'
    const html=`<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__value">${Math.abs(mov)} €</div>`
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}



// -----------CREATING USERNAME FUCNTION---------------

const createUserName = function (accs){
  accs.forEach(function(acc){
    acc.username= acc.owner
    .toLowerCase()
    .split(' ')
    .map(name=>name[0])
    .join('')
  })
}
createUserName(accounts)

// ------------FUNCTION TO CALCULATE BALANCE----------

const calcDisplayBalance = function (movements){
  const balance= movements.reduce((acc, mov)=>acc+mov,0)
  labelBalance.textContent=balance +' EUR'
}

//  ----------CREATE FUCNTION TO DISPLAY SUMMARY------------

const calcDisplaySummary= function(movements){
    const income=movements
    .filter(mov=>mov>0)
    .reduce((acc, mov)=>acc+mov,0)
    labelSumIn.textContent=income +'€'

    const outcome=movements
    .filter(mov=>mov<0)
    .reduce((acc, mov)=>acc+mov,0)
    labelSumOut.textContent=Math.abs(outcome) +'€'

    const interest= movements
    .filter(mov=>mov>0)
    .map(deposit=>(deposit*1.2)/100)
    .reduce((acc,int)=>acc+int,0)
    labelSumInterest.textContent=interest +'€'

}
//------ CREATE FUNCTION TO LOGIN-----------
let currentAccount
btnLogin.addEventListener('click' , function(e){

  e.preventDefault()
  currentAccount= accounts.find(
    acc=>acc.username===inputLoginUsername.value 
  )

  if(currentAccount?.pin===Number(inputLoginPin.value)){
    labelWelcome.textContent =`Welcome Back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100
    displayMovements(currentAccount.movements)
    calcDisplayBalance(currentAccount.movements)
    calcDisplaySummary(currentAccount.movements)
  }
  

})
// -----------FUNCTION TO UPDATE UI-------------
const updateUI=function(acc){
  displayMovements(acc.movements)
  calcDisplaySummary(acc.movements)
  calcDisplayBalance(acc.movements)
}

// --------CREATE FUNCTIONS TO TRANSFER MONEY ACROSS ACCOUNTS----------
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount= Number(inputTransferAmount.value)
  const receiverAcc=accounts.find(acc=>acc.username===inputTransferTo.value)

  if(amount>0 &&
    Number(labelBalance.textContent.split(' ')[0])>=amount &&
    receiverAcc?.username!==currentAccount.username
    ){
      currentAccount.movements.push(-amount)
      receiverAcc.movements.push(amount)

      // UPDATE UI
      updateUI(currentAccount)
      console.log(currentAccount.movements)
    }
 
})

//---------CREATE A FUNCTION TO REQUEST LOAN------------
btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value)
  if(amount>0 &&
    currentAccount.movements.some(mov => mov >= amount * 0.1)){
      console.log('le bhaiya')
      currentAccount.movements.push(amount)
      updateUI(currentAccount)
    }
})


// --------CREATE FUNCTION TO CLOSE ACCOUNT----------

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  if(inputCloseUsername.value===currentAccount.username &&
    Number(inputClosePin.value)===currentAccount.pin){
      const index = accounts.findIndex(acc=>acc.username===currentAccount.username)
      
      //   DELETE ACCOUNT
      accounts.splice(index,1)

      //  HIDE UI
      containerApp.style.opacity=0;
    }

})
// ---------CREATE FUCNTION TO SORT MOVEMENTS-------------
let sorted= false
btnSort.addEventListener('click', function(e){
  e.preventDefault()
  displayMovements(currentAccount.movements, !sorted)
  sorted=!sorted
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
