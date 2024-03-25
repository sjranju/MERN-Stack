const { Router } = require("express");
const router = Router();
const zod = require('zod')
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

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
    const username = req.body.username
    const password = req.body.password
    User.find({ username, password })
        .then(() => {
            const token = jwt.sign({ username }, JWT_SECRET)
            res.status(200).send(token)
        })
        .catch(() => {
            res.status(403).send('Incorrect inputs')
        })
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
    User.updateOne({ username: req.username }, {
        "$push": {
            purchasedCourses: courseId
        }
    })
        .then(() => {
            res.status(200).json('Course purchased successfully')
        })
        .catch(() => {
            res.status(403).send("Incorrect inputs")
        })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const user = await User.findOne({ username: req.username })
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })
    res.status(200).json(courses)
});

module.exports = router