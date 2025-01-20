import validator from 'validator';

function UserAddEditValidation(data, t) {
  const errors = {};
  if (validator.isEmpty(data?.firstName.trim())) errors.firstName = t('firstNameRequired');
  if (validator.isEmpty(data?.lastName.trim())) errors.lastName = t('lastNameRequired');
 
  if (validator.isEmpty(data.email.trim()))
      errors.email = t('emailRequired');
    else if (!validator.isEmail(data.email)) errors.email = t('emailInvalid');
  
  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default UserAddEditValidation;