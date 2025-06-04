function createMultiselect(name, placeholder, options) {
  const wrapper = document.createElement("div");
  wrapper.className = "multiselect-wrapper";

  const label = document.createElement("label");
  label.className = "multiselect-label";
  label.textContent = placeholder;
  label.setAttribute("for", `multiselect-input-${name}`);

  const inputContainer = document.createElement("div");
  inputContainer.className = "multiselect-input-container";

  const tagContainer = document.createElement("div");
  tagContainer.className = "multiselect-tags";
  tagContainer.setAttribute("aria-live", "polite");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = placeholder;
  input.className = "multiselect-input";
  input.id = `multiselect-input-${name}`;
  input.setAttribute("aria-label", placeholder);
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-haspopup", "listbox");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-controls", `multiselect-dropdown-${name}`);

  // Prevent dropdown from opening when clicking the label
  label.addEventListener("click", (e) => {
    e.preventDefault();
    input.focus();
  });
  label.addEventListener("mousedown", (e) => {
    e.preventDefault();
    input.focus();
  });

  const arrowSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  arrowSvg.setAttribute("width", "24");
  arrowSvg.setAttribute("height", "24");
  arrowSvg.setAttribute("viewBox", "0 0 24 24");
  arrowSvg.setAttribute("fill", "none");
  arrowSvg.classList.add("arrow-svg");
  const downPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  downPath.setAttribute(
    "d",
    "M20.0306 9.53068L12.5306 17.0307C12.461 17.1004 12.378 17.1557 12.2872 17.1935C12.1961 17.2312 12.0986 17.2506 12 17.2506C11.9014 17.2506 11.8038 17.2312 11.7128 17.1935C11.6217 17.1557 11.539 17.1004 11.4694 17.0307L3.96936 9.53068C3.82863 9.38995 3.74957 9.19907 3.74957 9.00005C3.74957 8.80103 3.82863 8.61016 3.96936 8.46943C4.1101 8.32869 4.30097 8.24963 4.49999 8.24963C4.69901 8.24963 4.88988 8.32869 5.03061 8.46943L12 15.4397L18.9694 8.46943C19.039 8.39974 19.1218 8.34447 19.2128 8.30676C19.3039 8.26904 19.4014 8.24963 19.5 8.24963C19.5985 8.24963 19.6961 8.26904 19.7872 8.30676C19.8782 8.34447 19.9609 8.39974 20.0306 8.46943C20.1003 8.53911 20.1556 8.62183 20.1933 8.71288C20.231 8.80392 20.2504 8.9015 20.2504 9.00005C20.2504 9.0986 20.231 9.19618 20.1933 9.28722C20.1556 9.37827 20.1003 9.46099 20.0306 9.53068Z",
  );
  downPath.setAttribute("fill", "#191919");
  const upPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  upPath.setAttribute(
    "d",
    "M20.0306 15.5306C19.961 15.6003 19.8782 15.6557 19.7872 15.6934C19.6961 15.7311 19.5986 15.7506 19.5 15.7506C19.4014 15.7506 19.3038 15.7311 19.2128 15.6934C19.1217 15.6557 19.039 15.6003 18.9694 15.5306L12 8.56029L5.03061 15.5306C4.88988 15.6713 4.69901 15.7504 4.49999 15.7504C4.30097 15.7504 4.1101 15.6713 3.96936 15.5306C3.82863 15.3899 3.74957 15.199 3.74957 15C3.74957 14.801 3.82863 14.6101 3.96936 14.4694L11.4694 6.96935C11.539 6.89962 11.6217 6.8443 11.7128 6.80656C11.8038 6.76882 11.9014 6.74939 12 6.74939C12.0986 6.74939 12.1961 6.76882 12.2872 6.80656C12.3782 6.8443 12.461 6.89962 12.5306 6.96935L20.0306 14.4694C20.1003 14.539 20.1557 14.6217 20.1934 14.7128C20.2312 14.8038 20.2506 14.9014 20.2506 15C20.2506 15.0985 20.2312 15.1961 20.1934 15.2872C20.1557 15.3782 20.1003 15.4609 20.0306 15.5306Z",
  );
  upPath.setAttribute("fill", "#191919");
  arrowSvg.appendChild(downPath);

  inputContainer.append(tagContainer, input, arrowSvg);

  const dropdown = document.createElement("div");
  dropdown.className = "multiselect-dropdown";
  dropdown.id = `multiselect-dropdown-${name}`;
  dropdown.setAttribute("role", "listbox");
  dropdown.setAttribute("aria-multiselectable", "true");

  const selected = new Set();
  let focusedIndex = -1; // For keyboard navigation

  const updateTags = () => {
    tagContainer.innerHTML = "";
    Array.from(selected).forEach((value) => {
      const tag = document.createElement("span");
      tag.textContent = value;
      tag.className = "tag";
      tag.setAttribute("role", "listitem");
      const close = document.createElement("span");
      close.textContent = "×";
      close.className = "remove-tag";
      close.setAttribute("aria-label", `Remove ${value}`);
      close.setAttribute("tabindex", "0");
      close.addEventListener("click", () => {
        selected.delete(value);
        updateTags();
        /* eslint-disable no-use-before-define */
        updateDropdown();
      });
      close.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          selected.delete(value);
          updateTags();
          /* eslint-disable no-use-before-define */
          updateDropdown();
        }
      });
      tag.appendChild(close);
      tagContainer.appendChild(tag);
    });
    input.placeholder = selected.size > 0 ? "" : placeholder;
    wrapper.querySelectorAll("input[type=hidden]").forEach((e) => e.remove());
    Array.from(selected).forEach((value) => {
      const hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = name;
      hidden.value = value;
      wrapper.appendChild(hidden);
    });

    // Hide input if tags exist, show if not
    if (selected.size > 0) {
      input.classList.add("multiselect-input-hidden");
    } else {
      input.classList.remove("multiselect-input-hidden");
    }
  };

  const updateDropdown = (filter = "") => {
    dropdown.innerHTML = "";
    let optionIndex = 0;
    options.forEach((option) => {
      if (option.toLowerCase().includes(filter.toLowerCase())) {
        const item = document.createElement("div");
        item.textContent = option;
        item.setAttribute("role", "option");
        item.setAttribute(
          "aria-selected",
          selected.has(option) ? "true" : "false",
        );
        item.className = selected.has(option) ? "selected" : "";
        item.tabIndex = -1; // Make option programmatically focusable
        item.dataset.index = optionIndex;
        if (optionIndex === focusedIndex) {
          item.classList.add("focused");
          setTimeout(() => item.focus(), 0); // Ensure focus after DOM update
        }
        item.addEventListener("mouseenter", () => {
          item.classList.add("hovered");
        });
        item.addEventListener("mouseleave", () => {
          item.classList.remove("hovered");
        });
        item.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (selected.has(option)) selected.delete(option);
          else selected.add(option);
          input.value = "";
          updateTags();
          updateDropdown();
        });
        item.addEventListener("keydown", (e) => {
          // Tab: close dropdown and allow focus to move to next field
          if (e.key === "Tab") {
            dropdown.style.display = "none";
            input.setAttribute("aria-expanded", "false");
            arrowSvg.replaceChild(downPath, arrowSvg.firstChild);
            focusedIndex = -1;
            return;
          }
          // Escape: close dropdown and return focus to input
          if (e.key === "Escape") {
            dropdown.style.display = "none";
            input.setAttribute("aria-expanded", "false");
            arrowSvg.replaceChild(downPath, arrowSvg.firstChild);
            focusedIndex = -1;
            input.focus();
            e.preventDefault();
            return;
          }
          // Keyboard navigation for options
          if (
            (e.key === "Enter" || e.key === " ") &&
            dropdown.style.display === "block"
          ) {
            const value = item.textContent;
            if (selected.has(value)) selected.delete(value);
            else selected.add(value);
            input.value = "";
            updateTags();
            updateDropdown();
            e.preventDefault();
          } else if (e.key === "ArrowDown") {
            const visibleOptions = Array.from(dropdown.children);
            let idx = Number(item.dataset.index);
            idx = (idx + 1) % visibleOptions.length;
            visibleOptions.forEach((el, i) => {
              el.classList.toggle("focused", i === idx);
              if (i === idx) el.focus();
            });
            focusedIndex = idx;
            e.preventDefault();
          } else if (e.key === "ArrowUp") {
            const visibleOptions = Array.from(dropdown.children);
            let idx = Number(item.dataset.index);
            idx = (idx - 1 + visibleOptions.length) % visibleOptions.length;
            visibleOptions.forEach((el, i) => {
              el.classList.toggle("focused", i === idx);
              if (i === idx) el.focus();
            });
            focusedIndex = idx;
            e.preventDefault();
          } else if (e.key === "Home") {
            const visibleOptions = Array.from(dropdown.children);
            visibleOptions.forEach((el, i) => {
              el.classList.toggle("focused", i === 0);
              if (i === 0) el.focus();
            });
            focusedIndex = 0;
            e.preventDefault();
          } else if (e.key === "End") {
            const visibleOptions = Array.from(dropdown.children);
            visibleOptions.forEach((el, i) => {
              el.classList.toggle("focused", i === visibleOptions.length - 1);
              if (i === visibleOptions.length - 1) el.focus();
            });
            focusedIndex = visibleOptions.length - 1;
            e.preventDefault();
          }
        });
        dropdown.appendChild(item);
        optionIndex += 1;
      }
    });
  };

  input.addEventListener("input", () => {
    focusedIndex = -1;
    updateDropdown(input.value);
  });

  input.addEventListener("focus", () => {
    input.setAttribute(
      "aria-expanded",
      dropdown.style.display === "block" ? "true" : "false",
    );
  });

  input.addEventListener("keydown", (e) => {
    const visibleOptions = Array.from(dropdown.children);

    // Open dropdown on Enter/Space if closed
    if (
      (e.key === " " || e.key === "Enter") &&
      dropdown.style.display !== "block"
    ) {
      updateDropdown(input.value);
      dropdown.style.display = "block";
      input.setAttribute("aria-expanded", "true");
      arrowSvg.replaceChild(upPath, arrowSvg.firstChild);
      focusedIndex = 0;
      e.preventDefault();
      updateDropdown(input.value);
      if (dropdown.children[0]) {
        dropdown.children[0].classList.add("focused");
        dropdown.children[0].focus();
      }
      return;
    }

    // Tab: close dropdown and allow focus to move to next field
    if (e.key === "Tab" && dropdown.style.display === "block") {
      dropdown.style.display = "none";
      input.setAttribute("aria-expanded", "false");
      arrowSvg.replaceChild(downPath, arrowSvg.firstChild);
      focusedIndex = -1;
      return;
    }

    // Keyboard navigation when dropdown is open
    if (dropdown.style.display === "block") {
      if (e.key === "ArrowDown") {
        if (visibleOptions.length > 0) {
          focusedIndex = (focusedIndex + 1) % visibleOptions.length;
          visibleOptions.forEach((el, idx) => {
            el.classList.toggle("focused", idx === focusedIndex);
            if (idx === focusedIndex) el.focus();
          });
          e.preventDefault();
        }
      } else if (e.key === "ArrowUp") {
        if (visibleOptions.length > 0) {
          focusedIndex =
            (focusedIndex - 1 + visibleOptions.length) % visibleOptions.length;
          visibleOptions.forEach((el, idx) => {
            el.classList.toggle("focused", idx === focusedIndex);
            if (idx === focusedIndex) el.focus();
          });
          e.preventDefault();
        }
      } else if (e.key === "Home") {
        if (visibleOptions.length > 0) {
          focusedIndex = 0;
          visibleOptions.forEach((el, idx) => {
            el.classList.toggle("focused", idx === 0);
            if (idx === 0) el.focus();
          });
          e.preventDefault();
        }
      } else if (e.key === "End") {
        if (visibleOptions.length > 0) {
          focusedIndex = visibleOptions.length - 1;
          visibleOptions.forEach((el, idx) => {
            el.classList.toggle("focused", idx === focusedIndex);
            if (idx === focusedIndex) el.focus();
          });
          e.preventDefault();
        }
      } else if ((e.key === "Enter" || e.key === " ") && focusedIndex > -1) {
        const focusedOption = visibleOptions[focusedIndex];
        if (focusedOption) {
          const value = focusedOption.textContent;
          if (selected.has(value)) selected.delete(value);
          else selected.add(value);
          input.value = "";
          updateTags();
          updateDropdown();
          e.preventDefault();
        }
      } else if (e.key === "Escape") {
        dropdown.style.display = "none";
        input.setAttribute("aria-expanded", "false");
        arrowSvg.replaceChild(downPath, arrowSvg.firstChild);
        focusedIndex = -1;
        input.focus();
        e.preventDefault();
      }
    }
  });

  inputContainer.addEventListener("click", (e) => {
    if (
      e.target === inputContainer ||
      e.target === input ||
      e.target === arrowSvg
    ) {
      if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
        input.setAttribute("aria-expanded", "false");
        arrowSvg.replaceChild(downPath, arrowSvg.firstChild);
      } else {
        updateDropdown("");
        dropdown.style.display = "block";
        input.setAttribute("aria-expanded", "true");
        input.focus();
        arrowSvg.replaceChild(upPath, arrowSvg.firstChild);
        focusedIndex = -1;
      }
    }
  });

  document.addEventListener("mousedown", (e) => {
    if (!wrapper.contains(e.target)) {
      dropdown.style.display = "none";
      input.setAttribute("aria-expanded", "false");
      arrowSvg.replaceChild(downPath, arrowSvg.firstChild);
      focusedIndex = -1;
    }
  });

  updateDropdown();
  updateTags();

  wrapper.append(label, inputContainer, dropdown);
  return wrapper;
}

export default createMultiselect;
