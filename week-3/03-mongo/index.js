const express = require('express');
const app = express();
const adminRouter = require("./routes/admin")
const userRouter = require("./routes/user");
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://singanoodiranjana:Ranjana%402210!@cluster0.8kcqahz.mongodb.net/course_selling_app')

// const User = mongoose.model('users',
//     {
//         username: String,
//         password: String,
//         name: String
//     })

// const user1 = new User({
//     name: 'Ranjana Singanoodi',
//     email: 'sjranju@gmail.com',
//     password: '1234',
// })

// user1.save()

// Middleware for parsing request bodies
app.use(express.json());
app.use("/admin", adminRouter)
app.use("/user", userRouter)

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
