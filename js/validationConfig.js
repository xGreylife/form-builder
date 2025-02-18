// todo : add other validation rules

const ValidationRules = {
    required: {
        validate: value => value !== undefined && value !== '',
        message: 'This field is required',
    },
    minLength: (min) => ({
        validate: value => value.length >= min,
        message: `Must be at least ${min} characters`,
    }),
    custom: (validateFn, message) => ({
        validate: validateFn,
        message: message,
    }),
};