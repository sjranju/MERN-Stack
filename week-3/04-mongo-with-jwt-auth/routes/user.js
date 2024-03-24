const { Router } = require("express");
const router = Router();
const zod = require('zod')
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const { courseSchema } = require("./admin");

const singupSchema = zod.object({
    username: zod.string(),
    password: zod.string()
})

// User Routes
router.post('/signup', (req, res) => {
    const parsedUser = singupSchema.safeParse({
        username: req.body.username,
        password: req.body.password
    })
    if (parsedUser.success) {
        User.create({ username: parsedUser.data.username, password: parsedUser.data.password })
            .then(() => {
                res.status(200).json({
                    'msg': 'User created successfully'
                })
            })
            .catch(error => {
                res.status(404).send(error)
            })
    } else {
        res.status(404).send(parsedUser.error)
    }
});

router.post('/signin', (req, res) => {

});

router.get('/courses', (req, res) => {
    Course.find({})
        .then((courses) => {
            res.status(200).send(courses)
        })
        .catch(error => {
            res.status(404).send(error)
        })
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    const courseId = req.params.courseId
    User.updateOne({ username: req.headers.username }, {
        "$push": {
            purchasedCourses: courseId
        }
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const user = User.find({ username: req.headers.username })
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })
    res.status(200).json(courses)
});

module.exports = router