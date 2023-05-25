const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

const secret = 'test';

 const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(404).json({message: "El usuario no existe"});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password) 

        if(!isPasswordCorrect) return res.status(400).json({ message: "Contraseña incorrecta"})

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, process.env.SECRET_JWT_SEED, {expiresIn: "1h"});

        res.status(200).json({ result: existingUser, token});

    }catch(error){
        res.status(500).json({ message: "Algo salio mal"});
    }
}

 const registro = async (req, res) =>{
    const {email, password} = req.body

    try{
        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(400).json({message: "El usuario ya existe"});

        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await User.create({ email, password: hashedPassword})

        const token = jwt.sign( { email: result.email, id: result._id }, process.env.SECRET_JWT_SEED, {expiresIn: "1h"});

        res.status(201).json({ result, token});
    }catch(error){
        res.status(500).json({ message: "Algo salio mal"});
    }
}

module.exports = {login, registro}
