const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const zod = require('zod');
const { User, Course } = require("../db");

const UserSchema = zod.object({
    username: zod.string(),
    password: zod.string()
})

const CourseSchema = zod.string()

// User Routes
router.post('/signup', (req, res) => {
    const parsedUser = UserSchema.safeParse({
        username: req.body.username,
        password: req.body.password
    })
    if (parsedUser.success) {
        User.create({
            username: parsedUser.data.username,
            password: parsedUser.data.password
        })
            .then((value) => {
                res.status(200).json({ 'msg': 'User created successfully' })
            })
            .catch((error) => {
                res.status(404).send(error)
            })

    } else {
        res.status(404).json({
            'error': parsedUser.error
        })
    }

});

router.get('/courses', (req, res) => {
    Course.find({})
        .then((courses) => {
            res.status(200).json({
                courses: courses
            })
        })
        .catch(error => {
            res.status(404).send(error)
        })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const courseId = CourseSchema.safeParse(req.params.courseId)
    const username = req.headers.username
    await User.updateOne({
        username: username,
    }, {
        "$push": {
            purchasedCourses: courseId.data
        }
    }
    )
    res.json('Course purchased successfully')
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const currentUser = await User.findOne({ username: req.headers.username })
    const courses = await Course.find({
        _id: {
            "$in": currentUser.purchasedCourses
        }
    })
    res.status(200).json({
        courses
    })
});

module.exports = router