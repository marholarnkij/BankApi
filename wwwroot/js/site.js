const uriBankAccount = 'api/bankaccountitem';
const uriTransfer = 'api/transfer';
let bankaccounts = [];

function getItems(){
    fetch(uriBankAccount)
    .then(response => response.json())
    .then(data => _displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function deposit(id,rowid){
    fetch(`${uriBankAccount}/${id}`)
    .then(response => response.json())
    .then(data => {
         
        let feeval =  ((1000 *0.1)/100);
        const item = {
            id: data.id,
            accountName: data.accountName,
            accountNumber : data.accountNumber,
            iban : data.iban,
            balance: data.balance + 1000 - feeval,
            fee: data.fee + feeval
          };
        fetch(`${uriBankAccount}/${id}`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
          })
          .then(() =>  {
             $('#displaytable tr:eq('+id +') td:eq(2)').text(item.balance.toFixed(2));
             $('#displaytable tr:eq('+id +') td:eq(3)').text(item.fee.toFixed(2));
             getItems();
          })
          .catch(error => console.error('Unable to update item.', error));
    });
     
    
}

function withdraw(id,rowid){
    fetch(`${uriBankAccount}/${id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const item = {
            id: data.id,
            accountName: data.accountName,
            accountNumber : data.accountNumber,
            iban : data.iban,
            balance: data.balance - 1000,
            fee: data.fee 
          };
        fetch(`${uriBankAccount}/${id}`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
          })
          .then(() =>  {
             $('#displaytable tr:eq('+id +') td:eq(2)').text(item.balance.toFixed(2));
             $('#displaytable tr:eq('+id +') td:eq(3)').text(item.fee.toFixed(2));
            getItems();
          })
          .catch(error => console.error('Unable to update item.', error));
    });
     
    
}

function transferItem()
{
  console.log('transfer activate');
  var amount = parseFloat(document.getElementById('edit-amount').value);
  var select = document.getElementById('lstIBAN');
  
  var ownerid = parseInt(document.getElementById('ownerid').value);
  
  const ownerdata = bankaccounts.find(item => item.id === ownerid);
  console.log(bankaccounts);
  const currentselection = bankaccounts.find(item => item.iban === select.value);
  // process to Bank account controller for owner
  const owneritem = {
    id: ownerdata.id,
    accountName: ownerdata.accountName,
    accountNumber : ownerdata.accountNumber,
    iban : ownerdata.iban,
    balance: ownerdata.balance - amount ,
    fee: ownerdata.fee
  };
  ownerdata.balance = owneritem.balance;
  ownerdata.fee = owneritem.fee;

  fetch(`${uriBankAccount}/${ownerdata.id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(owneritem)
  })
  .then(() =>  {
     $('#displaytable tr:eq('+owneritem.id +') td:eq(2)').text(owneritem.balance.toFixed(2));
     $('#displaytable tr:eq('+owneritem.id +') td:eq(3)').text(owneritem.fee.toFixed(2));
  })
  .catch(error => console.error('Unable to update item.', error));
  

  // process to Bank account controller for destination
  const destitem = {
    id: currentselection.id,
    accountName: currentselection.accountName,
    accountNumber : currentselection.accountNumber,
    iban : currentselection.iban,
    balance: (currentselection.balance + amount - (amount * 0.001)).toFixed(2),
    fee: currentselection.fee + (amount * 0.001)
  };
  currentselection.balance = destitem.balance;
  currentselection.fee = destitem.fee;

  fetch(`${uriBankAccount}/${destitem.id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(destitem)
  })
  .then(() =>  {
     $('#displaytable tr:eq('+destitem.id +') td:eq(2)').text(destitem.balance.toFixed(2));
     $('#displaytable tr:eq('+destitem.id +') td:eq(3)').text(destitem.fee.toFixed(2));
  })
  .catch(error => console.error('Unable to update item.', error));


   getItems();
  // log in transaction controller
}

function displayInputForm(id) {
  var form = document.getElementById('transferform');
  var ownerid = document.getElementById('ownerid');
  ownerid.value = id;
  
  form.style.display='block';
  const currentselection = bankaccounts.find(item => item.id === id);
  
  var select = document.getElementById('lstIBAN');
  select.innerHTML = '';
  bankaccounts.forEach(item =>{
    if(currentselection.iban !== item.iban){
      var opt = document.createElement('option');
      opt.value = item.iban;
      opt.innerHTML = item.iban;
      select.appendChild(opt);
    }
  }); 
}


function closeInput() {
  document.getElementById('transferform').style.display = 'none';
}

function AddCustomer(){
    var lastid = parseInt(document.getElementById('bankaccountsbody').lastChild.id);
    var txtAcctNumber = $("#txtAcctNumber").val();
    var txtAcctName = $("#txtAcctName").val();
    var txtiban = $("#txtIBAN").val();
     
    const item = {
        id: lastid + 1,
        accountName: txtAcctName,
        accountNumber : txtAcctNumber,
        iban : txtiban,
        balance: 0,
        fee: 0
      };
    fetch(`${uriBankAccount}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      })
      .then(response => response.json())
        .then(() => { getItems(); formClear(); })

      .catch(error => console.error('Unable to update item.', error));
}

