<img width="52" height="52" alt="image" src="https://github.com/user-attachments/assets/9ad77273-ebe3-4279-be6d-ad47954e4746" />

## General Contribution & Review Process
The following guidelines apply to all contributions across the entire project (both smart contracts and frontend).

**1. Pull Request Scope:**
Pull requests must remain focused and limited in scope. Each pull request should address a single feature, improvement, or bug fix. Large, multi-feature updates or broad refactors must be divided into smaller, logically structured changes before review to ensure clarity and effective feedback.

**2. Build, Test & CI Requirements:**
Before opening a pull request, you must ensure that your local build is successful (`npm run build`), all relevant tests pass, and there are no new console errors or warnings in the browser. All automated CI checks must pass before requesting review.

**3. Automated Code Review (CodeRabbit):**
All comments and suggestions raised by CodeRabbit must be carefully reviewed and addressed before requesting a mentor review. Pull requests with failing checks, console errors, or unresolved automated review comments will not be considered for manual review.

**4. Requesting a Review:**
Once your PR is ready and all CI checks pass, drop the PR link (along with the live preview URL, if applicable) in the [⁠Stability Nexus>#⁠Chainvoice](https://discord.com/channels/995968619034984528/1328282666335993856) Discord channel. Remember to include relevant demo screenshots or screen recordings showcasing your changes.

---

## Smart Contract Contribution Guidelines 
Since smart contracts form the core logic of the system, a higher standard of review and validation is required compared to frontend or general application changes.

**1. Test Requirements:**
Any pull request that modifies or introduces smart contract logic must include comprehensive automated tests. Tests must validate expected behavior, cover relevant edge cases, and properly test revert and failure scenarios. If existing logic is modified, corresponding tests must also be updated. Pull requests without sufficient test coverage will not be reviewed, as tests serve as the primary validation mechanism for contract correctness.

**2. Design and Architecture Approval:**
For any major feature, architectural change, or significant contract modification, a detailed issue must be opened before implementation begins. The issue must clearly describe the proposed design, data structures, access control model, and expected behavior. Implementation may begin only after the approach has been discussed and approved to prevent architectural inconsistencies and unnecessary rework.

**3. Review Standards:**
During review, emphasis will be placed on architectural soundness, correctness of state management, access control implementation, event emission consistency, potential security risks such as reentrancy or improper validation, and overall contract design quality. Where relevant, gas efficiency and upgrade safety will also be considered.

---

## Frontend Contribution Guidelines
The following guidelines apply to all contributions that modify or introduce frontend changes in ChainVoice.

**1. Static Asset Paths:**
All static file references (images, icons, fonts, etc.) must use `import.meta.env.BASE_URL` instead of hardcoded absolute paths. This ensures assets resolve correctly in both the production site and automated PR preview deployments.
```jsx
// ✅ Correct
<img src={`${import.meta.env.BASE_URL}logo.png`} />

// ❌ Incorrect
<img src="/logo.png" />
```

**2. PR Preview Deployments:**
When a pull request modifies files inside `frontend/`, a live preview is automatically deployed to GitHub Pages. A bot comment with the preview URL will be posted on your PR. The preview is cleaned up automatically when the PR is closed or merged.

Thank you for your cooperation and continued contributions.