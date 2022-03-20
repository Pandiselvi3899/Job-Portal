let router = require("express").Router();
let User = require("../models/User");
let Applications = require("../models/Application");
let Education = require("../models/Education");
let Skills = require("../models/Skills");
const keys = require("../config/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Validator = require("validator");
const isEmpty = require("is-empty");
const auth = require("../config/auth");
const Listings = require("../models/Listings");

function isRegValid(data) {
  var errors = "";
  data.Name = !isEmpty(data.Name) ? data.Name : "";
  data.Email = !isEmpty(data.Email) ? data.Email : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password_r = !isEmpty(data.password_r) ? data.password_r : "";
  if (Validator.isEmpty(data.Name)) {
    if (!errors) {
      errors = "Name is required\n";
    } else errors = errors + "Name is required\n";
  }
  if (Validator.isEmpty(data.type)) {
    if (!errors) {
      errors = "User Type is required\n";
    } else errors = errors + "User Type is required\n";
  }
  if (Validator.isEmpty(data.Email)) {
    if (!errors) {
      errors = "Email is required\n";
    } else errors = errors + "Email is required\n";
  } else if (!Validator.isEmail(data.Email)) {
    if (!errors) {
      errors = "Email is Invalid\n";
    } else errors = errors + "Email is Invalid\n";
  }
  if (Validator.isEmpty(data.password)) {
    if (!errors) {
      errors = "Password is Required\n";
    } else errors = errors + "Password is Required\n";
  }
  if (Validator.isEmpty(data.password_r)) {
    if (!errors) {
      errors = "Retype Password is required\n";
    } else errors = errors + "Retype Password is required\n";
  }
  if (!Validator.isLength(data.password, { min: 4, max: 30 })) {
    if (!errors) {
      errors = "Password must be at least 4 characters\n";
    } else errors = errors + "Password must be at least 4 characters\n";
  }
  if (!Validator.equals(data.password, data.password_r)) {
    if (!errors) {
      errors = "Passwords do not Match\n";
    } else errors = errors + "Passwords do not Match\n";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function isLoginValid(data) {
  let errors = "";
  data.Email = !isEmpty(data.Email) ? data.Email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  if (Validator.isEmpty(data.Email)) {
    if (!errors) {
      errors = "Email is required\n";
    } else errors = errors + "Email is required\n";
  } else if (!Validator.isEmail(data.Email)) {
    if (!errors) {
      errors = "Email is invalid\n";
    } else errors = errors + "Email is invalid\n";
  }
  if (Validator.isEmpty(data.password)) {
    if (!errors) {
      errors = "Password is required\n";
    } else errors = errors + "Password is required\n";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}

router.get("/", function (req, res) {
  res.json({
    status: "User",
    message: "Welcome to the Job Portal User API",
  });
});

// @route POST api/user/register
// @desc Register's a user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = isRegValid(req.body);
  if (!isValid) {
    return res.status(400).send(errors);
  }
  User.findOne({ Email: req.body.Email }).then((user) => {
    if (user) {
      return res.status(400).send("Email already exists!");
    } else {
      const newUser = new User({
        Name: req.body.Name,
        Email: req.body.Email,
        password: req.body.password,
        type: req.body.type,
        Contact: req.body.Contact,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/user/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = isLoginValid(req.body);
  if (!isValid) {
    return res.status(400).send(errors);
  }
  const Email = req.body.Email;
  const password = req.body.password;
  User.findOne({ Email }).then((user) => {
    if (!user) {
      return res.status(404).send("Email not found");
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user._id,
          name: user.username,
        };
        jwt.sign(
          payload,
          keys.secret,
          {
            expiresIn: 3600,
          },
          (err, token) => {
            return res.json({
              token: token,
              id: user._id,
              name: user.Name,
              email: user.Email,
              type: user.type,
              Contact: user.Contact,
            });
          }
        );
      } else {
        return res.status(400).send("Password incorrect!");
      }
    });
  });
});

// @route GET api/user/auth
// @desc Return's Token Holder
// @access Private
router.get("/auth", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  User.findOne({ _id: id }).then((user) => {
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(401).send("Not Authorised");
    }
  });
});

// @route GET api/user/edu
// @desc Return's Token Holder's Education List
// @access Private
router.get("/edu", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) {
    return res.status(401).send("Not Authorised");
  }
  Education.find({ uid: id }).then((edus) => {
    if (edus) {
      return res.status(200).json(edus);
    }
    return res.status(400).send("No education!");
  });
});

