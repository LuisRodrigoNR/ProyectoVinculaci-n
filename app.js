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
    database: 'profesores',
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
const port = 3038; 
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
    const query = 'SELECT * FROM trabajadores';
    db.query(query, (err, results) => {
        if (err) {
            console.error(`Error al recuperar datos: ${err}`);
            res.send('Error al recuperar datos');
        } else {
            res.render('index', { trabajadores: results });
        }
    });
});

//Mostrar lista de usuarios
app.get('/rename',(req,res)=>{
  
    const query = 'SELECT * FROM trabajadores';
    
    db.query(query,(err,results)=>{
        if(err){
            console.error(`Error al recuperar datos -> Codigo de error:${err}`);
            res.send('Error en recuperar datos');
        }else{
            const trabajadores = results; 
            res.render('rename',{trabajadores: trabajadores}); 
        }

    });    

});


//agregar usuario
app.post('/add',(req,res)=>{
    const {name,email} = req.body;
    const query = 'INSERT INTO trabajadores (name, email)VALUE (?,?)';
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
app.get('/edit/:NumeroTrabajador', (req, res) => {
    console.log('GET /edit/:NumeroTrabajador');
    const { NumeroTrabajador } = req.params;
    console.log(`numero de trabajador recibido: ${NumeroTrabajador}`);
    const query = 'SELECT * FROM trabajadores WHERE NumeroTrabajador = ?';
    db.query(query, [NumeroTrabajador], (err, results) => {
      console.log('Query ejecutada');
      if (err) {
        console.error(`Error al buscar usuario: ${err}`);
        res.send('Error al buscar usuario');
      } else {
        console.log('Resultado de la query:', results);
        if (results.length > 0) {
          res.render('edit', { trabajadores: results[0] }); 
        } else {
          res.send('Usuario no encontrado');
        }
      }
    });
  });

  app.post('/edit', (req, res) => {
    // 1. Recuperar todos los datos del formulario
    const { NumeroTrabajador, NombreCompleto, CorreoElectronicoInstitucional, Curp, TelefonoCelular, Direccion, Categoria, GradoAcademico, AntiguedadUNAM, AntiguedadCarrera, Genero, Telefonocasa } = req.body;

    console.log(`Actualizando trabajador con NumeroTrabajador: ${NumeroTrabajador}`);

    // 2. Ejecutar la consulta UPDATE
    const query = `
        UPDATE trabajadores SET
            NombreCompleto = ?,
            CorreoElectronicoInstitucional = ?,
            Curp = ?,
            TelefonoCelular = ?,
            Direccion = ?,
            Categoria = ?,
            GradoAcademico = ?,
            AntiguedadUNAM = ?,
            AntiguedadCarrera = ?,
            Genero = ?,
            Telefonocasa = ?
        WHERE NumeroTrabajador = ?
    `;

    db.query(query, [NombreCompleto, CorreoElectronicoInstitucional, Curp, TelefonoCelular, Direccion, Categoria, GradoAcademico, AntiguedadUNAM, AntiguedadCarrera, Genero, Telefonocasa, NumeroTrabajador], (err, results) => {
        if (err) {
            console.error(`Error al actualizar datos: ${err}`);
            return res.status(500).send('Error al actualizar el usuario');
        }

        // 3. Consulta para obtener los datos actualizados
        const selectQuery = 'SELECT * FROM trabajadores WHERE NumeroTrabajador = ?';
        db.query(selectQuery, [NumeroTrabajador], (selectErr, selectResults) => {
            if (selectErr) {
                console.error(`Error al buscar el usuario actualizado: ${selectErr}`);
                return res.status(500).send('Error al buscar el usuario actualizado');
            }

            // 4. Renderizar la vista con los datos actualizados
            if (selectResults.length > 0) {
                res.render('edit', { trabajadores: selectResults[0] }); // Renderiza la vista con los datos actualizados
            } else {
                res.status(404).send('Usuario no encontrado después de la actualización');
            }
        });
    });
});
  
//eliminar

app.post('/delete/:id',(req,res)=>{
    const {id}=req.params;
    const query = 'DELETE FROM trabajadores WHERE id = ?';
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