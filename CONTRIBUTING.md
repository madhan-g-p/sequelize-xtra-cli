# Contributing to sequelize-xtra-cli

Thank you for your interest in contributing to **sequelize-xtra-cli** — a powerful CLI tool for Sequelize and database management in Node.js projects.

We welcome contributions of all kinds: bug reports, feature requests, documentation improvements, tests, and code enhancements.

---

## 📌 Before You Start

- Review open [issues](https://github.com/madhan-g-p/sequelize-xtra-cli/issues) to avoid duplicates.
- Make sure you're running a compatible version of Node.js.
- If you're submitting a bug, provide a **minimal reproducible example**.

---

## 🛠️ Local Development Setup

1. **Fork** the repository and **clone** your fork:

   ```bash
   git clone https://github.com/your-username/sequelize-xtra-cli.git
   cd sequelize-xtra-cli
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run existing tests (if any):**

   ```bash
   npm test
   ```

4. **Start coding!**

---

## ✅ Contributing Guidelines

### Branching

- Always branch from `main`.
- Name your branch clearly, e.g.:
  - `fix/db-connection-timeout`
  - `feat/support-mssql`
  - `docs/update-readme`

### Pull Requests

- Target the `main` branch.
- Write a clear title and description for the PR.
- Link related issues (e.g. `Fixes #42`).
- Add or update tests if applicable.
- Make sure all linter and test checks pass before submitting.

---

## ✏️ Commit Message Format

Please follow the **Conventional Commits** standard:

```
type(scope): short description
```

**Examples:**

- `feat(cli): add support for nested subcommands`
- `fix(database): handle reconnect on timeout`
- `docs(readme): update usage examples`
- `chore: bump dependencies`

---

## 🎨 Code Style

- Use **ESLint** and **Prettier** for code formatting.
- You can format your code before committing:

   ```bash
   npm run format
   ```

- Consistency matters — keep your code clean and readable.

---

## 🧪 Testing

- Prefer writing tests for new features or bug fixes.
- Test structure (if not yet implemented) is encouraged using Jest or Mocha.
- Add tests in a `__tests__/` or `test/` directory.

---

## 🔒 Reporting Security Issues

Please report any security issues via GitHub Security Advisories or contact the maintainer privately.

---

## 📄 Licensing

By contributing, you agree that your contributions will be licensed under the same license as this project ([MIT](https://github.com/madhan-g-p/sequelize-xtra-cli/?tab=License-2-ov-file)).

---

## 🙌 Thank You!

Your contributions help improve sequelize-xtra-cli for everyone. Whether it's fixing a typo or building a new feature — you're awesome! 💙
