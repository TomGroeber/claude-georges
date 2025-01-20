import validator from 'validator';

function AddLeaveScreenValidation(data) {
  const errors = {};

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddLeaveScreenValidation;