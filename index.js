const express = require("express");
const fs = require("fs");
const app = express();
const user = require("./MOCK_DATA.json");
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));

app.get("/api/users", (req, res) => {
  res.json(user);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const userid = Number(req.params.id);
    const userData = user.find((user) => user.id === userid);
    return res.json(userData);
    console.log(userData);
  })
  .patch((req, res) => {
    const userId = Number(req.params.id);
    const updateData = req.body;

    const userIndex = user.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    user[userIndex] = { ...user[userIndex], ...updateData };

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(user, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update user" });
      }
      res.json({ status: "User updated", data: user[userIndex] });
    });
    console.log(updateData);
  })
  .delete((req, res) => {
    const userId = Number(req.params.id);
    const userIndex = user.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    user.splice(userIndex, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(user, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete user" });
      }
      res.json({ status: "User deleted", userId });
    });
  });

app.post("/api/users", (req, res) => {
  const body = req.body;
  console.log(body);
  user.push({ ...body, id: user.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(user), (error, data) => {
    return res.json({ status: "User created" });
  });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
