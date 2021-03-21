/* eslint-disable quotes */
/*
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function () {
  "use strict";

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

  const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === "[::1]" ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );

  if (
    "serviceWorker" in navigator &&
    (window.location.protocol === "https:" || isLocalhost)
  ) {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(function (registration) {
        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function () {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            const installingWorker = registration.installing;

            installingWorker.onstatechange = function () {
              switch (installingWorker.state) {
                case "installed":
                  // At this point, the old content will have been purged and the
                  // fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in the page's interface.
                  break;

                case "redundant":
                  throw new Error(
                    "The installing " + "service worker became redundant."
                  );

                default:
                // Ignore
              }
            };
          }
        };
      })
      .catch(function (e) {
        console.error("Error during service worker registration:", e);
      });
  }

  // Your custom JavaScript goes here
  const checkoutForm = document.querySelector(".checkout-form");
  const submitBtn = document.getElementById("checkout-submit-btn");
  checkoutForm.addEventListener("submit", (e) => handleSubmitForm(e));
  const checkoutFormItem = [
    { name: "first-name", type: "text" },
    { name: "last-name", type: "text" },
    { name: "email", type: "email" },
    { name: "country", type: "select" },
    { name: "postal-code", type: "number", maxLength: 5 },
    { name: "phone-number", type: "number", maxLength: undefined },
    { name: "credit-card-number", type: "number", maxLength: 16 },
    { name: "security-code", type: "number", maxLength: 3 },
    { name: "expiration-date", type: "number", maxLength: 5 },
    { name: "total", type: "text" },
  ];

  //form validation for each element
  checkoutFormItem.forEach((item) => {
    const elHTML = document.getElementById(item.name);
    if (item.type === "number") {
      elHTML.addEventListener("input", (e) => {
        if (item.maxLength !== undefined) {
          elHTML.value = numberValidation(e, item.maxLength);
        } else {
          elHTML.value = numberValidation(e);
        }
      });
    } else if (item.type === "text") {
      elHTML.addEventListener("input", (e) => {
        elHTML.value = textValidation(e);
      });
    }
  });

  function handleSubmitForm(e) {
    e.preventDefault();
    let formData = {};
    let errors = [];
    checkoutFormItem.forEach((item) => {
      const element = document.getElementById(item.name);
      formData[toCamelCase(item.name)] = element.value;
    });
    document.getElementById("code").innerHTML = `${JSON.stringify(formData)}`;
    submitBtn.classList.add("success");
    setTimeout(() => {
      submitBtn.classList.remove("success");
    }, 2000);
  }

  function numberValidation(event, maxLength) {
    let newValue = event.target.value.replace(/[^0-9]/gi, "");
    if (maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    return newValue;
  }
  function textValidation(event) {
    return event.target.value.replace(/[0-9]/gi, "");
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

  // function divideBySign(word, spaces) {
  //   const value = word.replace(/-/g, "");
  //   const chunks = [];
  //   if (value.length > spaces[0]) {
  //     spaces.forEach((space, index) => {
  //       if (index !== 0) {
  //         if (value.length < space) {
  //           chunks.push(value.slice(spaces[index - 1], value.length));
  //         } else {
  //           chunks.push(value.slice(spaces[index - 1], space));
  //         }
  //       } else {
  //         chunks.push(value.slice(0, space));
  //       }
  //     });
  //   } else {
  //     chunks.push(value.slice(0, word.length));
  //   }
  //   return chunks.join("-");
  // }
})();
