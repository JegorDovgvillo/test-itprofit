import IMask from "imask";
import { useAjax } from "../server/ajax/ajax";
import "../styles/mainStyles.scss";
import "../styles/mainPage.scss";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("myForm"),
    nameInput = document.getElementById("nameInput"),
    emailInput = document.getElementById("emailInput"),
    phoneInput = document.getElementById("phoneInput"),
    textarea = document.getElementById("messageText"),
    nameError = document.getElementById("nameError"),
    emailError = document.getElementById("emailError"),
    phoneError = document.getElementById("phoneError"),
    infoBlock = document.getElementById("infoBlock"),
    textAboutStatus = document.createElement("p"),
    modalButton = document.getElementsByClassName("modalbutton")[0],
    modalWindow = document.getElementsByClassName("modalWindow")[0],
    overlay = document.getElementById("overlay"),
    messageError = document.getElementById("messageError"),
    cross = document.getElementById("cross"),
    html = document.getElementsByTagName("html")[0];
  console.log(window.innerWidth - document.documentElement.clientWidth);
  const phoneMask = new IMask(phoneInput, {
    mask: "+{375}(00)000-00-00",
  });

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const { request } = useAjax();

  modalButton.addEventListener("click", function () {
    modalWindow.classList.toggle("open");
    overlay.style.display = "block";
    html.classList.add("noscroll");
  });

  cross.addEventListener("click", function () {
    modalWindow.classList.toggle("open");
    overlay.style.display = "none";
    html.classList.remove("noscroll");
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    // Проверка имени
    if (nameInput.value.trim() === "") {
      nameError.textContent = "Это обязательное поле";
      nameInput.classList.remove("correct");
      nameError.style.display = "block";
      isValid = false;
    } else {
      nameError.style.display = "none";
      nameInput.classList.add("correct");
    }

    // Проверка textarea
    if (textarea.value.trim() === "") {
      messageError.textContent = "Это обязательное поле";
      messageError.style.display = "block";
      textarea.classList.remove("correct");
      isValid = false;
    } else {
      messageError.style.display = "none";
      textarea.classList.add("correct");
    }

    // Проверка email
    if (!emailRegex.test(emailInput.value)) {
      emailError.textContent = "Адрес электронной почты не корректен";
      emailError.style.display = "block";
      emailInput.classList.remove("correct");
      isValid = false;
    } else {
      emailError.style.display = "none";
      emailInput.classList.add("correct");
    }

    // Проверка телефона
    if (!phoneMask.masked.isComplete) {
      phoneError.textContent = "Номер телефона не корректен";
      phoneError.style.display = "block";
      phoneInput.classList.remove("correct");
      isValid = false;
    } else {
      phoneError.style.display = "none";
      phoneInput.classList.add("correct");
    }

    if (isValid) {
      event.preventDefault();
      const formData = new FormData(form);
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      request({
        url: "http://localhost:9090/api/registration",
        data: {
          body: formObject,
        },
      })
        .then((res) => {
          if (res.status === "success") {
            textAboutStatus.textContent = res.data.message;
            infoBlock.appendChild(textAboutStatus);
            infoBlock.style.visibility = "visible";
            setTimeout(() => {
              infoBlock.style.visibility = "hidden";
            }, 5000);
            form.reset();
          } else {
            textAboutStatus.textContent = res.data.message;
            infoBlock.appendChild(textAboutStatus);
            infoBlock.style.visibility = "visible";
            setTimeout(() => {
              infoBlock.style.visibility = "hidden";
            }, 5000);
          }
        })
        .finally(form.reset(), (phoneMask.unmaskedValue = ""));
    }
  });
});
