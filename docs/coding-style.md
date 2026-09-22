# Coding style and design

Use the existing manifest, lockfile, formatter and lint/type configuration as the executable style guide. Read neighboring code before introducing a convention. Follow Conventional Commits in CONTRIBUTING.md.

Keep each business invariant with one owner. Use domain/application/infrastructure/interfaces boundaries only where responsibilities require them. Prefer a small working vertical slice over empty layers or a framework of abstractions.

Apply SOLID pragmatically: cohesive responsibilities, narrow contracts, interchangeable implementations with the same semantics, and dependencies pointing toward business rules. Prefer composition over inheritance. Avoid global mutable state, service locators, god objects and generic utility buckets. Introduce a pattern only to solve a concrete problem and explain why.

Use TypeScript with the existing strict configuration, ESLint and Next.js App Router conventions. Use PascalCase React components/types and camelCase functions/variables. Prefer functional components, hooks and composition; do not wrap React in class hierarchies to demonstrate OOP. Use cohesive objects/classes only for behavior or adapters that benefit from encapsulation.

Keep rendering and hooks in interfaces, pure state transitions in application/domain, client translation in infrastructure and wiring in routes/composition. Backend rules remain backend-owned. Use narrow typed ports and generated clients from pinned contracts. Keep server-only configuration out of browser imports.

Handle loading, empty, error and partial states, cancellation and stale responses. Provide accessible names, keyboard interaction and focus management. Test observable interactions and important browser journeys; run the checks in README.md.

Follow the implementation discipline in AGENTS.md: task-linked changes, small verified slices, evidence-led debugging and a clear stopping condition. Design patterns are tools, not acceptance criteria.

## Docstrings and comments

Follow the mandatory [naming and documentation requirements](../AGENTS.md#naming-and-documentation-requirements). Apply the following documentation rules to new and changed handwritten code, including scripts and tests. Keep comments accurate when behavior changes; do not add empty sections or boilerplate that merely repeats names. Existing formatter, type-checker and line-length settings remain authoritative for code formatting.

For Python, follow the [Google Python comments and docstrings guide](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings). Use triple double quotes, a concise summary, and a blank line before further detail. Document modules, public classes and public functions/methods; explain non-obvious internal behavior. Include `Args:`, `Returns:` or `Yields:`, `Raises:` and class `Attributes:` sections when applicable. Describe observable behavior, meaningful constraints, side effects and expected errors without duplicating type annotations. Small, self-explanatory private helpers do not need redundant docstrings.

For TypeScript/JavaScript, follow the [Google TypeScript comments and documentation guide](https://google.github.io/styleguide/tsguide.html#comments-documentation). Use `/** ... */` JSDoc for exported APIs and non-obvious functions, components and types; use `//` for implementation comments. Begin with a concise summary and document meaningful parameter/return semantics with `@param` and `@returns` when needed. Explain side effects, constraints and expected errors. Do not repeat TypeScript types in JSDoc or use Python docstring sections in TypeScript. Simple self-explanatory internal code does not need redundant documentation.

Comments must follow Google's clarity and grammar conventions: explain why, invariants or a surprising tradeoff; use clear sentences and avoid restating the code. Keep implementation details out of API documentation unless they affect callers. TODOs must describe concrete work and a traceable issue or owner, without roadmap labels. Review docstrings and comments for correctness, language-appropriate format and naming compliance before marking work complete.
