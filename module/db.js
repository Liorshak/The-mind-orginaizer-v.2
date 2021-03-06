const knex = require("knex");
const env = require("dotenv");

env.config({ path: "./.env" });

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NANE,
  },
});

const registerUser = (fName, lName, email, userN, pass) => {
  return db("users_info")
    .insert({
      first_name: fName,
      last_name: lName,
      email: email,
      username: userN,
      password: pass,
    })
    .returning(["user_id"]);
};

const addUserToLogin = (id, userN, pass) => {
  return db("login")
    .insert({ login_id: id, username: userN, password: pass })
    .returning(["login_id"]);
};

const checkRegistered = (userN) => {
  return db("login").select("login_id").where({ username: userN });
};

const updateLoginDate = (id, date) => {
  return db("users_info")
    .update({ last_login: date })
    .where({ user_id: id })
    .returning(["last_login"]);
};

const retriveHashPass = async (userN) => {
  return db("login").select("password").where({ username: userN });
};

const insertNewSubject = async (subjectN, userID) => {
  console.log("information ", subjectN, userID);

  let subObj = await db("subjects")
    .where({ owner_id: userID })
    .andWhere({ subject_name: subjectN })
    .catch((error) => console.log("error in the if", error));

  console.log(subObj);

  if (subObj.length > 0) {
    console.log("look here", subObj);
    return { subject_id: subObj[0].subject_id };
  } else {
    return db("subjects")
      .insert({
        subject_name: subjectN,
        owner_id: userID,
      })
      .returning(["subject_id"]);
  }
};

const savingTasks = async (arr, subjectID) => {
  for (let task of arr) {
    let taskID = task.id || task.task_client_id;
    console.log(task, " i am the task id of each task");
    let taskObj = await db("tasks")
      .select("task_id")
      .where({ subject_id: subjectID })
      .andWhere({ task_client_id: taskID })
      .catch((error) =>
        console.log(error, "error in retrieve task id i am in saving task")
      );

    console.log(" what is my number", taskObj);

    if (taskObj.length == 0) {
      // if exsist update

      // date_start:task.start_date,
      // date_end:task.end_date,
      // description:task.description,

      db("tasks")
        .insert({
          subject_id: subjectID,
          head: task.text,
          finished: task.done,
          status: task.type,
          priority: task.priority,
          positionx: Math.round(task.positionx),
          positiony: Math.round(task.positiony),
          task_client_id: task.id,
        })
        .catch((error) => console.log(error, " err in new task saving"));
    } else {
      let taskHead = task.text || task.head;
      let taskFinished = task.done || task.finished;
      let taskStatus = task.type || task.status;
      db("tasks")
        .where({ subject_id: subjectID })
        .andWhere({ task_client_id: taskID })
        .update({
          head: taskHead,
          finished: taskFinished,
          status: taskStatus,
          priority: task.priority,
          positionx: Math.round(task.positionx),
          positiony: Math.round(task.positiony),
          task_client_id: taskID,

          // date_start:task.start_date,
          // date_end:task.end_date,
          // description:task.description,
        })
        .catch((error) =>
          console.log(error, "error in existing task updating")
        );
    }
  }
};
// if not exsist create

const savingConnection = async (arr, subjectID) => {
  ///saving connections
  for (let task of arr) {
    let taskId = await db("tasks")
      .select("task_id")
      .where({ subject_id: subjectID })
      .andWhere({ task_client_id: task.id })
      .catch((error) => console.log(error, "error"));

    for (let connect of task.followBy) {
      console.log(connect, "task id for how is before him");
      console.log(subjectID, "this is the sunject id 140");
      console.log("this is the task id before crash", taskId);

      let connectedTaskId = await db("tasks")
        .where({ subject_id: subjectID })
        .andWhere({ task_client_id: connect })
        .returning(["task_id"])
        .catch((error) =>
          console.log(
            error,
            "error in retreving connection task id i am in saving connection"
          )
        );
      console.log(
        "let do one last time",
        taskId[0].task_id,
        connectedTaskId[0].task_id
      );

      let connection_id = await db("tasks_connection")
        .select("con_id")
        .where({ task_id: taskId[0].task_id })
        .andWhere({ followed_by: connectedTaskId[0].task_id })
        .catch((e) => console.log(e, "error in finiding existing connection"));

      console.log("this is the connection task id before crash", connection_id);
      if (connection_id.length === 0) {
        db("tasks_connection").insert({
          task_id: taskId[0].task_id,
          followed_by: connectedTaskId[0].task_id,
        });
      } else {
        console.log(connection_id, " is already inside");
      }
    }
  }
};

const getAllSubject = (user_id) => {
  return db("subjects")
    .where({ owner_id: user_id })
    .catch((err) => console.log(err));
};

const getAllTasks = (subject_id) => {
  return db("tasks")
    .where({ subject_id: subject_id })
    .catch((err) => console.log(err));
};

module.exports = {
  checkRegistered,
  updateLoginDate,
  registerUser,
  addUserToLogin,
  retriveHashPass,
  insertNewSubject,
  savingTasks,
  savingConnection,
  getAllSubject,
  getAllTasks,
};
