	
const { check } = require('express-validator');
 
exports.Validation = [
    check('Age', 'your age is below min').isLength({ min:18}),
    check('Email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('Mobile_Number', 'Mobile Number must be 10').isLength({ min: 10 }) 
]





