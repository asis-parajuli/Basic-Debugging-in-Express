const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const logger = require("./logger");
const authenticator = require("./authenticator");
const express = require("express");
const app = express();

// to check for current environment status either it is development, production , testing we use two following commented lines
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get("env")}`);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// here this middleware function parses incoming requests with urlencoded payloads

app.use(express.static("public"));
// static is used to serve the static files

app.use(helmet());

// Configuration
// we should never add password and other important keys in the configuration files
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

// morgan third party middleware
if (app.get("env") == "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled...");
}

// Db work....
dbDebugger("Connected to the database...");

app.use(logger);
app.use(authenticator);

// this app object has lots of useful methods
// methods like

// app.get()
// app.post()
// app.put()
// app.delete()

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

// this will take two arguments first one is url and second one is a call back function
// route
app.get("/", (req, res) => {
  res.send("!!Hello world!!");
});

// route
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body); // this is equivalent to result.error

  if (error)
    // 400 Bad Request
    return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  // Look up the course
  // If not existing, return 404
  // Validate
  // If invalid, return 400 - Bad request
  // Update course
  // Return the updated course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The cousrse with the given ID was not found");

  // object destructor
  const { error } = validateCourse(req.body); // this is equivalent to result.error

  if (error)
    // 400 Bad Request
    return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

//Http delete requests
app.delete("/api/courses/:id", (req, res) => {
  // Look up the course
  // Not existing, return 404
  // Delete
  // Return the same course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The cousrse with the given ID was not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  // splice (index, removing 1 course)
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The cousrse with the given ID was not found");
  res.send(course);
});

// we have environment variable PORT which is used for serving port dynamically
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));

// for security reason we should never ever trust what client sends as input so we should always validate it
