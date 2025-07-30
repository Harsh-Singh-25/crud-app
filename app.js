const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.render("index");
});

app.get('/read', async (req, res) => {
  try {
    const users = await userModel.find();
    res.render('read', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error while reading users");
  }
});

app.get('/delete/:id', async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.redirect('/read');
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during delete");
  }
});

app.get('/edit/:userid', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userid);
    if (!user) return res.status(404).send("User not found");
    res.render('edit', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during edit get");
  }
});

app.post('/update/:userid', async (req, res) => {
  try {
    const { imageUrl, name, email } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.params.userid,
      { imageUrl, name, email },
      { new: true }
    );
    if (!user) return res.status(404).send("User not found");
    res.redirect('/read');  // redirect to user list after update
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during update");
  }
});

app.post("/create", async (req, res) => {
  try {
    const { name, email, imageUrl } = req.body; 
    const createdUser = await userModel.create({ name, email, imageUrl });
    res.redirect('/read');
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during create");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
