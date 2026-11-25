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

app.get('/',(req,res)=>{
    res.render("login")
})
app.get('/register',(req,res)=>{
    res.render("registro")
})



app.get('/inicio',async (req,res)=>{
    try {
    const limite = 10; //quantidade de itens por pag
    const paginaSolicitada = Math.max(1, parseInt(req.query.pagina) || 1);
    const countResult = await pool.query('SELECT COUNT(*) FROM termos');
    const totalRegistros = parseInt(countResult.rows[0].count, 10);
    const totalPaginas = Math.ceil(totalRegistros / limite);//tem q arredondar pra cima so funcionou assim
    const paginaAtual = Math.min(paginaSolicitada, Math.max(1, totalPaginas));
    const offset = (paginaAtual - 1) * limite;
    const query = `
      SELECT * FROM termos
      ORDER BY id DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limite, offset]);
    res.render('index', {
      termos: result.rows,
      paginaAtual,
      totalPaginas
    });
  } catch (err) {
    console.error('Erro ao buscar termos:', err);
    res.status(500).send('Erro interno no servidor');
  }
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
            window.location.href='/inicio'
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
                window.location.href='/inicio'
            </script>
            `)  
    }else{
            res.send(`
            <script>
                alert("Erro ao editar")
                window.location.href='/inicio'
            </script>
            `)  
    }
})
app.post("/delete/:id",async(req,res)=>{
    const id = req.params.id
    const query=`
    DELETE FROM termos
    WHERE id = $1
    `
    const result=await pool.query(query,[id])
    if(result.rowCount>0){
        res.send(`
            <script>
            alert("Excluído!")
            window.location.href='/inicio'
            </script>
            `)
    }
})


app.listen(PORT,()=>{
    console.log(`rodando em: http://localhost:${PORT}`)
})