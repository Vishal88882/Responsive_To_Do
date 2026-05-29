const express = require("express");
const fs = require("fs/promises")
const app = express();
const nodemailer = require("nodemailer");
app.use(express.json())
app.use((req, res, next) => {
    console.log("it's custom middleware")
    req.example = "exampleValue";
    next();
});
const cors = require('cors');
app.use(cors());

app.post("/signup", async (req, res) => {

    try {
        const filecontent = await fs.readFile("./users.json", "utf-8")
        const usercontent = JSON.parse(filecontent)
        const { name, username, email, password, phone } = req.body;
        if (!name || !username || !email || !password || !phone)
            return res.status(404).json({ message: "Data Missing" })
        else {
            // check to see if any user with the given email address already exists in the usercontent arrray
            const userExists = usercontent.some(el => el.username === username || el.email === email);
            if (userExists) throw new Error("User already exists!");
            usercontent.push(req.body)
            const stringusercontent = JSON.stringify(usercontent, null, 2)
            await fs.writeFile("./users.json", stringusercontent)
            res.status(200).json({
                message: "User Signed Up"
            })
        }
    } catch (error) {
        console.log("Error : ", error.message);
        res.status(401).json({ message: error.message });
    }
})

app.post("/login", async (req, res) => {

    try {
        const filecontent = await fs.readFile("./users.json", "utf-8")

        const usercontent = JSON.parse(filecontent)
        const { username, password } = req.body;
        const userExists = usercontent.some(el => el.username == username && el.password == password);
        if (!userExists) throw new Error("Signed up first!");
        else {
            res.status(200).json({
                message: "User Loged In"
            })
        }
    } catch (error) {
        console.log("Error : ", error.message);
        res.status(401).json({ message: error.message });
    }
})

