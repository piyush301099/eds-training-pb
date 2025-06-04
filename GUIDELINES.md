# Repository Cleanliness Guidelines

---

## Branch Naming Conventions

### Feature and Enhancement Branches
- **Prefix**: `feat/`
- **Purpose**: Used for new features or component enhancements.
- **Format**: `feat/[ticket-number]-[short-description]`
- **Example**: `feat/167-additional-links-component`

### Bug Fix Branches
- **Prefix**: `fix/`
- **Purpose**: Used for bug fixes.
- **Format**: `fix/[ticket-number]-[short-description]`
- **Example**: `fix/123-fix-header-bug`

### Test Branches
- **Purpose**: For testing on AEM publish and author pages, create a test branch from the ticket branch.
- **Prefix**: `test-`
- **Format**: `test-[ticket-number]`
- **Example**: `test-369`

---

## Usage in AEM

### Live Page Verification
- Replace `dev` with the test branch name in the live page URLs to check development.
- **Example**:
  - Original URL:  
    `https://dev--ewi-lilly-com-block-library--elilillyco.aem.page/components/accordion`
  - Modified URL:  
    `https://test-369--ewi-lilly-com-block-library--elilillyco.aem.page/components/accordion`

### Author Page Verification
- Add `?ref=[test-branch]` to the end of the URL to verify on the author page.
- **Example**:  
  `https://author-p153303-e1585520.adobeaemcloud.com/content/ewi-lilly-com-block-library/components/accordion.html?ref=test-369`

---

## Post-Merge Cleanup
- **Delete Test Branch**: After the ticket branches have been merged, delete the corresponding test branch to maintain repository cleanliness.  
  **Note**: Do not delete the ticket branch itself.

---

## Pull Request (PR) Guidelines

### PR Title
- **Format**: `[Jira-ticket-ID] : [Short Title]`
- **Example**: `LLYCSCWEB-369 : Accordion Enhancement 2`

### PR Description
- **Story URL**: Include the URL to the Jira story.
- **Short Description**: Provide a brief overview of the changes made.
- **Screenshots**: Add screenshots post-development work. Include both the development screenshots and the expected Figma design for comparison.

#### Template:
```
### Story URL
[Insert Jira Story URL here]

### Description
[Provide a brief overview of the changes made]

### Screenshots
**Development:**
[Insert development screenshots here]

**Expected Figma Design:**
[Insert Figma design screenshots here]
```

---

## Additional Considerations
- Ensure all branch names are in **lowercase**.