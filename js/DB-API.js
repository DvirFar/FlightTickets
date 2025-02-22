class User {
    //static idCount = 0;

    constructor(username, password, email) {
        //this._id = User.idCount++;
        //console.log(this._id);
        this._username = username;
        this._password = password;
        this._email = email;
        this.gameScore = JSON.stringify({});
    }

    //get id() { return this._id; }
    get username() { return this._username; }
    get password() { return this._password; }
    get email() { return this._email; }

    toJSON() {
        return {
            username: this._username,
            password: this._password,
            email: this._email,
            gameScore: this.gameScore
        }
    }
}

const init = function initializeUsers() {
    if (!JSON.parse(localStorage.getItem('usernameList'))) {
        localStorage.setItem('usernameList', JSON.stringify([]));
    }
}()

function createUser(username, password, email) {
    const user = new User(username, password, email);
    // console.log(localStorage.getItem(`user_${user.id}`));
    if (localStorage.getItem(username)) return 0;
    localStorage.setItem(username, JSON.stringify(user));

    const usernameList = JSON.parse(localStorage.getItem('usernameList'));
    usernameList.push(JSON.stringify(`${username}`));
    localStorage.setItem('usernameList', JSON.stringify(usernameList));
}

function getAllUsers() {
    const usernameList = JSON.parse(localStorage.getItem('usernameList'));
    const users = [];
    let userDB;

    usernameList.forEach(user => {
        userDB = JSON.parse(localStorage.getItem(JSON.parse(user)));
        users.push(userDB);
    });

    return users;
}

function getUser(username) {
    const usernameList = JSON.parse(localStorage.getItem('usernameList'));
    console.log(usernameList);
    for (let user of usernameList) {
        user = JSON.parse(user);
        if (user === username) {
            return JSON.parse(localStorage.getItem(user));
        }
    }

    return 0;
}

function updateUser(username, info) {
    const usernameList = JSON.parse(localStorage.getItem('usernameList'));

    usernameList.forEach(user => {
        user = JSON.parse(user);
        if (user === username) {
            localStorage.setItem(user, JSON.stringify(info));
            return;
        }
    });
}

function deleteUser(username) {
    const usernameList = JSON.parse(localStorage.getItem('usernameList'));

    usernameList.forEach(user => {
        user = JSON.parse(user);
        if (user === username) {
            localStorage.removeItem(user);
            usernameList.filter(name => name !== username);
            localStorage.setItem('usernameList', JSON.stringify(usernameList));
            return;
        }
    });
}