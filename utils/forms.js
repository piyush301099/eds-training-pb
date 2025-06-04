export function showCaptchaExpired(
  captchaExpiredMsg,
  msg = "Verification expired. Check the checkbox again.",
) {
  captchaExpiredMsg.textContent = msg;
  captchaExpiredMsg.style.display = "block";
}

export function hideCaptchaExpired(captchaExpiredMsg) {
  captchaExpiredMsg.style.display = "none";
}

export function showFormErrorBanner(alertBanner, errorFields) {
  let msg = "";
  if (errorFields.length === 1) {
    msg = `An error has occurred in your form. Please check ${errorFields[0]} and submit again.`;
  } else {
    msg = `Multiple errors have occurred in your form. Please check ${errorFields.join(
      ", ",
    )} and submit again.`;
  }
  alertBanner.innerHTML = `<div>${msg}</div>`;
  alertBanner.style.display = "block";
}

export async function handleExpandedAccessFormSubmit(formData) {
  const body = `\nHCP Contact Form Data:\n  Name: ${formData.firstName} ${formData.lastName}\n  Organization: ${formData.organization}\n  Country: ${formData.country}\n  Phone: ${formData.phone}\n  Email: ${formData.email}\n  Investigational Medicine: ${formData.medicine}`;

  const payload = {
    subject: "Lilly.com Expanded Access Form Request",
    body,
    contentType: "Text",
    recipient: "USAnswersCenter@Lilly.com",
  };

  // Instead of alert, show message in a div below the CTA button
  let messageDiv = document.querySelector(".expanded-access-form-message");
  if (!messageDiv) {
    messageDiv = document.createElement("div");
    messageDiv.className =
      "expanded-access-form-message lds-ringside-body-medium";
    // Try to insert after CTA button if possible
    const ctaBtn = document.querySelector(".cta-button-filled");
    if (ctaBtn?.parentNode) {
      ctaBtn.parentNode.insertBefore(messageDiv, ctaBtn.nextSibling);
    } else {
      document.body.appendChild(messageDiv);
    }
  }
  messageDiv.textContent = "";

  try {
    const response = await fetch("/hcp-submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      messageDiv.textContent =
        "Your information has been submitted successfully.";
      // fireAnalyticsEvent('form_complete');
    } else {
      messageDiv.textContent =
        "There was an error submitting your information.";
      // fireAnalyticsEvent('form_error', { errorType: 'submit' });
    }
  } catch (e) {
    messageDiv.textContent = "There was an error submitting your information.";
    // fireAnalyticsEvent('form_error', { errorType: 'submit' });
  }
}

export function decorateInputField(field) {
  const {
    label,
    name,
    type = "text",
    placeholder = "",
    ariaLabel = "",
  } = field;
  const wrapper = document.createElement("div");
  wrapper.className = "form-field";

  const labelEl = document.createElement("label");
  labelEl.textContent = label;
  labelEl.htmlFor = name;
  labelEl.className = "lds-ringside-body-small";

  const input = document.createElement("input");
  input.name = name;
  input.type = type;
  input.placeholder = placeholder;
  // Hide placeholder visually and from screen readers if input has value
  input.addEventListener("input", () => {
    if (input.value) {
      input.setAttribute("data-prev-placeholder", input.placeholder);
      input.placeholder = "";
    } else {
      input.placeholder =
        input.getAttribute("data-prev-placeholder") || placeholder;
    }
  });
  input.className = "lds-ringside-body-large";
  if (ariaLabel) {
    input.setAttribute("aria-label", ariaLabel);
  }

  const error = document.createElement("div");
  error.className = "error-msg";

  wrapper.append(labelEl, input, error);
  return { wrapper, input, error };
}

export function decorateForm(fields, onSubmit) {
  function validateField(fieldObj, allValues) {
    const { input, error, validation = [], pattern, validate } = fieldObj;
    const value = input.value.trim();
    const errors = [];

    input.classList.remove("error", "success");
    input.setAttribute("aria-invalid", "false");

    // Always run all validations, even if value is empty, to show all errors
    if (validation.includes("required") && !value) {
      errors.push("This field is required");
    }

    if (validation.includes("email") && !/\S+@\S+\.\S+/.test(value)) {
      errors.push("This field must be an email");
    }

    if (
      validation.includes("confirmEmail") &&
      (value !== allValues.email || !value || !allValues.email)
    ) {
      errors.push("Value does not match the Email field");
    }

    if (validation.includes("phone") && !/^\d{3}-\d{3}-\d{4}$/.test(value)) {
      errors.push("Invalid format (e.g. 555-555-5555)");
    }

    if (pattern && (!value || !pattern.test(value))) {
      errors.push("Invalid format");
    }

    if (typeof validate === "function" && !validate(value, allValues)) {
      errors.push("Invalid value");
    }

    if (errors.length > 0) {
      error.innerHTML = errors
        .map(
          (e) =>
            `<div class="error-line"><span class='icon icon-form-error'></span><span>${e}</span></div>`,
        )
        .join("");
      // Decorate the error icon with the SVG using decorateIcons
      import("../scripts/aem.js").then(({ decorateIcons }) => {
        decorateIcons(error);
      });
      input.classList.add("error");
      input.setAttribute("aria-invalid", "true");
      return false;
    }
    error.textContent = "";
    input.classList.add("success");
    return true;
  }

  const form = document.createElement("form");
  form.className = "form-wrapper";
  const inputs = {};

  const alertBanner = document.createElement("div");
  alertBanner.className = "form-alert-banner";
  alertBanner.style.display = "none";
  form.append(alertBanner);

  fields.forEach((field) => {
    const { wrapper, input, error } = decorateInputField(field);

    inputs[field.name] = { ...field, input, error };
    form.append(wrapper);

    input.addEventListener("input", () => {
      const allValues = {};
      Object.entries(inputs).forEach(([k, v]) => {
        allValues[k] = v.input.value.trim();
      });
      validateField(inputs[field.name], allValues);
    });
  });

  function validateAndSubmit() {
    const data = {};
    let isValid = true;
    const errorFields = [];

    Object.entries(inputs).forEach(([k, v]) => {
      data[k] = v.input.value.trim();
    });

    Object.entries(inputs).forEach(([, fieldObj]) => {
      const valid = validateField(fieldObj, data);
      if (!valid) {
        isValid = false;
        errorFields.push(fieldObj.label);
      }
    });

    const uniqueErrorFields = [...new Set(errorFields)];

    if (!isValid) {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      let msg = "";
      if (uniqueErrorFields.length === 1) {
        msg = `An error has occurred in your form. Please check ${uniqueErrorFields[0]} and submit again.`;
      } else {
        msg = `Multiple errors have occurred in your form. Please check ${uniqueErrorFields.join(
          ", ",
        )} and submit again.`;
      }
      alertBanner.innerHTML = `<div>${msg}</div>`;
      alertBanner.style.display = "block";
    } else {
      alertBanner.style.display = "none";
      onSubmit(data);
    }
  }

  return { form, validateAndSubmit };
}
