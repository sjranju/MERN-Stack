const { Router } = require("express");
const zod = require('zod')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../config");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

console.log('secret', JWT_SECRET)

const courseSchema = zod.object({
    title: zod.string(),
    description: zod.string(),
    imageLink: zod.string(),
    price: zod.number()
})

// Admin Routes
router.post('/signup', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    Admin.create({ username, password })
        .then(() => {
            res.status(200).json({
                'msg': 'User created'
            })
        })
        .catch(error => {
            res.status(404).send(error)
        })
});

router.post('/signin', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const isValidated = await Admin.find({ username, password })
    console.log('JWT_SECRET', JWT_SECRET)

    if (isValidated) {
        const token = jwt.sign({ username }, JWT_SECRET)
        res.status(200).json({
            token
        })
    } else {
        res.status(411).json('Incorrect email or password')
    }
});

router.post('/courses', adminMiddleware, (req, res) => {
    const parsedCourseData = courseSchema.safeParse({
        title: req.body.title,
        description: req.body.description,
        imageLink: req.body.imageLink,
        price: req.body.price
    })

    if (parsedCourseData.success) {
        Course.create({
            title: parsedCourseData.data.title,
            description: parsedCourseData.data.description,
            imageLink: parsedCourseData.data.imageLink,
            price: parsedCourseData.data.price
        })
            .then(() => {
                res.status(200).json({
                    'msg': 'Course added successfully'
                })
            })
            .catch(error => {
                res.status(404).send(error)
            })
    } else {
        res.send(parsedCourseData.error)
    }
});

router.get('/courses', adminMiddleware, (req, res) => {
    Course.find({})
        .then((courses) => {
            res.status(200).json(courses)
        })
        .catch(error => {
            res.status(404).send(error)
        })
});

module.exports = router;