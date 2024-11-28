const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

/*instanciar*/ 
const app = express();
app.use(express.static(__dirname + '/views')); // nos va servir para poder cargar  archivos estáticos desde la carpeta 'views'
app.use(bodyParser.urlencoded({extended: false}));


app.set('view engine', 'ejs');

//creedenciales para DB
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zeus0401',
    database: 'proyecto',
    port: '3308'
});

//conexion a la DB
db.connect(err=>{
    if(err){
        console.log(`Error al momento de hacer conexion BB :3 ${err}`);
    }else{
        console.log(`Conexion realizada :3`);
    }
});
/*Puerto*/
const port = 3036; 
const hostName= '0.0.0.0';
//server inicio
app.listen(port,hostName,()=>{
    console.log(`El server esta en escucha desde http://${hostName}:${port}`);



});
const path = require('path');



app.get('/unam.jpg', (req, res) => {
    res.sendFile(__dirname + '/views/unam.jpg');
  });
app.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error(`Error al recuperar datos: ${err}`);
            res.send('Error al recuperar datos');
        } else {
            res.render('index', { users: results });
        }
    });
});

//Mostrar lista de usuarios
app.get('/rename',(req,res)=>{
  
    const query = 'SELECT * FROM users';
    
    db.query(query,(err,results)=>{
        if(err){
            console.error(`Error al recuperar datos -> Codigo de error:${err}`);
            res.send('Error en recuperar datos');
        }else{
            const users = results; 
            res.render('rename',{users: users}); 
        }

    });    

});


//agregar usuario
app.post('/add',(req,res)=>{
    const {name,email} = req.body;
    const query = 'INSERT INTO users (name, email)VALUE (?,?)';
    db.query(query,[name,email],(err)=>{
        if(err){
            console.error(`Error al insertar usuarios: Codigo-> ${err}`);
            res.send('Error');
        }else{
             res.redirect('/');   
        }
    });
});

//editar usuario
app.get('/edit/:id', (req, res) => {
    console.log('GET /edit/:id');
    const { id } = req.params;
    console.log(`ID recibido: ${id}`);
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
      console.log('Query ejecutada');
      if (err) {
        console.error(`Error al buscar usuario: ${err}`);
        res.send('Error al buscar usuario');
      } else {
        console.log('Resultado de la query:', results);
        if (results.length > 0) {
          res.render('edit', { user: results[0] }); 
        } else {
          res.send('Usuario no encontrado');
        }
      }
    });
  });

app.post('/edit', (req, res) => {
    const { id } = req.body;
    const { name ,email} = req.body;
    console.log(`ID: ${id}`);
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(query, [name ,email,parseInt(id)], (err, results) => {
      if (err) {
        console.error(`Error al buscar usuario: ${err}`);
        console.error(`error al actualizar datos:${err}`);
        
        res.send('Error al buscar usuario');
      } else {
        if (results.length > 0) {
          res.render('edit', { user: results[0] });
        } else {
          res.status(404).send('Usuario no encontrado');
        }
      }
    });
  });
  
//eliminar

app.post('/delete/:id',(req,res)=>{
    const {id}=req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query,[id],(err)=>{
        if(err){
            console.error('Error en el Delete');
            res.send("error al eliminar");
        }else{
            res.redirect('/');
        }
    });
});

app.get('/',(req,res)=>{
res.render("rename",{Listar_usuarios:"este es un mensaje"})
});