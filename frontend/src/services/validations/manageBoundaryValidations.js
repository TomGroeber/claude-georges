import validator from 'validator';

function ManageBoundaryValidation(data, t) {
  const errors = {};
  if (validator.isEmpty(String(data.turnerLimit))) errors.turnerLimit = t('turnerLimitRequired');
  if (validator.isEmpty(String(data.millerLimit))) errors.millerLimit = t('millerLimitRequired');
  if (validator.isEmpty(String(data.welderLimit))) errors.welderLimit = t('welderLimitRequired');

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default ManageBoundaryValidation;