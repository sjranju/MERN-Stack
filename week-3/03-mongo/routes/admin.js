const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const zod = require('zod')
const { Admin, Course } = require("../db");
const router = Router();

const CourseSchema = zod.object({
    title: zod.string(),
    description: zod.string(),
    imageLink: zod.string(),
    price: zod.number()
})

// Admin Routes
router.post('/signup', (req, res) => {
    // Implement admin signup logic
    const username = req.body.username
    const password = req.body.password
    Admin.create({ username, password })
        .then((value) => {
            res.status(200).json({
                'msg': 'Admin created successfully'
            })
        })
        .catch((err) => {
            res.status(404).json({
                'msg': 'User not created'
            })
        })
});

router.post('/courses', adminMiddleware, async (req, res) => {
    const parsedCourse = CourseSchema.safeParse({
        title: req.body.title,
        description: req.body.description,
        imageLink: req.body.imageLink,
        price: req.body.price
    })

    if (parsedCourse.success) {
        const newCourse = await Course.create({
            title: parsedCourse.data.title,
            description: parsedCourse.data.description,
            imageLink: parsedCourse.data.imageLink,
            price: parsedCourse.data.price
        })
        res.status(200).json({
            'message': 'Course created successfully',
            'courseId': newCourse._id
        })
    } else {
        res.status(404).json({
            'msg': 'Please check if body fields are in proper format'
        })
    }

});

router.get('/courses', adminMiddleware, (req, res) => {
    Course.find({})
        .then((value) => {
            res.json({
                'courses': value
            })
        })
});

module.exports = router;