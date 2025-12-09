export class FormValidator {
  static email(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? null : 'Invalid email address';
  }

  static required(value) {
    return value && value.trim() ? null : 'This field is required';
  }

  static minLength(value, length) {
    return value && value.length >= length ? null : `Minimum ${length} characters`;
  }

  static maxLength(value, length) {
    return value && value.length <= length ? null : `Maximum ${length} characters`;
  }

  static phone(value) {
    const regex = /^[0-9]{10,}$/;
    return regex.test(value) ? null : 'Invalid phone number';
  }

  static url(value) {
    try {
      new URL(value);
      return null;
    } catch {
      return 'Invalid URL';
    }
  }

  static match(value, compareValue) {
    return value === compareValue ? null : 'Values do not match';
  }
}

export default FormValidator;
