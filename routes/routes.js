const { request } = require("express");
const jsonfile = require("jsonfile");

const file = "./users.json";

const objectFromFile = jsonfile.readFileSync(file);

const userTemplateObj = {
  userId: "",
  login: "",
  password: "",
  nickname: "",
  firstName: "",
  lastName: "",
  imageURL: "",
  status: "",
  skills: [],
  aboutMe: "",
  contacts: [],
};

const users = {
  0: {
    userId: "",
    login: "",
    password: "",
    nickname: "",
    firstName: "",
    lastName: "",
    imageURL: "",
    status: "",
    skills: [],
    aboutMe: "",
    contacts: [],
  },
};

function repeatabilityLoginCheck(query) {
  const result = Object.keys(objectFromFile).find((el) => {
    if (objectFromFile[el].login === query) return true;
  });
  if (result === undefined) {
    return false;
  } else {
    return true;
  }
}
function signInValidation(login, password) {
  const objectFromFile = jsonfile.readFileSync(file);
  const result = Object.keys(objectFromFile).find((el) => {
    if (
      objectFromFile[el].login === login &&
      objectFromFile[el].password === password
    )
      return true;
  });
  if (result === undefined) {
    return false;
  } else {
    return true;
  }
}

// Router
const router = (app) => {
  app.post("/login", (request, response) => {
    if (signInValidation(request.body.login, request.body.password) === true) {
      response.status(200).send(true);
    } else {
      response.send(false);
    }
  });

  app.post("/register/validate", (request, response) => {
    const register = request.body;
    if (repeatabilityLoginCheck(request.body.login) === false) {
      objectFromFile[Object.keys(objectFromFile).length] = {
        ...userTemplateObj,
        ...register,
      };
      jsonfile.writeFileSync(file, objectFromFile, { spaces: 2 });
      response.status(201).send(true);
    } else {
      response.send(false);
    }
  });
};

// Export the router
module.exports = router;
