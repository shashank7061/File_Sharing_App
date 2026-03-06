# Contributing to Secure File Share System

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, etc.)

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature already exists
- Explain the use case
- Describe the proposed solution

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/file-share.git
   cd file-share
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments where necessary
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Describe what you changed and why
   - Reference any related issues

## 📝 Code Style Guidelines

### JavaScript/React
- Use ES6+ features
- Use functional components with hooks
- Use meaningful variable names
- Keep functions small and focused
- Add JSDoc comments for complex functions

### CSS
- Use meaningful class names
- Keep styles organized and modular
- Use CSS variables for colors and common values
- Ensure responsive design

### Backend
- Follow RESTful API conventions
- Handle errors properly
- Add input validation
- Use async/await for promises
- Add comments for complex logic

## 🧪 Testing

Before submitting a PR:
- Test file upload functionality
- Test email sending
- Test file download
- Test expiry functionality
- Test error handling
- Test on different screen sizes

## 📦 Project Structure

```
File_share/
├── backend/          # Express.js API
├── frontend/         # React application
├── README.md         # Main documentation
└── SETUP_GUIDE.md   # Quick setup instructions
```

## 🎯 Areas for Contribution

Here are some areas where contributions are welcome:

### Features
- [ ] Multiple file upload
- [ ] Password-protected downloads
- [ ] File preview before download
- [ ] Upload progress indicator
- [ ] Download analytics dashboard
- [ ] User authentication system
- [ ] File compression
- [ ] QR code generation for links

### Improvements
- [ ] Better error messages
- [ ] Improved UI/UX
- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] Better mobile experience
- [ ] Accessibility improvements
- [ ] Performance optimization

### Infrastructure
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] CI/CD pipeline
- [ ] Docker setup
- [ ] Kubernetes configuration
- [ ] Better logging system

## 🔒 Security

If you discover a security vulnerability:
- **DO NOT** create a public issue
- Email security concerns privately
- Allow time for the issue to be patched

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

Feel free to open an issue for any questions about contributing!

---

**Thank you for making this project better! 🙌**
