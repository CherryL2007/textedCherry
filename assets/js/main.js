"use strict";
 
      



var Form = function () {
  var createForm = function createForm() {
    if (typeof jQuery == 'undefined') {
      return;
    }
    if (typeof validate == 'undefined') {
      return;
    }
    if (typeof intlTelInput === 'undefined') {
      return;
    }
    var elements = [].slice.call(document.querySelectorAll('[data-control="form"]'));
    elements.map(function (form) {
      if (form.getAttribute("data-initialized") === "1") {
        return;
      }
      var phoneInput = form.querySelector('input[name="phone"]');
      var phone = window.intlTelInput(phoneInput, {
        initialCountry: "auto",
        separateDialCode: true,
        hiddenInput: "fullphone",
        preferredCountries: ["fr", "us", "gb"],
        geoIpLookup: function geoIpLookup(callback) {
          $.get('https://ipinfo.io', function () {}, "jsonp").always(function (resp) {
            var countryCode = resp && resp.country ? resp.country : "ua";
            callback(countryCode);
          });
        }
      });
      $(phoneInput).on('countrychange', function (e) {
        var currentMask = $(this).attr('placeholder').replace(/[0-9+]/ig, '9');
        $(this).attr('placeholder', currentMask);
        $(phoneInput).inputmask({
          mask: currentMask,
          keepStatic: true
        });
      });
      var constraints = {
        name: {
          presence: true,
          length: {
            minimum: 3,
            maximum: 20
          }
        },
        surname: {
          presence: false,
          length: {
            minimum: 3,
            maximum: 20
          }
        },
        email: {
          presence: true,
          email: true
        },
        phone: {
          presence: true,
          format: {
            pattern: "[0-9- ]+",
            flags: "i",
            message: "can only contain 0-9"
          }
        }
      };
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        handleFormSubmit(form);
      });
       
      function handleFormSubmit(form, input) {
        var errors = validate(form, constraints);
        showErrors(form, errors || {});
        if (!errors) {
          showSuccess();
        }
      }
      function showErrors(form, errors) {
        _.each(form.querySelectorAll("input[name]:not([type='hidden']), select[name]"), function (input) {
          showErrorsForInput(input, errors && errors[input.name]);
        });
      }
      function showErrorsForInput(input, errors) {
        var formGroup = closestParent(input.parentNode, "form-group");
        var messages = formGroup.querySelector(".messages");
        resetFormGroup(formGroup);
        if (errors) {
          formGroup.classList.add("has-error");
          _.each(errors, function (error) {
            addError(messages, error);
          });
        } else {
          formGroup.classList.add("has-success");
        }
      }
      function closestParent(child, className) {
        if (!child || child == document) {
          return null;
        }
        if (child.classList.contains(className)) {
          return child;
        } else {
          return closestParent(child.parentNode, className);
        }
      }
      function resetFormGroup(formGroup) {
        formGroup.classList.remove("has-error");
        formGroup.classList.remove("has-success");
        _.each(formGroup.querySelectorAll(".help-block.error"), function (el) {
          el.parentNode.removeChild(el);
        });
      }
      function addError(messages, error) {
        var block = document.createElement("p");
        block.classList.add("help-block");
        block.classList.add("error");
        block.innerText = error;
        messages.appendChild(block);
      }
      function showSuccess() {
        $(form).append('<input type="hidden" name="url" value="' + window.location.href + '" /> ').submit();
      }
        
        
        
        $('#regBut').on('click', function(){
            var errors = validate(form, constraints);
        showErrors(form, errors || {});
        if (!errors) {
            let selectedOption = age.options[age.selectedIndex];
 
    var step;
    for (step = 18; step < 66; step++) {
      let newOption = new Option(step, step);
      age.append(newOption);
    }
           const stepFirst = document.querySelectorAll('.first');
                        stepFirst.forEach(element => {
                        element.style.display = "none";
                    });
         
                    const stepTwo = document.querySelectorAll('.sec');
                        stepTwo.forEach(element => {
                        element.style.display = "block";
                    });         
        }    
        
        })
        
    });
      
  
      
  };
  return {
    createInstances: function createInstances() {
      createForm();
    },
    onDOMContentLoaded: function onDOMContentLoaded(callback) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback();
      }
    }
  };
}();
Form.onDOMContentLoaded(function () {
  Form.createInstances();
});