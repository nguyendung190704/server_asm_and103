const express = require('express');
const router = express.Router();


// khai bao model 
const StudentModel = require('../models/students');

router.get('/', (req,res) => {
    res.send('vào api mobile');
})

// get danh sach student và tìm theo mã sv 
router.get('/students', async (req, res) => {

    const { masv } = req.query;
    if (!masv) {
        const students = await StudentModel.find();
        console.log(students);
        res.send(students);
    } else {
        try {
            const student = await StudentModel.findOne({ masv: masv });
            if (!student) {
                return res.status(404).send("Không tìm thấy sinh viên");
            }
            console.log(student);
            res.send(student);
        } catch (error) {
            console.error(error);
            res.status(500).send("Lỗi server");
        }
    }
})

router.get('/search-students', async (req, res) => {
    try {
        const key = req.query.key;
        const data = await StudentModel.find({ masv: { "$regex": key, "$options": "i" } })
            .sort({ createdAt: -1 });

        if (data && data.length > 0) {
            res.json(data); // Return the array directly
        } else {
            res.status(404).json([]); // Return an empty array
        }
    } catch (error) {
        console.log(error);
        res.status(500).json([]); // Return an empty array
    }
});



// add student 
router.post('/students/add', async (req,res) => {
    try{
        const data = req.body;
        const student = new StudentModel({
            masv : data.masv,
            name : data.name,
            point : data.point,
            avatar : data.avatar
        });

        const result = await student.save();

        if(result){
            res.json({
                "status" : "200",
                "messenger" : "Add student success",
                "data" : result
            })
        }else{
            res.json({
                "status" : "400",
                "messenger" : "Add student fail",
                "data" : []
            })
        }
    }catch(err){
        console.log(err)
    }
});


// delete student
router.delete('/students/delete/:id', async (req,res) => {
    const {id} = req.params;
    const result = await StudentModel.deleteOne({_id : id});
    if(result){
        res.json({
            "status" : "200",
            "messenger" : "Delete student success",
            "data" : result
        })
    }else{
        res.json({
            "status" : "400",
            "messenger" : "Delete fail",
            "data" : []
        })
    }
});

// update student
router.put('/students/update/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        // Sử dụng findByIdAndUpdate để tìm và cập nhật dữ liệu
        const result = await StudentModel.findByIdAndUpdate(id, data, { new: true });
        
        if (result) {
            res.json({
                status: 200,
                message: "Update student success",
                data: result
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "Student not found",
                data: []
            });
        }
    } catch (error) {
        // Xử lý lỗi nếu có
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
})

router.get('/students/sort-by-point', async (req, res) => {
    try {
        const students = await StudentModel.find().sort({ point: 1 });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.get('/students/sort-by-point-descending', async (req, res) => {
    try {
        const students = await StudentModel.find().sort({ point: -1 });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});


module.exports = router;