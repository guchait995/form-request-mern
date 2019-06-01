const Promise = require("promise");
const MongoClient = require("mongodb").MongoClient;
const q = require("q");
const ObjectId = require("mongodb").ObjectID;
const REQUEST_REJECTED = 0;
const REQUEST_APPROVED = 1;
const REQUEST_PENDING = 2;
const REQUEST_RAISE_FOR_APPROVAL = 3;
const CONNECTION_URL =
  "mongodb+srv://resturant:sourav@cluster0-15mlv.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "form";

var database, collection;

const io = require("socket.io")();
io.origins("*:*");

io.on("connection", socket => {
  //default username
  socket.username = "Anonymous";

  //user is connected
  //listen on change_username
  socket.on("change_username", data => {
    socket.username = data.username;
  });

  //listen on new_request
  socket.on("raised_new_request", data => {
    insertRequestToMongoDB(data).then(res => {
      io.sockets.emit("new_request", {
        request: res,
        username: socket.username
      });
    });
  });
  //listen on on_approve_request
  socket.on("on_approved_request", data => {
    updateRequestToMongoDB(data, REQUEST_APPROVED).then(res => {
      io.sockets.emit("approve_request", {
        request: data,
        username: socket.username
      });
    });
  });
  socket.on("on_rejected_request", data => {
    updateRequestToMongoDB(data, REQUEST_REJECTED).then(res => {
      io.sockets.emit("rejected_request", {
        request: data,
        username: socket.username
      });
    });
  });
  socket.on("extra_signup_data", data => {
    addUserToMongoDB(data)
      .then(res => {
        console.log("added user data");
      })
      .then(res => {
        io.sockets.emit("new_user_added", data);
      })
      .then(res => {
        socket.emit("signup_complete", true);
      })
      .catch(error => {
        console.error(error);
      });
  });
  socket.on("get_all_users", data => {
    getAllUsers(data)
      .then(users => {
        if (data) {
          socket.emit("fetch_specific_users", users);
        } else {
          socket.emit("fetch_all_users", users);
        }
      })
      .catch(err => {});
  });
  socket.on("get_current_user", () => {
    getUserFromMongoDB(socket.username).then(res => {
      if (res) {
        socket.emit("fetched_user", res);
      }
    });
  });

  socket.on("get_all_departments", () => {
    getAllDepartment().then(departments => {
      socket.emit("fetch_all_departments", departments);
    });
  });

  //listen on typing
  socket.on("typing", data => {
    console.log("typing");
    socket.broadcast.emit("typing", { username: socket.username });
  });

  socket.on("get_latest_request_list", () => {
    getLatestRequestList().then(data => {
      socket.emit("latest_request_list", data);
    });
  });
  socket.on("get_latest_approved_list", () => {
    getLatestApprovedList().then(data => {
      socket.emit("latest_approved_list", data);
    });
  });
  socket.on("get_latest_request_for_approval_list", () => {
    getLatestRequestForApprovalList(socket).then(data => {
      socket.emit("latest_request_for_approval_list", data);
    });
  });
});

