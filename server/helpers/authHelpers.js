// Import Bcrypt package for hashing passwords
import bcrypt from 'bcrypt';

// function to hash password
const hashPassword = function (password) {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(12, (error, salt) => {
			if (error) {
				reject(error);
			}
			bcrypt.hash(password, salt, (error, hash) => {
				if (error) {
					reject(error);
				}
				resolve(hash);
			});
		});
	});
};

// function to compare passwords
const comparePassword = function (candidatePassword, hashedPassword) {
	return bcrypt.compare(candidatePassword, hashedPassword);
};

export { hashPassword, comparePassword };
