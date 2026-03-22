<img width="52" height="52" alt="image" src="https://github.com/user-attachments/assets/9ad77273-ebe3-4279-be6d-ad47954e4746" />

## Smart Contract Contribution Guidelines 
The following guidelines apply to all contributions that modify or introduce smart contract logic in ChainVoice. Since smart contracts form the core logic of the system, a higher standard of review and validation is required compared to frontend or general application changes.

**1. Introduction:**
Smart contract development in ChainVoice requires stricter standards than frontend or general application changes. Contract modifications involve compilation, logic validation, security review, and careful testing. Unlike UI updates, their impact is not immediately visible and often requires deployment and interaction to verify behavior. All contributors must adhere to the following guidelines to maintain code quality and security.

**2. Test Requirements:**
Any pull request that modifies or introduces smart contract logic must include comprehensive automated tests. Tests must validate expected behavior, cover relevant edge cases, and properly test revert and failure scenarios. If existing logic is modified, corresponding tests must also be updated. Pull requests without sufficient test coverage will not be reviewed, as tests serve as the primary validation mechanism for contract correctness.

**3. Design and Architecture Approval:**
For any major feature, architectural change, or significant contract modification, a detailed issue must be opened before implementation begins. The issue must clearly describe the proposed design, data structures, access control model, and expected behavior. Implementation may begin only after the approach has been discussed and approved to prevent architectural inconsistencies and unnecessary rework.

**4. Pull Request Scope:**
Pull requests must remain focused and limited in scope. Each pull request should address a single feature, improvement, or bug fix. Large, multi-feature updates or broad refactors must be divided into smaller, logically structured changes before review to ensure clarity and effective feedback.

**5. Continuous Integration and Automated Review Requirements:**
All automated checks must pass before requesting review. This includes successful compilation, linting, and execution of all tests. If continuous integration fails, contributors are required to resolve the issues before requesting further review. ```In addition, all comments and suggestions raised by CodeRabbit must be carefully reviewed and addressed before requesting a mentor review.``` Pull requests with unresolved automated review comments will not be considered for manual review. Review time should focus on logic, architecture, and security considerations rather than basic correctness issues.

**6. Review Standards:**
During review, emphasis will be placed on architectural soundness, correctness of state management, access control implementation, event emission consistency, potential security risks such as reentrancy or improper validation, and overall contract design quality. Where relevant, gas efficiency and upgrade safety will also be considered.

Please ensure that all future contract-related contributions follow this process. If there are any questions or clarifications needed, feel free to raise them before proceeding with implementation.

Thank you for your cooperation and continued contributions.
