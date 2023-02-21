let count = 0;

//regex for year, month and phone validation
let regexYear = /^(19|20)\d{2}$/;
let regexMonth = /[0-9]{2}/;
let regexPhone = /^[0-9]{10}$/;

// function to get value of a HTML element
function getElementValue(id) {
  return document.getElementById(id).value;
}

// function to display error to user
function showError(place, item, msg, errorColor) {
  if (item) {
    item.style.borderColor = errorColor;
  }
  place.innerHTML = msg;
}

let custPhone = "";
let custName = "";

//Error messages array
let errorText = ["Errors / Empty fields"];

// function to check that mandatory field (first and last name and phone number) is not empty
const validateRequired = (item) => {
  let error = document.getElementById("errormsg");

  if (item.value === "") {
    count++;
    errorMsg = `${item.name} is required`;
    errorText.push(errorMsg);
    showError(error, item, errorMsg, "red");
  } else if (item.id === "phone") {
    custPhone = item.value;
    checkPhoneFormat(item, custPhone, error);
  } else {
    custName += item.value + " ";
    count = 0;
    showError(error, item, "", "");
  }
};

// function to validate 10 digit phone number is entered
const checkPhoneFormat = (item, phNo, er) => {
  if (phNo.match(regexPhone)) {
    count = 0;
    showError(er, item, "", "");
  } else {
    count++;
    errorMsg = "Please enter 10 digit phone number";
    errorText.push(errorMsg);
    showError(er, item, errorMsg, "red");
  }
};

let items = {};
let itemArray = [];

// function to check only numeric value is entered in items to buy field
const validateNumber = (item, price) => {
  let error = document.getElementById("errormsg");
  qty = getElementValue(item.id);
  if (qty && qty > 0) {
    items = {
      name: item.name,
      quantity: qty,
      price: qty * price,
    };
    itemArray.push(items);
  }
  if (isNaN(qty) || qty < 0) {
    count++;
    errorMsg = `Please enter numeric value in ${item.name} quantity`;
    errorText.push(errorMsg);
    showError(error, item, errorMsg, "red");
    item.value = "";
  } else {
    count = 0;
    showError(error, item, "", "");
  }
};

/* function to validate only 16 digit credit card number is entered 
and convert the entered value in xxxx-xxxx-xxxx-xxxx format */
const ccNoValidation = () => {
  let ccError = document.getElementById("cardError");
  let val = getElementValue("cardno");

  val = val.split("-").join(""); // Remove "-" in the input value.
  if (isNaN(val)) {
    count++;
    errorMsg = "Enter correct credit card number";
    errorText.push(errorMsg);
    showError(ccError, "", errorMsg, "");
  } else if (val.length != 16) {
    count++;
    errorMsg = "Enter 16 digit credit card number";
    errorText.push(errorMsg);
    showError(ccError, "", errorMsg, "");
  } else {
    count = 0;
    ccError.innerHTML = "";
  }
  let finalVal = val.match(/.{1,4}/g).join("-");
  document.getElementById("cardno").value = finalVal;
};

//function to validate correct month in XX format is entered
const ccMonthValidation = () => {
  let ccMError = document.getElementById("cardError");
  let val = getElementValue("expmonth");

  if (regexMonth.test(val) && val <= 12) {
    count = 0;
    ccMError.innerHTML = "";
  } else {
    errorMsg = "Enter correct month in xx format";
    errorText.push(errorMsg);
    showError(ccMError, "", errorMsg, "");
    count++;
  }
};

//function to validate correct year in XXXX (from 1900-2099) format is entered
const ccYearValidation = () => {
  let ccYError = document.getElementById("cardError");
  let val = getElementValue("expyear");

  if (val.match(regexYear)) {
    count = 0;
    ccYError.innerHTML = "";
  } else {
    errorMsg = "Enter correct year in xxxx format";
    errorText.push(errorMsg);
    showError(ccYError, "", errorMsg, "");
    count++;
  }
};

let totalPrice = 0;
let quantity = 0;

// function to calculate item total and generate receipt
const checkout = () => {
  let finalError = document.getElementById("finalError");
  // if any field is empty don't proceed
  let fname = getElementValue("fname");
  let lname = getElementValue("lname");
  let phone = getElementValue("phone");
  if (!fname || !lname || !phone) {
    count++;
  }

  let cart = "";
  let products = "";
  let total = "";
  let gst = 0;

  // if there is no error then calculate gst and total else tell user to correct the errors in the form
  if (count === 0) {
    // let finalError = document.getElementById("finalError");
    for (let i in itemArray) {
      totalPrice = totalPrice + itemArray[i].price;
      quantity = quantity + parseInt(itemArray[i].quantity);
      finalError.innerHTML = "";
      gst = totalPrice + 0.13 * totalPrice;

      cart = `Name 
      <span class="price" style="color: black"><b>${custName}</b></span><br /><br />
      Phone Number 
      <span class="price" style="color: black"><b>${custPhone}</b></span><br /><br />
      Items in cart 
      <span class="price" style="color: black"><b>${quantity}</b></span>`;

      products += `${itemArray[i].name} <span class="price">(${
        itemArray[i].quantity
      }*$${itemArray[i].price / itemArray[i].quantity})&nbsp; &nbsp; &nbsp; $${
        itemArray[i].price
      }</span><hr />`;

      total = ` SubTotal &nbsp; &nbsp; &nbsp; <span class="price" style="color: green"><b>$${totalPrice}</b></span><br><hr />
      GST <span >13%</span> &nbsp; &nbsp; &nbsp; <span class="price" style="color: red"><b>$${(
        0.13 * totalPrice
      ).toFixed(2)}</b></span><br><hr />
      Total <span class="price" style="color: green"><b>$${gst}</b></span> `;
    }

    //  if cart value is less than $10, then show error else display receipt to the user
    if (totalPrice < 10) {
      errorMsg = "Cart Value is less than $10, add items to cart";
      errorText.push(errorMsg);
      showError(finalError, "", errorMsg, "");
    } else {
      document.getElementById("showReceipt").innerHTML = cart;
      document.getElementById("products").innerHTML += products;
      document.getElementById("total").innerHTML = total;
      document.getElementById("receipt").style.display = "block";
      // }
    }
  } else {
    for (let i in errorText) {
      setInterval(displayHello(errorText[i]), 10000);
    }
    document.getElementById("errormsg").innerHTML = "";
    document.getElementById("cardError").innerHTML = "";
  }
};

function displayHello(msg) {
  document.getElementById("finalError").innerHTML += msg + "<br />";
}
