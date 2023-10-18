const adminCollection = require("../models/adminSchema");
const userCollection = require("../models/userSchema");

module.exports.getAdminRoute = async (req, res) => {
  if (req.session.admin) {
    users = await userCollection.find({});
    res.render("adminDashboard", { users });
  } else {
    res.render("adminLogin");
  }
};

module.exports.postAdminRoute = async (req, res) => {
  const data = await adminCollection.findOne({ email: req.body.email });
  const users = await userCollection.find({});
  if (data) {
    if (req.body.email !== data.email && req.body.password === data.password) {
      res.render("adminLogin", { subreddit: "incorrect email" });
    } else if (
      req.body.email === data.email &&
      req.body.password !== data.password
      ) {
      res.render("adminLogin", { subreddit: "incorrect password" });
      // res.redirect("/admin", { subreddit: "incorrect password" });
    } else {
      if (
        req.body.email === data.email &&
        req.body.password === data.password
      ) {
        req.session.admin = req.body.email;
        res.render("adminDashboard", { users });
      }
    }
  } else {
    // res.redirect("/");
    res.render("adminLogin", { subreddit: "incorrect email" });
  }
};

module.exports.postSearchUser = async (req, res) => {
  const name = req.body.search;
  const regex = new RegExp(`^${name}`, "i");
  const users = await userCollection.find({ email: { $regex: regex } }).exec();
  res.render("adminDashboard", { users });
};

module.exports.getUpdateUser = async (req, res) => {
  const id = req.query.id;
  const data = await userCollection.find({ _id: id });
  user = data[0];
  res.render("updateUser", { user });
};

module.exports.postUpdateUser = async (req, res) => {
  const id = req.query.id;
  const data = await userCollection.updateOne(
    { _id: id },
    {
      $set: {
        email: req.body.email,
        fname: req.body.fname,
        lname: req.body.lname,
        password: req.body.password,
      },
    }
  );
  const users = await userCollection.find({});
  res.render("adminDashboard", { users });
};

module.exports.getDeleteUser = async (req, res) => {
  const id = req.query.id;
  const data = await userCollection.deleteOne({ _id: id });
  const users = await userCollection.find({});
  res.render("adminDashboard", { users });
};

module.exports.getNewUser = (req, res) => {
  res.render("userSignup");
};

module.exports.postNewUser = async(req, res) => {
  const users = await userCollection.find({});
  res.render("adminDashboard",{users});
};

module.exports.getLogout = (req, res) => {
  req.session.admin = null;
  res.redirect("/");
};

module.exports.getAdminDashboard = async(req, res) => {
  const users = await userCollection.find({});
  if (req.session.admin) {
    res.render("adminDashboard",{users});
  }
};