io.listen(process.env.PORT || 4000);
//updates data to mongoDb
const updateRequestToMongoDB = (request, status) => {
  var promise = new Promise((resolve, reject) => {
    try {
      MongoClient.connect(
        CONNECTION_URL,
        { useNewUrlParser: true },
        (error, client) => {
          if (error) {
            console.error(error);
          } else {
            database = client.db(DATABASE_NAME);
            collection = database.collection("requests");
            collection.updateOne(
              { time: request.time },
              { $set: { status: status } },
              res => {
                if (!res) {
                  resolve(request);
                } else {
                  reject(null);
                }
              }
            );
          }
        }
      );
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
  return promise;
};

//inserts data to mongo and on resolve returns the object
const insertRequestToMongoDB = request => {
  var promise = new Promise((resolve, reject) => {
    try {
      MongoClient.connect(
        CONNECTION_URL,
        { useNewUrlParser: true },
        (error, client) => {
          if (error) {
            console.error(error);
          } else {
            database = client.db(DATABASE_NAME);
            collection = database.collection("requests");
            collection.insertOne(request, res => {
              if (!res) {
                resolve(request);
              } else {
                reject(null);
              }
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
  return promise;
};
const getLatestRequestList = () => {
  var promise = new Promise((resolve, reject) => {
    try {
      MongoClient.connect(
        CONNECTION_URL,
        { useNewUrlParser: true },
        async (error, client) => {
          if (error) {
            console.error(error);
          } else {
            database = client.db(DATABASE_NAME);
            collection = database.collection("requests");
            var myCursor = await collection.find({ status: REQUEST_PENDING });
            var requests = [];
            await myCursor.forEach(elem => {
              requests.push(elem);
            });
            // console.log(requests);
            if (collection) {
              resolve(requests);
            } else {
              reject(null);
            }
          }
        }
      );
    } catch (error) {
      reject(null);
    }
  });
  return promise;
};
const getLatestApprovedList = () => {
  var promise = new Promise((resolve, reject) => {
    try {
      MongoClient.connect(
        CONNECTION_URL,
        { useNewUrlParser: true },
        async (error, client) => {
          if (error) {
            console.error(error);
          } else {
            database = client.db(DATABASE_NAME);
            collection = database.collection("requests");
            var myCursor = await collection.find({ status: REQUEST_APPROVED });
            var requests = [];
            await myCursor.forEach(elem => {
              requests.push(elem);
            });
            if (collection) {
              resolve(requests);
            } else {
              reject(null);
            }
          }
        }
      );
    } catch (error) {
      reject(null);
    }
  });
  return promise;
};
const getLatestRequestForApprovalList = socket => {
  var promise = new Promise((resolve, reject) => {
    try {
      MongoClient.connect(
        CONNECTION_URL,
        { useNewUrlParser: true },
        async (error, client) => {
          if (error) {
            console.error(error);
          } else {
            database = client.db(DATABASE_NAME);
            collection = database.collection("requests");
            var myCursor = await collection.find({});
            var requests = [];
            await myCursor.forEach(elem => {
              if (
                elem.status &&
                elem.toEmail &&
                elem.toEmail === socket.username &&
                elem.status === REQUEST_PENDING
              )
                requests.push(elem);
            });
            // console.log(requests);
            if (collection) {
              resolve(requests);
            } else {
              reject(null);
            }
          }
        }
      );
    } catch (error) {
      reject(null);
    }
  });
  return promise;
};

const addUserToMongoDB = user => {
  var promise = new Promise((resolve, reject) => {
    try {
      MongoClient.connect(
        CONNECTION_URL,
        { useNewUrlParser: true },
        (error, client) => {
          if (error) {
            console.error(error);
          } else {
            database = client.db(DATABASE_NAME);
            collection = database.collection("users");
            collection.insertOne(user, res => {
              if (!res) {
                resolve(true);
              } else {
                reject(false);
              }
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
      reject(false);
    }
  });
  return promise;
};

const getUserFromMongoDB = email => {
  var promise = new Promise((resolve, reject) => {
    try {
      MongoClient.connect(
        CONNECTION_URL,
        { useNewUrlParser: true },
        async (error, client) => {
          if (error) {
            console.error(error);
          } else {
            database = client.db(DATABASE_NAME);
            collection = database.collection("users");
            var myCursor = await collection.find({ email: email });
            var user;
            if (myCursor)
              myCursor.forEach(user => {
                resolve(user);
              });
            else reject(null);
          }
        }
      );
    } catch (error) {
      console.error(error);
      reject(false);
    }
  });
  return promise;
};

const getAllUsers = department => {
  var promise = new Promise((resolve, reject) => {
    try {
      MongoClient.connect(
        CONNECTION_URL,
        { useNewUrlParser: true },
        async (error, client) => {
          if (error) {
            console.error(error);
          } else {
            database = client.db(DATABASE_NAME);
            collection = database.collection("users");
            if (department) {
              var myCursor = await collection
                .find({ department: department })
                .sort("department", "asc");
            } else {
              var myCursor = await collection
                .find({})
                .sort("department", "asc");
            }

            var users = [];
            await myCursor.forEach(elem => {
              users.push(elem);
            });
            if (collection) {
              resolve(users);
            } else {
              reject(null);
            }
          }
        }
      );
    } catch (error) {
      reject(null);
    }
  });
  return promise;
};
const getAllDepartment = () => {
  var promise = new Promise((resolve, reject) => {
    try {
      MongoClient.connect(
        CONNECTION_URL,
        { useNewUrlParser: true },
        async (error, client) => {
          if (error) {
            console.error(error);
          } else {
            database = client.db(DATABASE_NAME);
            collection = database.collection("departments");
            var departments = [];
            var myCursor = await collection.find({});
            await myCursor.forEach(elem => {
              departments.push(elem.name);
            });
            if (departments) {
              resolve(departments);
            } else {
              reject(null);
            }
          }
        }
      );
    } catch (error) {
      reject(null);
    }
  });
  return promise;
};