// @route POST api/edu/update
// @desc  update education
// @access Private
router.post("/edu/update", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("No token!");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("No user!");
  return User.findOne({ _id: id }).then((user) => {
    if (user) {
      if (!isEmpty(req.body.edu)) {
        if (!isEmpty(req.body.edu.id)) {
          return Education.findOne({ _id: req.body.edu.id }).then((edu) => {
            if (edu) {
              if (!isEmpty(req.body.edu.institute)) {
                edu.institute = req.body.edu.institute;
              }
              if (!isEmpty(req.body.edu.start_year)) {
                edu.start_year = req.body.edu.start_year;
              }
              if (!isEmpty(req.body.edu.end_year)) {
                edu.end_year = req.body.edu.end_year;
              }
              edu.save();
              return res.status(200).json(edu);
            } else {
              return res.status(400).send("no edu");
            }
          });
        } else {
          edu2 = {};
          edu3 = {};

          if (
            isEmpty(req.body.edu.institute) ||
            isEmpty(req.body.edu.start_year) ||
            isEmpty(req.body.edu.uid)
          ) {
            return res.status(400).send("Error!");
          }

          if (!isEmpty(req.body.edu.end_year)) {
            edu2.end_year = req.body.edu.end_year;
          }
          edu2.institute = req.body.edu.institute;
          edu2.uid = req.body.edu.uid;
          edu2.start_year = req.body.edu.start_year;
          edu3 = new Education(edu2);
          edu3.save();
          return res.status(200).json(edu3);
        }
      }
    } else {
      return res.status(400).send("Error!");
    }
  });
});

// @route POST api/user/profile
// @desc  update profile
// @access Private
router.post("/profile", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not Authorised");
  return User.findOne({ _id: id }).then((user) => {
    if (user) {
      if (!isEmpty(req.body.skill)) {
        user.skills.push(req.body.skill);
      }
      if (!isEmpty(req.body.Bio)) {
        user.Bio = req.body.Bio;
      }
      user.save();
      return res.status(200).json(user);
    } else {
      return res.status(400).send("error!");
    }
  });
});

// @route POST api/user/edu/delete
// @desc  delete edu
// @access Private
router.post("/edu/delete/", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not Authorised");
  Education.deleteOne({ _id: req.body.id, uid: id })
    .then(() => {
      return res.status(200).json(edu);
    })
    .catch((err) => {
      res.status(400).send("Error in delete");
    });
});

// @route POST api/user/skills/delete
// @desc  delete skill
// @access Private
router.post("/skills/delete/", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not Authorised");
  Skills.deleteOne({ _id: req.body.id, uid: id }).then((ski) => {
    if (ski) {
      return res.status(200).json(ski);
    } else return res.status(400).send("Error in delete");
  });
});
// @route POST api/user/skills/add
// @desc  add skill
// @access Private
router.post("/skills/add/", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not Authorised");
  console.log(req.body);
  skill = new Skills(req.body);
  return skill.save((err, list) => {
    if (err) {
      return res.status(400).send("Skill Add Error!");
    } else return res.status(200).json(list);
  });
});
// @route POST api/user/skills/
// @desc  show skills
// @access Private
router.get("/skills", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) {
    return res.status(401).send("Not Authorised");
  }
  Skills.find({ uid: id }).then((ski) => {
    if (ski) {
      return res.status(200).json(ski);
    }
    return res.status(400).send("Error in Skills!");
  });
});
// @route POST api/user/contact
// @desc  Update Contact
// @access Private
router.post("/contact", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not Authorised");
  return User.update(
    { _id: id },
    {
      $set: req.body,
    },
    function (err, app) {
      if (err) {
        console.log(err);
        return res.status(400).send("Error!");
      }
    }
  );
});
// @route POST api/user/name
// @desc  Update Name
// @access Private
router.post("/name", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not Authorised");
  return User.update(
    { _id: id },
    {
      $set: req.body,
    },
    function (err, app) {
      if (err) {
        console.log(err);
        return res.status(400).send("Error!");
      } else {
        Applications.updateMany(
          { rid: id },
          {
            $set: { name_r: req.body.Name },
          },
          function (err, app) {
            if (err) {
              console.log(err);
              return res.status(400).send("Error!");
            } else {
            }
          }
        );
        Listings.updateMany(
          { rid: id },
          {
            $set: { name_r: req.body.Name },
          },
          function (err, app) {
            if (err) {
              console.log(err);
              return res.status(400).send("Error!");
            } else {
              return res.status(200).send("Success!");
            }
          }
        );
      }
    }
  );
});
// @route POST api/user/email
// @desc  Update email
// @access Private

router.post("/email", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not Authorised");

  User.findOne({ Email: req.body.Email }).then((user) => {
    if (user) {
      return res.status(400).send("Email already exists!");
    } else {
      User.update(
        { _id: id },
        {
          $set: req.body,
        },
        function (err, app) {
          if (err) {
            console.log(err);
            return res.status(400).send("Error!");
          } else {
            Listings.updateMany(
              { rid: id },
              {
                $set: { email: req.body.Email },
              },
              function (err, app) {
                if (err) {
                  console.log(err);
                  return res.status(400).send("Error!");
                } else {
                  return res.status(200).send("Success!");
                }
              }
            );
          }
        }
      );
    }
  });
});

// @route POST api/user/password
// @desc  Update password
// @access Private
router.post("/password", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not Authorised");
  User.findOne({ _id: id }).then((user) => {
    if (!user) {
      return res.status(404).send("User not found");
    }
    bcrypt.compare(req.body.oldpassword, user.password).then((isMatch) => {
      if (isMatch) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            User.update(
              { _id: id },
              {
                $set: { password: hash },
              },
              function (err, app) {
                if (err) {
                  return res.status(400).send("Error!");
                }
                return res.status(200).send("Success!");
              }
            );
          });
        });
      } else {
        return res.status(400).send("Old Password incorrect!");
      }
    });
  });
});

module.exports = router;
