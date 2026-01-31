/**
* PHP Email Form Validation - v3.9
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  // helper to show/hide blocks (keeps existing class usage)
  function show(el) { el.classList.add('d-block'); }
  function hide(el) { el.classList.remove('d-block'); }

  const forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      // HTML5 validation check — if the fields are invalid, let the browser show native messages
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const thisForm = this;
      const action = thisForm.getAttribute('action');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      const loadingEl = thisForm.querySelector('.loading');
      const errorEl = thisForm.querySelector('.error-message');
      const successEl = thisForm.querySelector('.sent-message');

      show(loadingEl);
      hide(errorEl);
      hide(successEl);
      
      const formData = new FormData(thisForm);

      // FormSubmit accepts normal POSTs; we send with fetch.
      fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
          // FormSubmit works fine without forcing a content-type (browser sets it).
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => {
        hide(loadingEl);

        // FormSubmit often replies with a 200 and a redirect page HTML.
        // Treat any 2xx as success.
        if (response.ok) {
          show(successEl);
          thisForm.reset();
          return;
        }

        // otherwise read response body for a useful message
        return response.text().then(text => {
          throw new Error(text || (response.status + ' ' + response.statusText));
        });
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
    });
  });

  function displayError(thisForm, error) {
    const loadingEl = thisForm.querySelector('.loading');
    const errorEl = thisForm.querySelector('.error-message');
    hide(loadingEl);
    errorEl.innerHTML = (typeof error === 'string') ? error : (error.message || 'Form submission failed');
    show(errorEl);
  }

})();