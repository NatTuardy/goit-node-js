exports.validate = function validate(schema, reqPart = 'body') {
  return (req, res, next) => {
    const validationResult = schema.validate(req[reqPart]);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error);
    }
    next();
  };
};
