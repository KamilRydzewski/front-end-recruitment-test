const checkoutForm = document.querySelector(".checkout-form");
const submitBtn = document.getElementById("checkout-submit-btn");
const checkoutFormItem = [
  { name: "first-name", type: "text" },
  { name: "last-name", type: "text" },
  { name: "email", type: "email" },
  { name: "country", type: "select" },
  { name: "postal-code", type: "number", maxLength: 5 },
  { name: "phone-number", type: "number", maxLength: undefined },
  { name: "credit-card-number", type: "number", maxLength: 16 },
  { name: "security-code", type: "number", maxLength: 3 },
  { name: "expiration-date", type: "number", maxLength: 4 },
  { name: "total", type: "text" },
];
let errors = [];

function handleSubmitForm(e) {
  e.preventDefault();
  let formData = {};
  checkoutFormItem.forEach((item) => {
    const element = document.getElementById(item.name);
    formData[toCamelCase(item.name)] = element.value;
  });
  if (errors.length === 0) {
    document.getElementById("code").innerHTML = `${JSON.stringify(formData)}`;
    submitBtn.classList.add("success");
    setTimeout(() => {
      submitBtn.classList.remove("success");
    }, 2000);
  } else {
    submitBtn.classList.add("error");
    setTimeout(() => {
      submitBtn.classList.remove("error");
    }, 2000);
  }
}

function numberValidation(value, maxLength) {
  let newValue = value.replace(/[^0-9]/gi, "");
  if (maxLength) {
    newValue = newValue.slice(0, maxLength);
  }
  return newValue;
}
function textValidation(value) {
  return value.replace(/[0-9]/gi, "");
}

function toCamelCase(str) {
  return str
    .split("-")
    .map(function (word, index) {
      if (index == 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

function divideBySign(value, spaces, sign) {
  if (value.length > 0) {
    return value
      .replaceAll(sign, "")
      .match(new RegExp(".{1," + spaces + "}", "g"))
      .join(sign);
  } else return value;
}

//form input validation for each element
checkoutFormItem.forEach((item) => {
  const elHTML = document.getElementById(item.name);

  elHTML.addEventListener("input", (e) => {
    errors = [];
    const inputValue = e.target.value;
    if (item.type === "number") {
      if (item.maxLength !== undefined) {
        elHTML.value = numberValidation(inputValue, item.maxLength);
      } else {
        elHTML.value = numberValidation(inputValue);
      }
    } else if (item.type === "text") {
      elHTML.addEventListener("input", (e) => {
        elHTML.value = textValidation(inputValue);
      });
    }
    if (item.name === "credit-card-number") {
      elHTML.value = divideBySign(elHTML.value, 4, " - ");
    }
    if (item.name === "expiration-date") {
      elHTML.value = divideBySign(elHTML.value, 2, " / ");
      const expDate = elHTML.value.split("/");
      let year = new Date().getFullYear().toString().slice(2, 4);
      year = parseInt(year);
      const month = new Date().getMonth();
      if (expDate[0] > 12 || (expDate[0] < month && expDate[0] > 1)) {
        errors.push("expiration-date");
      }
      if (expDate[1] < year) {
        errors.push("expiration-date");
      }
    }
    if (errors.includes(item.name) && !elHTML.classList.contains("error")) {
      elHTML.classList.add("error");
    } else if (
      !errors.includes(item.name) &&
      elHTML.classList.contains("error")
    ) {
      elHTML.classList.remove("error");
      console.log(elHTML.classList);
    }
  });
});

checkoutForm.addEventListener("submit", (e) => handleSubmitForm(e));
