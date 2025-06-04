export default async function decorate(block) {
  // Create a wrapper for the image and text
  const wrapper = document.createElement("div");
  wrapper.classList.add("quote-wrapper");

  // Initialize variables
  let componentType = "noimage";
  let imagePosition = "left";
  let imageSrc = "";
  let imageAlt = "";
  let alignment = "left";
  let quoteText = "";
  let author = "";
  let authorTitle = "";

  // Define a mapping of index to actions
  const actions = [
    (child) => {
      componentType = child.textContent.trim().toLowerCase() || "noimage";
    },
    (child) => {
      imagePosition = child.textContent.trim().toLowerCase() || "left";
    },
    (child) => {
      const imgElement = child.querySelector("img");
      if (imgElement) {
        ({ src: imageSrc, alt: imageAlt = "Quote Image" } = imgElement);
      }
    },
    (child) => {
      alignment = child.textContent.trim().toLowerCase() || "left";
    },
    (child) => {
      quoteText = child;
    },
    (child) => {
      author = child.textContent.trim();
    },
    (child) => {
      authorTitle = child.textContent.trim();
    },
  ];

  // Iterate over block children and execute corresponding actions
  [...block.children].forEach((child, index) => {
    if (actions[index]) actions[index](child);
  });

  // Handle image
  const image =
    componentType === "withimage" && imageSrc
      ? Object.assign(document.createElement("img"), {
          src: imageSrc,
          alt: imageAlt,
          className: "quote-image",
        })
      : null;

  // Create a container for the text
  const textDiv = Object.assign(document.createElement("blockquote"), {
    className: `quote-text ${componentType === "noimage" ? `ta-${alignment} ai-${alignment}` : ""}`,
    style: componentType === "withimage" ? "text-align: left;" : "",
  });

  // Add the quote.svg as a background image using CSS
  textDiv.appendChild(
    Object.assign(document.createElement("span"), {
      className: "icon-quote",
      ariaHidden: true,
    }),
  );

  const quoteClasses = {
    DIV: ["quote-content"],
    H1: ["fs-normal", "lds-garamond-heading-1"],
    H2: ["fs-normal", "lds-garamond-heading-2"],
    H3: ["fs-normal", "lds-garamond-heading-3"],
    H4: ["fs-normal", "lds-garamond-heading-4"],
    H5: ["fs-normal", "lds-ringside-heading-5"],
    H6: ["fs-normal", "lds-ringside-heading-6", "quote-author"],
    P: ["fs-normal", "lds-ringside-heading-6", "quote-author"],
  };

  if (quoteText) {
    const quoteTextclasses = quoteText.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, div",
    );
    quoteTextclasses.forEach((el) => {
      const classes = quoteClasses[el.tagName.trim()] || [];
      if (classes.length) {
        el.classList.add(...classes);
      }
    });
    textDiv.appendChild(quoteText);
  }

  // Add the author
  if (author) {
    textDiv.appendChild(
      Object.assign(document.createElement(image ? "h6" : "p"), {
        className: `${image ? quoteClasses.H6.join(" ") : quoteClasses.P.join(" ")} fw-900`,
        textContent: author,
      }),
    );
  }

  // Add the author-title
  if (authorTitle) {
    textDiv.appendChild(
      Object.assign(document.createElement(image ? "h6" : "p"), {
        className: `${image ? quoteClasses.H6.join(" ") : quoteClasses.P.join(" ")}`,
        textContent: authorTitle,
      }),
    );
  }

  // Handle image alignment
  if (image) {
    if (imagePosition === "right") wrapper.classList.add("image-right");
    wrapper.append(image, textDiv);
  } else {
    wrapper.appendChild(textDiv);
  }

  // Clear the block and append the wrapper
  block.innerHTML = "";
  block.appendChild(wrapper);
}
