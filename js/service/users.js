function User(name,pass,email,first,last) {
	this.username = name;
	this.password = pass;
	this.email = email;
	this.first = first;
	this.last = last;
	this.session = undefined;
}

var users = {};
var logins = {};

function signup(name,password,email,first,last) {
	if (users[name] !== undefined) {
		return {success: false, reason: "User already exists"};
	}
	users[name] = new User(name,password,email,first,last);
	return {success: true};
}

function isLoggedIn(sessid) {
	if (logins[sessid] === undefined) {
		return false;
	} else {
		return true;
	}
};

function login(name,pass) {
	if (users[name] === undefined) {
		return {success: false, reason: "Unrecognised username"};
	}

	if (users[name].password != pass) {
		return {success: false, reason: "Incorrect password"};
	}

	if (users[name].session !== undefined) {
		logins[users[name].session] = undefined;
	}

	users[name].session = "randomstring";
	logins[users[name].session] = users[name];
	return {success: true, sessid: users[name].session};
};

exports.login = login;
exports.signup = signup;
