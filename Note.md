// const express = require("express");
// const app = express();
// app.use(express.json())
// app.use((req, res, next)=>{
//     console.log("You reached the custom middleware function!");
//     req.example = "exampleValue";
//     next();
// });
// // GET, POST - POST, PUT, PATCH, DELETE
// // multer package

// app.post("/signup", (req, res)=>{
//     // console.log(req.body);
//     const {name, email, phone, password} = req.body;
//     console.log("Name:",name);

//     res.json({message: "We received your data!"});
// });

// app.post("/login", (req, res)=>{
//     console.log("The value of the exmple property in the req object: ", req.example)
//     const {email, password} = req.body;
//     console.log(email, password);

//     res.json({message: "Logged in!"});
// })

// app.listen(8080, console.log("8080"));






app.post("/addtask_m", async (req, res) => {

    const filecontent = await fs.readFile("./users.json", "utf-8")
    const usercontent = JSON.parse(filecontent)
    const { email, password, Task } = req.body;
    const userExists = usercontent.find(el => el.email == email && el.password == password);

    if (!userExists) {
        res.json({ message: "Invalid Password or Email!" })
    } else {

        if (!userExists.Tasks) {
            userExists.Tasks = [Task]
            const stringusercontent = JSON.stringify(usercontent, null, 2)
            await fs.writeFile("./users.json", stringusercontent)
            res.json({ message: "Array setup complete!" })
        }
        else {
            const TaskExist = userExists.Tasks.find(el => el == Task)
            if (TaskExist) {
            return res.json({ message: "Task Already Exists!" })
            } else {
                userExists.Tasks.push(Task)
                const stringusercontent = JSON.stringify(usercontent, null, 2)
                await fs.writeFile("./users.json", stringusercontent)
                res.json({
                    message: "Task Added!"
                })
            }
        }
    }
})

app.post("/removetask_m", async (req, res) => {

    const filecontent = await fs.readFile("./users.json", "utf-8")
    const usercontent = JSON.parse(filecontent)
    const { email, password, Delete_Task } = req.body;
    const userExists = usercontent.find(el => el.email == email && el.password == password)
    const Task_Details = userExists.Tasks

    if (!userExists) {
        res.json({ message: "Invalid Details!"})
    } else {
        
        userExists.Tasks = userExists.Tasks.filter(item => item != Delete_Task);
        const stringusercontent = JSON.stringify(usercontent, null, 2)
        await fs.writeFile("./users.json", stringusercontent)
        res.json({
            message: "Task removed!"
        })
    }
})
