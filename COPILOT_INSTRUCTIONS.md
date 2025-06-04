# GitHub Copilot Instructions for Adobe EDS Block Development

This document provides guidelines and references for using GitHub Copilot to assist in building Adobe EDS blocks. EDS blocks are modular components dynamically created using vanilla JavaScript based on the provided component JSON files.

---

## **1. Overview**
Adobe EDS blocks are built dynamically using the following JSON files:
- **`component-models.json`**: Defines the structure and fields for each block.
- **`component-filters.json`**: Groups components into logical filters.
- **`component-definition.json`**: Provides metadata and plugin configurations for each block.

Developers should use GitHub Copilot to assist in generating dynamic HTML and JavaScript for these blocks.

---

## **2. Development Workflow**
### **2.1 Environment Setup**
- **DEV Environment**: Use the DEV environment for building and testing blocks.
- **QA Environment**: Use the QA environment for validating and ensuring the quality of blocks.

### **2.2 Building Blocks**
1. **Understand the Component Structure**:
   - Refer to `component-models.json` for the fields and structure of each block.
   - Example: The `hero` block includes fields like `PrimarybackgroundType`, `BackgroundImage`, `EnableOverlay`, etc.

2. **Dynamic HTML Generation**:
   - Use vanilla JavaScript to dynamically generate HTML for blocks based on the component structure.
   - Example:
     ```javascript
     function createHeroBlock(data) {
       const heroWrapper = document.createElement('div');
       heroWrapper.className = 'hero-wrapper';

       if (data.PrimarybackgroundType === 'imageSlide') {
         const img = document.createElement('img');
         img.src = data.BackgroundImage;
         img.alt = data.ImageAlt;
         heroWrapper.appendChild(img);
       }

       if (data.EnableOverlay) {
         const overlay = document.createElement('div');
         overlay.className = 'hero-overlay';
         overlay.textContent = data.OverlayTitle;
         heroWrapper.appendChild(overlay);
       }

       return heroWrapper;
     }
     ```

3. **Follow Component Filters**:
   - Use `component-filters.json` to group components logically.
   - Example: The `cards` filter includes `card` and `icongrid-tile` components.

4. **Leverage Component Definitions**:
   - Use `component-definition.json` to define metadata and plugins for each block.
   - Example: The `hero` block uses the `xwalk` plugin for page-level configurations.

---

## **3. Guidelines for Using GitHub Copilot**

### **3.1 Provide Component References**
Ensure that each block has a corresponding `component.js` file that includes:
- **Component Definition**: Metadata and plugin configurations from `component-definition.json`.
- **Filters**: Logical grouping of components from `component-filters.json`.
- **Model Structure**: Field definitions and structure from `component-models.json`.

#### Example `component.js` File:
```javascript
export const heroComponent = {
  definition: {
    title: "Hero",
    id: "hero",
    plugins: {
      xwalk: {
        page: {
          resourceType: "core/franklin/components/block/v1/block",
          template: {
            name: "Hero",
            model: "hero"
          }
        }
      }
    }
  },
  filters: {
    id: "hero",
    components: ["hero"]
  },
  model: {
    id: "hero",
    fields: [
      {
        component: "select",
        name: "PrimarybackgroundType",
        label: "Primary Background Type",
        options: [
          { name: "Image", value: "imageSlide" },
          { name: "Video", value: "videoSlide" }
        ]
      },
      {
        component: "reference",
        name: "BackgroundImage",
        label: "Background Image",
        required: true
      },
      {
        component: "boolean",
        name: "EnableOverlay",
        label: "Enable Overlay?"
      },
      {
        component: "text",
        name: "OverlayTitle",
        label: "Overlay Title",
        required: true
      }
    ]
  }
};
```
### **3.2 Use Copilot for Dynamic HTML Generation**

Use the `component.js` file as a reference to dynamically generate HTML for blocks. GitHub Copilot can assist in creating reusable and dynamic HTML structures based on the component definitions, filters, and model structures.

### **Example: Dynamic HTML for Hero Block**
```javascript
import { heroComponent } from './component.js';

function createHeroBlock(data) {
  const heroWrapper = document.createElement('div');
  heroWrapper.className = 'hero-wrapper';

  // Add background image if the type is 'imageSlide'
  if (data.PrimarybackgroundType === 'imageSlide') {
    const img = document.createElement('img');
    img.src = data.BackgroundImage;
    img.alt = data.ImageAlt;
    heroWrapper.appendChild(img);
  }

  // Add overlay if enabled
  if (data.EnableOverlay) {
    const overlay = document.createElement('div');
    overlay.className = 'hero-overlay';
    overlay.textContent = data.OverlayTitle;
    heroWrapper.appendChild(overlay);
  }

  return heroWrapper;
}
```
### **3.3 Prompt Copilot Effectively**

To maximize the efficiency of GitHub Copilot, provide clear and concise prompts. Well-structured prompts help Copilot generate accurate and relevant code snippets for your requirements.

#### **Example Prompts**
1. **Dynamic HTML Generation**:
   - "Generate dynamic HTML for a hero block with an image and overlay."
   - "Create a function to render a card block with a title, description, and CTA."

2. **JavaScript Functionality**:
   - "Create a function to toggle a class on click."
   - "Write a function to fetch data from an API and render it in a list."

3. **Reusable Components**:
   - "Generate a reusable button component with customizable text and styles."
   - "Create a modal component with open and close functionality."

4. **Validation and Testing**:
   - "Ensure all code is following linting and formatting rules as described in the biome.js file at the root of the project"
   - "Write a Jest test case for a function that calculates the sum of two numbers."
   - "Generate a function to validate form inputs and return error messages."
