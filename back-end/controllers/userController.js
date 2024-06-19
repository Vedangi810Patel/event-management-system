const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const profilePictureAuthenticate = require("../middleware/profilePictureAuthentication");
const SECRET_KEY = "user";
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

const registration = async (req, res) => {
    console.log(req.body);
    try {
        await profilePictureAuthenticate(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }

            if (!req.file) {
                return res.status(400).json({ error: "Error: No File Selected!" });
            }

            const { user_name, user_email, user_password, contact_no } = req.body;
            const profilePicture = req.file.filename;

            if (!user_name || !user_email || !user_password || !profilePicture || !contact_no) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const existingUser = await User.findOne({ where: { user_email } });

            if (existingUser) {
                return res.status(400).json({ error: "Email already exists" });
            }

            const hashedPassword = await bcrypt.hash(user_password, 10);

            await User.create({
                user_name,
                user_email,
                user_password: hashedPassword,
                contact_no,
                profile_pic: profilePicture,
                user_type: "user",
            });

            res.status(200).json({ message: "User created successfully" });


            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'vedangipatel.netclues@gmail.com',
                    pass: 'uuww gzka lnnp vazh',
                },
            });


            const mailOptions = {
                from: user_email,
                to: 'vadangipatel.netclues@gmail.com',
                subject: 'Account Creation`',
                html: `
                    <p>Hello Admin, </p>
                    <p>New Account Creation Request Found as below </p> 
                    <p>User email : ${user_email}</p>
                    <p>User Name : ${user_name}</p>
                    <p> http://localhost:3000/admin/all-users </p>
                    <p>Best regards,</p>
                    <p>Your App Team</p>    
                `,
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: 'Email sent successfully' });

        });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: `Internal Server Error : ${error}` });
    }
};


const logIn = async (req, res) => {
    const { user_email, user_password } = req.body;

    console.log("Email:", user_email);
    try {
        if (!user_email || !user_password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingUser = await User.findOne({ where: { user_email , isactive:1 } });

        if (!existingUser) {
            return res.status(400).json({ error: "Email not found" });
        }

        const passwordMatch = await bcrypt.compare(user_password, existingUser.user_password);

        if (!passwordMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        if (passwordMatch) {
            const token = jwt.sign(
                {
                    user_id: existingUser.user_id,
                    user_email: existingUser.user_email,
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
        if (req.user.user_type !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        const users = await User.findAll({ where: { user_type: { [Op.ne]: 'admin' } } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
};

const updateUser = async (req, res) => {
    try {
        if (req.user.user_type !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        const { user_id, user_name, user_email, contact_no, user_type, isactive } = req.body;
        const profile_pic = req.file ? req.file.filename : null;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.user_name = user_name;
        user.user_email = user_email;
        user.contact_no = contact_no;
        user.user_type = user_type;
        user.isactive = isactive;
        user.account_status = isactive == 1 ? 'accepted' : 'pending';

        if (profile_pic) {
            user.profile_pic = profile_pic;
        }

        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (req.user.user_type !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        const { user_id } = req.body;
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: `Internal server error : ${error}` });
    }
};

const sendForgotPasswordEmail = async (req, res) => {
    const { email } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vedangipatel.netclues@gmail.com',
            pass: 'uuww gzka lnnp vazh',
        },
    });

    try {
        const user = await User.findOne({ where: { user_email: email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const mailOptions = {
            from: 'vedangipatel.netclues@gmail.com',
            to: email,
            subject: 'Password Recovery',
            html: `
        <p>Hello ${user.user_name},</p>
        <p>Your password is: ${user.user_password}</p>
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
    registration,
    logIn,
    sendForgotPasswordEmail,
    fetchAllUsers,
    updateUser,
    deleteUser
};