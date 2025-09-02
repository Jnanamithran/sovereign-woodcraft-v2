# 🔐 Security Policy for Sovereign Woodcraft

The security of our application and the trust of our users is a top priority. We appreciate the efforts of security researchers and the community in helping us maintain a secure platform.

---

## 🛡️ Supported Versions

Security updates are only applied to the most recent version of the application available on the **main branch**. We encourage all users to run the latest version.

| Version | Supported |
|---------|-----------|
| Latest  | ✅        |
| < 1.0   | ❌        |

---

## ✍️ Reporting a Vulnerability

If you discover a security vulnerability, **please do not open a public GitHub issue**.

Instead, **report it privately** by sending an email to:  
📧 **security@sovereignwoodcraft.example.com**

Include the following details:
- ✅ A clear description of the vulnerability.
- ✅ Steps to reproduce (e.g., code snippets, screenshots, or a proof-of-concept).
- ✅ The potential impact of the vulnerability.

We will:
- **Acknowledge your report within 48 hours**.
- **Keep you updated on the resolution progress**.

---

## 🔒 Security Practices

We follow strict measures to ensure the security of Sovereign Woodcraft:

- **Data Validation:**  
  All user input is sanitized and validated on the server-side to prevent XSS and SQL Injection.

- **Authentication:**  
  Secure **JWT-based authentication** for protected routes and resources.

- **Dependency Management:**  
  We use **GitHub Dependabot** to scan and patch vulnerabilities in dependencies.

- **Environment Variables:**  
  Sensitive data (API keys, DB credentials, JWT secrets) is stored in a `.env` file, excluded from version control via `.gitignore`.

---

✅ Thank you for helping keep **Sovereign Woodcraft** secure!
