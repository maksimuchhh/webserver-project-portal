const { request, response } = require("express");
const jsonfile = require("jsonfile");
const { v4: uuidv4 } = require("uuid");
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

function checkUserId(query) {
  const result = Object.keys(objectFromFile).find((el) => {
    if (objectFromFile[el].userId === query) return true;
  });
  if (result === undefined) {
    return false;
  } else {
    return result;
  }
}
function findUserIdByLogin(query) {
  const result = Object.keys(objectFromFile).find((el) => {
    if (objectFromFile[el].login === query) return true;
  });
  console.log(result);
  if (result === undefined) {
    return false;
  } else {
    return objectFromFile[result];
  }
}
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
  app.get("/users", (request, response) => {
    console.log("ME!");
    response.status(200).send(objectFromFile);
  });

  // /user?userId=... В ответ
  app.get("/user", (request, response) => {
    response
      .status(200)
      .send(objectFromFile[checkUserId(request.query.userId)]);
  });
  app.post("/", (request, response) => {
    console.log(request.body.userId);

    const logged = checkUserId(request.body.userId);
    if (logged) {
      response.status(200).send(objectFromFile[logged]);
    } else {
      response.status(401).send("false");
    }
  });
  app.post("/login", (request, response) => {
    if (signInValidation(request.body.login, request.body.password) === true) {
      response.status(200).send(findUserIdByLogin(request.body.login));
    } else {
      response.status(200).send("false");
    }
  });

  app.post("/register/validate", (request, response) => {
    const register = request.body;
    if (repeatabilityLoginCheck(request.body.login) === false) {
      objectFromFile[Object.keys(objectFromFile).length] = {
        ...userTemplateObj,
        ...register,
        userId: uuidv4(),
      };
      jsonfile.writeFileSync(file, objectFromFile, { spaces: 2 });
      response.status(201).send(findUserIdByLogin(request.body.login));
    } else {
      response.send(false);
    }
  });
};

// Export the router
module.exports = router;
