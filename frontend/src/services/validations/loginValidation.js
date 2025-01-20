import validator from 'validator';

function loginValidation(data,t) {
  const errors = {};

  if (validator.isEmpty(data.email.trim()))
    errors.email = t('emailRequired');
  else if (!validator.isEmail(data.email)) errors.email = t('emailInvalid');

  if (validator.isEmpty(data.password.trim())) errors.password = t('passwordRequired');
  else if (data.password.length < 3) errors.password = t('passwordLength');

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default loginValidation;
