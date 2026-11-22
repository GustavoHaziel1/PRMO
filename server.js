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

app.post("/add", async(req,res)=>{
    const {emoji,significado}=req.body
    const query=`
    INSERT INTO termos(tipo,significado)
    VALUES($1,$2)
    `
    const result=await pool.query(query,[emoji,significado])
    if(result.rowCount>0){
        res.send(`
            <script>
            alert("Termo adicionado ao dicionário")
            window.location.href='/'
            </script>
            `)
    }
})
app.get('/edit/:id',async(req,res)=>{
    const id = req.params.id
    const query=`
    SELECT * FROM termos
    WHERE 
    id = $1
    `
    const result=await pool.query(query,[id])
    res.render("edit",{termo:result.rows[0]})
})
app.post('/edit/:id',async(req,res)=>{
    const id = req.params.id
    const{termo,significado} = req.body
    const query=`
    UPDATE termos
    SET tipo = $1, significado = $2
    WHERE id = $3

    `
    const result=await pool.query(query, [termo, significado, id]);
    if(result.rowCount>0){
        res.send(`
            <script>
                alert("Editado com sucesso!")
                window.location.href='/'
            </script>
            `)  
    }else{
            res.send(`
            <script>
                alert("Erro ao editar")
                window.location.href='/'
            </script>
            `)  
    }
})



app.listen(PORT,()=>{
    console.log(`rodando em: http://localhost:${PORT}`)
})