function deleterow(id, rowid) {
    fetch(`${uriBankAccount}/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

    })
        .then(() => {
             
            $('#displaytable tr:eq(' + id + ')').remove();
            getItems();
        })
        .catch(error => console.error('Unable to update item.', error));
}
     
function formClear(){
    $('#txtAcctName').val('');
    $('#txtAcctNumber').val('');
    $('#txtIBAN').val('');
}
 

function _displayItems(data) {

    const tBody = document.getElementById('bankaccountsbody');
    tBody.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        var id_tr = String(data[i].id);


        let tr = tBody.insertRow();
        tr.setAttribute('id', id_tr);

        let td1 = tr.insertCell(0);
        let txtacctNum = document.createTextNode(data[i].accountNumber);
        td1.appendChild(txtacctNum);

        let td2 = tr.insertCell(1);
        let txtacctName = document.createTextNode(data[i].accountName);
        td2.appendChild(txtacctName);

        let td3 = tr.insertCell(2);
        let txtBalance = document.createTextNode(data[i].balance.toFixed(2));
        td3.appendChild(txtBalance);

        let td4 = tr.insertCell(3);
        let txtFee = document.createTextNode(data[i].fee.toFixed(2));
        td4.appendChild(txtFee);

        let td5 = tr.insertCell(4);
        let txtIBAN = document.createTextNode(data[i].iban);
        td5.appendChild(txtIBAN);

        var depositbtn = document.createElement('button');
        depositbtn.type = 'button';
        depositbtn.innerHTML = 'Deposit 1000'
        depositbtn.setAttribute('onclick', 'deposit(' + data[i].id + ',"' + id_tr + '")');
        tr.appendChild(depositbtn);

        var withdrawbtn = document.createElement('button');
        withdrawbtn.type = 'button';
        withdrawbtn.innerHTML = 'WithDraw 1000'
        withdrawbtn.setAttribute('onclick', 'withdraw(' + data[i].id + ',"' + id_tr + '")');
        tr.appendChild(withdrawbtn);

        let td6 = tr.insertCell(5);
        var transferbtn = document.createElement('button');
        transferbtn.type = 'button';
        transferbtn.innerHTML = 'Transfer'
        transferbtn.setAttribute('onclick', 'displayInputForm(' + data[i].id + ')');
        td6.appendChild(transferbtn);

        let td7 = tr.insertCell(6);

        var deletebtn = document.createElement('button');
        deletebtn.type = 'button';
        deletebtn.innerHTML = 'X'
        deletebtn.setAttribute('onclick', 'deleterow(' + data[i].id + ',"' + id_tr + '")');
        td7.appendChild(deletebtn);

        bankaccounts = data;

    }
}