const express = require('express');
const path = require('path');
const pool = require('./database');
const app = express();
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const session = require('express-session');
const { createHash, randomBytes } = require('crypto');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('dotenv').config()
const PORT=process.env.PORT
const { randomInt } = require('crypto');
const crypto = require('crypto')


app.get('/',async (req,res)=>{
    const query=`
    SELECT * FROM termos
    `
    const result=await pool.query(query)
    res.render("index",{termos:result.rows})
})

app.listen(PORT,()=>{
    console.log(`rodando em: http://localhost:${PORT}`)
})