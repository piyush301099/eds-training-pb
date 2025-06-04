import { createCTAButton } from "../../utils/cta.js";
import {
  decorateForm,
  handleExpandedAccessFormSubmit,
  hideCaptchaExpired,
} from "../../utils/forms.js";
export default function decorate(block) {
  const container = document.createElement("div");
  container.className = "form-fields";

  const classNames = [
    "form-title lds-ringside-heading-3-desktop",
    "form-description lds-ringside-body-medium",
    "disclaimer lds-ringside-body-small",
  ];

  const divs = [...block.children].map((child, i) => {
    const div = document.createElement("div");
    div.className = classNames[i] || "";
    while (child.firstChild) div.appendChild(child.firstChild);
    return div;
  });

  // Append form-title and form-description first
  if (divs[0]) container.appendChild(divs[0]);
  if (divs[1]) container.appendChild(divs[1]);

  const fields = [
    {
      label: "First name",
      name: "firstName",
      type: "text",
      placeholder: "First name",
      validation: ["required"],
      ariaLabel: "First name",
    },
    {
      label: "Last name",
      name: "lastName",
      type: "text",
      placeholder: "Last name",
      validation: ["required"],
      ariaLabel: "Last name",
    },
    {
      label: "Organization or affiliation",
      name: "organization",
      type: "text",
      placeholder: "Organization or affiliation",
      validation: ["required"],
      ariaLabel: "Organization or affiliation",
    },
    {
      label: "Country",
      name: "country",
      type: "text",
      placeholder: "Country",
      validation: ["required"],
      ariaLabel: "Country",
    },
    {
      label: "Email",
      name: "email",
      type: "text",
      placeholder: "Email",
      validation: ["required", "email"],
      ariaLabel: "Email",
    },
    {
      label: "Email confirmation",
      name: "emailConfirm",
      type: "text",
      placeholder: "Email confirmation",
      validation: ["required", "email", "confirmEmail"],
      ariaLabel: "Email confirmation",
    },
    {
      label: "Phone",
      name: "phone",
      type: "text",
      placeholder: "Phone",
      validation: ["required", "phone"],
      ariaLabel: "Phone",
    },
    {
      label: "Investigational medicine",
      name: "medicine",
      type: "text",
      placeholder: "Investigational medicine",
      validation: ["required"],
      ariaLabel: "Investigational medicine",
    },
  ];

  // Use centralized form submit utility with Adobe Data Layer analytics for complete/error
  const onSubmit = async (formData) => {
    let errorMessage = "";
    let errorSource = "";
    let errorCode = "";
    let response = null;
    try {
      // Try to submit and capture the fetch response
      response = await handleExpandedAccessFormSubmit(formData);
      // If handleExpandedAccessFormSubmit returns a response object, check status
      if (response?.ok) {
        if (window.adobeDataLayer && Array.isArray(window.adobeDataLayer)) {
          window.adobeDataLayer.push({
            event: "form_complete",
            eventinfo: {
              eventName: "form complete",
              formName: "expanded-access-form",
              formId: "expanded-access-form", // or use a real ID if available
              productService: formData.medicine || "",
            },
            componentInfo: {
              componentName: "expanded-access-form",
            },
          });
        }
      } else {
        // Error from server/service
        errorMessage = response?.statusText
          ? response.statusText
          : "Unknown error";
        errorSource = "/hcp-submit";
        errorCode = response?.status ? String(response.status) : "unknown";
        if (window.adobeDataLayer && Array.isArray(window.adobeDataLayer)) {
          window.adobeDataLayer.push({
            event: "form_error",
            eventinfo: {
              eventName: "form error",
              errorMessage,
              errorSource,
              errorCode,
            },
            componentInfo: {
              componentName: "expanded-access-form",
            },
          });
        }
      }
    } catch (e) {
      // JS/fetch error
      errorMessage = e?.message ? e.message : "Unknown error";
      errorSource = "/hcp-submit";
      errorCode = "js-error";
      if (window.adobeDataLayer && Array.isArray(window.adobeDataLayer)) {
        window.adobeDataLayer.push({
          event: "form_error",
          eventinfo: {
            eventName: "form error",
            errorMessage,
            errorSource,
            errorCode,
          },
          componentInfo: {
            componentName: "expanded-access-form",
          },
        });
      }
    }
  };
  // Track first interaction for analytics
  let hasFiredInteraction = false;

  // Wrap the onInput handler to fire form_interaction only once
  function decorateFormWithInteraction(formFields, submitHandler) {
    const { form, validateAndSubmit } = decorateForm(formFields, submitHandler);
    // Add event listener to all input fields for first interaction
    const inputs = form.querySelectorAll("input, textarea, select");
    const fireInteraction = () => {
      if (!hasFiredInteraction) {
        hasFiredInteraction = true;
        if (window.adobeDataLayer && Array.isArray(window.adobeDataLayer)) {
          window.adobeDataLayer.push({
            event: "form_interaction",
            eventinfo: {
              eventName: "form interaction",
              formName: "expanded-access-form",
              formId: "expanded-access-form",
            },
            componentInfo: {
              componentName: "expanded-access-form",
            },
          });
        }
      }
    };
    inputs.forEach((input) => {
      input.addEventListener("input", fireInteraction, { once: true });
      input.addEventListener("focus", fireInteraction, { once: true });
    });
    return { form, validateAndSubmit };
  }

  // Build form and expose validateAndSubmit
  const { form, validateAndSubmit } = decorateFormWithInteraction(
    fields,
    onSubmit,
  );

  // Append form (fields only)
  const formSection = document.createElement("div");
  formSection.className = "form-section";
  formSection.appendChild(form);
  container.appendChild(formSection);

  // OUTSIDE FORM: disclaimer, captcha, error, button
  // Disclaimer (above captcha)
  if (divs[2]) {
    container.appendChild(divs[2]);
  }
  // Captcha
  const RECAPTCHA_SITE_KEY = "6LfAk80UAAAAAMX8wkysDJd3SyCoVCMmUlB9NW_9";
  const recaptchaDiv = document.createElement("div");
  recaptchaDiv.className = "form-captcha";
  recaptchaDiv.innerHTML = `<div class="g-recaptcha" data-sitekey="${RECAPTCHA_SITE_KEY}"></div>`;
  container.appendChild(recaptchaDiv);
  // Inject Google reCAPTCHA script if not already present
  if (
    !document.querySelector('script[src*="www.google.com/recaptcha/api.js"]')
  ) {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  // Captcha expired message (inside captcha)
  const captchaExpiredMsg = document.createElement("div");
  captchaExpiredMsg.className = "captcha-expired-msg";
  captchaExpiredMsg.style.display = "none";
  container.appendChild(captchaExpiredMsg);

  // CTA button (at the end, below captcha and error)
  const ctaButton = createCTAButton({
    action: "event-handling",
    type: "",
    variation: "cta-button-filled",
    label: "Submit your information",
    ariaLabel: "Submit your information",
    icon: "arrow-icon",
    componentName: "Forms Utility",
    onClick: validateAndSubmit,
  });
  container.appendChild(ctaButton);

  // Captcha expired callback (Google reCAPTCHA v2)
  window.eaCaptchaExpired = () => {
    showCaptchaExpired(captchaExpiredMsg);
  };
  window.eaCaptchaCallback = () => {
    hideCaptchaExpired(captchaExpiredMsg);
  };

  // Add expired and callback handlers to reCAPTCHA widget
  // (If not already present in the markup)
  const recaptchaWidget = recaptchaDiv.querySelector(".g-recaptcha");
  if (recaptchaWidget) {
    recaptchaWidget.setAttribute("data-expired-callback", "eaCaptchaExpired");
    recaptchaWidget.setAttribute("data-callback", "eaCaptchaCallback");
  }

  // Analytics: fire form_view event on render
  if (window.adobeDataLayer && Array.isArray(window.adobeDataLayer)) {
    window.adobeDataLayer.push({
      event: "form_view",
      formName: "expanded-access-form",
      component: "expanded-access-form",
      timestamp: new Date().toISOString(),
    });
  }

  // Finalize block
  block.textContent = "";
  block.appendChild(container);
}
