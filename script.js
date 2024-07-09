const buttons = document.querySelectorAll(".btn");
const textInput = document.querySelector("#cash");
const delBtn = document.querySelector(".delet");
const purchaseBtn = document.querySelector('#purchase-btn');

let chars = [];

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    cash.value += btn.innerText;
    chars = textInput.value.split("");
  });
});

delBtn.addEventListener("click", () => {
  chars.pop();
  textInput.value = chars.join("");
});