app.post("/forget_password", async (req, res) => {

    try {

        const filecontent = await fs.readFile("./users.json", "utf-8")
        const usercontent = JSON.parse(filecontent)
        const { email } = req.body;
        const otp = Math.floor(1000 + Math.random() * 9000)


        const userExists = usercontent.find(el => el.email == email);

        if (!userExists) throw new Error("Your're not our user");
        else {

            userExists.otp = otp

            const stringusercontent = JSON.stringify(usercontent, null, 2)
            await fs.writeFile("./users.json", stringusercontent)
            console.log("Otp Sent!")
        }

        const Mail_Template = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Received</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: Arial, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }

    .header {
      background: #4CAF50;
      color: #ffffff;
      text-align: center;
      padding: 20px;
      font-size: 20px;
    }

    .content {
      padding: 20px;
      color: #333333;
      font-size: 16px;
      line-height: 1.6;
    }

    .footer {
      background: #f4f4f4;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="header">
      We’ve Received Your Request
    </div>

    <div class="content">
      <p>Hi, <strong>${userExists.username}</strong>,</p>

      <p>Thank you for contacting us.</p>

      <p>
        Hello ${userExists.username}, We Recieved a request to reset your password.
        Ths is your 4-digit OTP ${otp} don't share with anyone!
      </p>

      <p>
        If you have any additional information, feel free to reply to this email.
      </p>

    </div>

    <div class="footer">
      © All rights reserved.
    </div>

  </div>

</body>
</html>
`

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "codewithvishal001@gmail.com",
                pass: "gxgo vita sphh glwl"
            }
        });
        transport.sendMail(
            {
                to: email,
                from: "codewithvishal001@gmail.com",
                subject: "Reset Your Password",
                html: Mail_Template,
                text: "Don't share this OTP with anyone!"
            }
        )
            .then(() => {
                console.log("Mail sent")
            })
            .catch((error) => {
                console.log("Error: ", error.message)
            })

        const Phone = userExists.phone

        try {
            const SMS = await fetch("https://2factor.in/API/V1/7fa29106-533c-11f1-9800-0200cd936042/SMS/+91" + Phone + "/" + otp + "/VISH2026");
            const response = await SMS.json()
            res.json({ message: "OTP sent!" })
        } catch (error) {

            res.status(200).json({ message: "Error Occured!" })
        }

    } catch (error) {
        res.status(401).json({ message: "error" })
    }
})

app.post("/reset_password", async (req, res) => {

    try {
        const filecontent = await fs.readFile("./users.json", "utf-8")
        const usercontent = JSON.parse(filecontent)
        const { email, newpassword, otp } = req.body

        if (!email || !newpassword || !otp) {
            throw new Error("Email, OTP, and new password are required")
        }

        const request_exist = usercontent.find(el => el.email == email && el.otp == otp)
        if (!request_exist) {
            res.status(401).json({ message: "Make Request First!" })
        }

        request_exist.password = newpassword
        request_exist.otp = undefined

        const stringusercontent = JSON.stringify(usercontent, null, 2)
        await fs.writeFile("./users.json", stringusercontent)
        res.status(200).json({ message: "Password Reset!" })
    } catch (error) {
        console.log("Error : ", error.message)
        res.status(401).json({ message: error.message })
    }
})

app.post("/addtask", async (req, res) => {

    const filecontent = await fs.readFile("./users.json", "utf-8")
    const usercontent = JSON.parse(filecontent)
    const { email, password, Task } = req.body;
    const userExists = usercontent.find(el => el.email == email && el.password == password);

    const Remove_Space = Task.replace(/\s/g, '')
    const Char = Remove_Space.slice(0, 4)
    const Num = Math.floor(1000 + Math.random() * 9000)
    const ID = Char + Num


    if (!userExists) {
        res.json({ message: "Invalid Password or Email!" })
    } else {

        if (!userExists.Tasks) {
            userExists.Tasks = [{ ID, Task: Remove_Space }]
            const stringusercontent = JSON.stringify(usercontent, null, 2)
            await fs.writeFile("./users.json", stringusercontent)
            res.status(200).json({message: "Task Added!"})
        }
        else {
            const TaskExist = userExists.Tasks.find(el => el.Task == Task && el.ID == ID)
            if (TaskExist) {
                return res.status(401).json({ message: "Task Already Exists!" })
            } else {
                userExists.Tasks.push({ ID, Task: Remove_Space })
                const stringusercontent = JSON.stringify(usercontent, null, 2)
                await fs.writeFile("./users.json", stringusercontent)
                res.status(200).json({
                    message: "Task Added!"
                })
            }
        }
    }
})

app.post("/taskinfo", async (req, res) => {

    const filecontent = await fs.readFile("./users.json", "utf-8")
    const usercontent = JSON.parse(filecontent)
    const { email, password } = req.body;
    const userExists = usercontent.find(el => el.email == email && el.password == password)
    const Task_Details = userExists.Tasks

    if (!userExists) {
        res.json({ message: "Invalid Details!" })
    } else {
        res.json(Task_Details)
    }
})

app.post("/removetask", async (req, res) => {

    const filecontent = await fs.readFile("./users.json", "utf-8")
    const usercontent = JSON.parse(filecontent)
    const { email, password, Task_ID } = req.body;
    const userExists = usercontent.find(el => el.email == email && el.password == password)

    if (!userExists) {
        res.json({ message: "Invalid Details!" })
    } else {
        const Find_ID = userExists.Tasks.find(el => el.ID == Task_ID)

        if (!Find_ID) {
            res.json({ message: "Task Didn't found!" })
        } else {
            userExists.Tasks = userExists.Tasks.filter(el => el.ID !== Task_ID)

            if (userExists.Tasks.length === 0)
                delete userExists.Tasks

            const stringusercontent = JSON.stringify(usercontent, null, 2)
            await fs.writeFile("./users.json", stringusercontent)
            res.json({
                message: "Task removed!"
            })
        }

    }
})

app.listen(8000, console.log("8000"));