const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const profilePictureAuthenticate = require("../middleware/profilePictureAuthentication");
const SECRET_KEY = "user";
const nodemailer = require('nodemailer');


const Registration = async (req, res) => {
    console.log(req.body);
    try {
        await profilePictureAuthenticate(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }

            if (!req.file) {
                return res.status(400).json({ error: "Error: No File Selected!" });
            }

            const { u_name, u_email, u_password, contact_no } = req.body;
            const profilePicture = req.file.filename;

            if (!u_name || !u_email || !u_password || !profilePicture || !contact_no) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const existingUser = await User.findOne({ where: { u_email } });

            if (existingUser) {
                return res.status(400).json({ error: "Email already exists" });
            }

            const hashedPassword = await bcrypt.hash(u_password, 10);

            const newUser = await User.create({
                u_name,
                u_email,
                u_password: hashedPassword,
                contact_no,
                profile_pic: profilePicture,
                user_type: "user",
            });

            res.status(200).json({ message: "User created successfully" });
        });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: `Internal Server Error : ${error}` });
    }
};


const LogIn = async (req, res) => {
    const { u_email, u_password } = req.body;

    console.log("Email:", u_email);
    try {
        if (!u_email || !u_password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingUser = await User.findOne({ where: { u_email } });

        if (!existingUser) {
            return res.status(400).json({ error: "Email not found" });
        }

        const passwordMatch = await bcrypt.compare(u_password, existingUser.u_password);

        if (!passwordMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        if (passwordMatch) {
            const token = jwt.sign(
                {
                    u_id: existingUser.u_id,
                    u_email: existingUser.u_email,
                    profilePicture: existingUser.profile_pic,
                    user_type: existingUser.user_type,
                },
                SECRET_KEY
            );
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: true,
                maxAge: 3600000,
            });
            return res.status(200).json({
                message: "Login successful",
                token: token,
                user_type: existingUser.user_type
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const fetchAllUsers = async (req, res) => {
    try {
        console.log("Fetch");
        // const createdBy = req.user.user_id;
        // const userType = req.user.user_type;
        // console.log(req.user.user_type)
        // let userData;

        // if (userType === 'admin') {
        userData = await User.findAll();
        // } else {
        // return res.status(401).json({error : "Unauthorized Access !"})            
        // }

        if (!userData.length) {
            return res.status(404).json({
                message: "No User Found"
            });
        }

        res.status(200).json(userData);
    } catch (err) {
        console.error("Unable to Fetch :", err);
    }
}


const fetchUserByEmail = async (req, res) => {
    try {
        console.log("Fetch");
        const { u_email } = req.body;
            // const createdBy = req.user.user_id;
            // const userType = req.user.user_type;
            // console.log(req.user.user_type)
            // let userData;

            // if (userType === 'admin') {
            userData = await User.findOne({ where: { u_email } });
            console.log("User Data : ",userData)
        // } else {
        // return res.status(401).json({error : "Unauthorized Access !"})            
        // }

        if (userData.length < 0) {
            return res.status(404).json({
                message: "No User Found"
            });
        }

        res.status(200).json(userData);
    } catch (err) {
        console.error("Unable to Fetch :", err);
    }
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'vedangipatel.netclues@gmail.com',
        pass: 'uuww gzka lnnp vazh',
    },
});

const sendForgotPasswordEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { u_email: email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const mailOptions = {
            from: 'vedangipatel.netclues@gmail.com',
            to: email,
            subject: 'Password Recovery',
            html: `
        <p>Hello ${user.u_name},</p>
        <p>Your password is: ${user.u_password}</p>
        <p>Best regards,</p>
        <p>Your App Team</p>    
      `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = {
    Registration,
    LogIn,
    sendForgotPasswordEmail,
    fetchAllUsers,
    fetchUserByEmail
};
