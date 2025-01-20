import validator from 'validator';

function ChangePassValidations(data,t) {
  const errors = {};
  if (validator.isEmpty(data.password.trim())) errors.password = t('passwordRequired');
  else if (data.password.length <= 3) errors.password = t('passwordLength');
  if (validator.isEmpty(data.newPassword.trim())) errors.newPassword = t('newPasswordRequired');
  else if (data.newPassword.length <= 3)
    errors.newPassword = t('newPasswordLength');
  if (validator.isEmpty(data.confirmPassword.trim()))
    errors.confirmPassword =t('confirmPasswordRequired');
  else if (data.confirmPassword.length <= 3)
    errors.confirmPassword = t('confirmPasswordLength');
  if (data.newPassword.trim() !== data.confirmPassword.trim())
    errors.confirmPassword = t('passwordMismatch');
  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default ChangePassValidations;
