import express from 'express'



import cors from 'cors'

import jsonwebtoken from 'jsonwebtoken';

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))


// base de prueba en memoria

const users = [
  {email:'mirtha@gmail.com',password:'1234','rol':'modista',id: 1, nombre :"Mirtha"},
  {email:'alumnooro@test.com',password:'1234','rol':'alumno',plan:'oro',id: 2,clasesInscriptas:[1,2]},
  {email:'alumnoba@test.com',password:'1234','rol':'alumno',id: 3,plan:'basico'},
  {email:'alumnopla@test.com',password:'1234','rol':'alumno',id: 4,plan:'platino'},
  {email:'claufitness@test.com',password:'1234','rol':'admin', id: 5, nombre :"Claudio Alfredo"},
  { email: 'profe@test.com', password: '1234', rol: 'profe', id: 6, nombre: 'Juan', apellido: 'Veron', dni: '12345678' },
  { email: 'profe2@test.com', password: '1234', rol: 'profe', id: 7, nombre: 'Leo', apellido: 'Ponzio', dni: '87654321' }
]

const clases = [
  {nombre:'Salsa',nombreProfe:'Claudio', horario: 1600, capacidad: 20, anotados:0, duracion:30, id:1},
  {nombre:'Bachata',nombreProfe:'Pepito', horario: 1700,capacidad: 20, anotados:0, duracion:60, id:2},
  {nombre:'Tango',nombreProfe:'Juan', horario: 1500,capacidad: 5, anotados:0, duracion:45, id:3}
]

const rutinas = [ {nombre:"Torso-Pierna" , nombreAlumno:"Pepe" , nivel:"Basico", id:1}]


const usuariosInscriptos = []

const adminMiddleware =(req,res,next)=>{
  const user = user.filter(u => req.body.user.email == u.email)
  if(user.rol == 'admin') {
  next()
  }
  res.status(400).json({status: 400, message:'Este usuario no tiene priv de admin'})
  
  }

  const AuthMiddleware = async (req,res,next) => {
  const accessToken = req.header('Authorization');
  
    if (!accessToken || !accessToken.startsWith('Bearer ')) {
      return res.status(588).json({error : 'hola'});
    }
  
    next();
  };


app.post('/login',(req,res) =>{
  console.log(req.body);
  if(req.body) {
    const user = req.body;
    const userDb = users.find(u=>u.email==user.email&&u.password==user.password)
    if(userDb) {
      const token = jsonwebtoken.sign({nombre: userDb.nombre,email:userDb.email,password:userDb.password,rol: userDb.rol,plan:userDb.plan,
      id: userDb.id},'clave_secreta')
      res.send({token:token})
    } else {
      res.status(401).json({message:'error'})
    }
  } else {
    res.status(400).json({message:'error'})
  }
})

app.get('/alumnos', (req, res) => {
  const listaUsuarios = users.filter(u => u.rol == "alumno")
  res.json(listaUsuarios)
})

app.get('/profes', (req, res) => {
  const listaProfes = users.filter(u => u.rol == "profe")
  res.json(listaProfes)
})

app.get('/clases', (req, res) => {
  const listaClases = clases.sort((a,b)=>a.horario - b.horario)
  res.json(listaClases)
})

app.get('/rutinas', (req, res) => {
  const listaRutinas = rutinas
  res.json(listaRutinas)
}) 

app.get('/admin/clases/:id', (req, res) => {
  const idClase = req.params.id;
  const usuariosDeClase = usuariosInscriptos.filter(usuario => usuario.idClase === idClase);
  res.json(usuariosDeClase);
});



app.post('/usuarios/agregar',(req,res) =>{
  console.log(req.body);
  if(req.body) {
    const usuario = req.body;
    usuario.id = parseInt(users[users.length - 1]?.id || 0) + 1;
    users.push(usuario)
    res.status(200).json({message:'bien'})
  } else {
    res.status(400).json({message:'error'})
  }
})

app.post('/clases/agregar',(req,res) =>{
  console.log(req.body);
  if(req.body) {
    const clase = req.body;
    clase.id = parseInt(clases[clases.length - 1]?.id || 0) + 1 // ?. optional chaining
    clases.push(clase)
    res.status(200).json({message:'bien'})
  } else {
    res.status(400).json({message:'error'})
  }
})

app.post('/rutinas/agregar',(req,res) =>{
  console.log(req.body);
  if(req.body) {
    console.log(req.body)
    const rutina = req.body;
    const rutinaExistente = rutinas.find(r=> r.nombreAlumno == rutina.nombreAlumno)
    if(rutinaExistente != null) {
      throw new Error("La rutina ya esta repetida")
    }
    rutina.id = parseInt(rutinas[rutinas.length - 1]?.id || 0) + 1;
    rutinas.push(rutina)
    const alumno = users.find(u => rutina.nombreAlumno == u.nombre && u.rol =="alumno")
    //si el alumno existe le asignamos nombre de rutina y tipo rutina
   if(alumno != null ) {
    alumno.nombreRutina = rutina.nombre;
    alumno.tipoRutina = rutina.nivel;
   }
    res.status(200).json({message:'bien'})
  } else {
    res.status(400).json({message:'error'})
  }
})


///Me quede con esta, quiero agregar los usuarios inscriptos en cada clase
app.post('/clases/agregar/:id',(req,res) =>{
  console.log(req.body);
  if(req.body) {
    const {id: idClase} = req.params
    const usuario = req.body;
    //objeto clase y usuario
    const claseYusuario = {idClase: idClase, idUsuario: usuario.id}
    
    //busco la clase
    const listaClases = clases.filter(c => c.id == idClase)

    const usuarioInscripto = usuariosInscriptos.filter(u=>u.idClase==idClase&&u.idUsuario==usuario.id)
    if(listaClases[0].anotados < listaClases[0].capacidad && usuarioInscripto[0] == null) {
      console.log("Pusheamos el usuario a la clase")
      console.log(claseYusuario.idClase)
      usuariosInscriptos.push(claseYusuario)
      console.log(usuariosInscriptos[0].idUsuario + "Esta bien el id")
      listaClases[0].anotados++
      console.log(listaClases[0].anotados)
      res.status(200).json({message:'bien'})
    }
    else{
      throw new Error("Daaaaaaaaaale");
    }
 
  
  } else {
    res.status(400).json({message:'error'})
  }
})

app.delete('/clases/desuscribir/:id', (req, res) => {
  const {id: idClase} = req.params
  const usuario = req.body; // Supongamos que el id del usuario está en req.body.id
  const listaClases = clases.filter(c => c.id == idClase)
  console.log(usuariosInscriptos)
  const usuarioIndex = usuariosInscriptos.filter(u=>u.idClase==idClase&&u.idUsuario==usuario.id)
  
  if (usuarioIndex !== -1 && listaClases[0].anotados > 0)  {
    console.log(usuariosInscriptos)
    usuariosInscriptos.splice(usuarioIndex, 1);
    console.log(usuariosInscriptos)
    listaClases[0].anotados--
     // Elimina al usuario de la lista de inscritos en esa clase

    res.status(200).json({ message: 'Usuario desuscrito correctamente' });
  } else {
    res.status(404).json({ message: 'Usuario no encontrado en esta clase' });
  }
});

app.delete('/alumnos/:id', (req, res) => {
  if (req.params) {
    console.log("Tercera parte arranca bien")
    const idAlumno = req.params.id;
    const indexAlumno = users.findIndex(u => u.id == idAlumno && u.rol == "alumno")
   
    console.log("El index es : " +indexAlumno)
    if (indexAlumno >= 0) {
      const alumno = users.find(u => u.id == idAlumno && u.rol == "alumno")
      users.splice(indexAlumno,1)
      const idxRutinaABorrar = rutinas.findIndex(r => r.nombreAlumno == alumno.nombre)
      if(idxRutinaABorrar > 0 ) {
        rutinas.splice(idxRutinaABorrar,1)
      }
      res.status(200).json({ message: 'Alumno eliminado correctamente' });
    }
    else {
      res.status(404).json({ message: 'Alumno no encontrado' });

    }


  } else {
    res.status(400).json({ message: 'error' })

  }

}

)

app.delete('/profesores/:id', (req, res) => {
  if (req.params) {
    console.log("Hola profeeee")
    const idProfe = req.params.id;
    const indexProfe = users.findIndex(u => u.id == idProfe && u.rol == "profe")
    if (indexProfe >= 0) {
      users.splice(indexProfe,1)
      res.status(200).json({ message: 'Profe eliminado correctamente' });
    }
    else {
      res.status(404).json({ message: 'Alumno no encontrado' });

    }


  } else {
    res.status(400).json({ message: 'error' })

  }

}

)

app.delete('/clases/:id', (req, res) => {
  if (req.params) {
    const idClase = req.params.id;
    const indexClase = clases.findIndex(clase => clase.id == idClase)
    if (indexClase >= 0) {
      clases.splice(indexClase,1)
      res.status(200).json({ message: 'Clase eliminado correctamente' });

    }
    else {
      res.status(404).json({ message: 'Alumno no encontrado' });

    }


  } else {
    res.status(400).json({ message: 'error' })

  }

}

)


app.delete('/rutinas/:id', (req, res) => {
  if (req.params) {
    const idRutina = req.params.id;
    const indexRutina = rutinas.findIndex(r => r.id == idRutina)
    if(indexRutina >= 0) {
      rutinas.splice(indexRutina,1)
      res.status(200).json({ message: 'Ruitina eliminada correctamente' });
      
    }
    else {
      res.status(404).json({ message: 'Rutina no encontrada' });

    }


  } else {
    res.status(400).json({ message: 'error' })

  }

}

)



const lista = [{id:100,name:'Charly'},{id:200,name:'Jhon'}]
app.get('/lista', (req, res) => {
    console.log(req.headers['authorization']);
    res.json(lista)
})
app.post('/lista', (req,res) =>{
    //console.log(req.body);
    lista.push(req.body)
    res.status(200).json({message:'ok'})
})
app.delete('/lista/:id', (req,res) =>{
    // console.log(req.params.id);
    // lista = lista.filter(e=>e.id!=req.params.id)
    const index = lista.findIndex(e=>e.id==req.params.id);
    lista.pop(index)
    res.status(200).json({message:'ok'})
})
app.put('/lista/:id', (req,res) =>{
    //console.log(req.body);
    //console.log(req.params.id);
    const index = lista.findIndex(e=>e.id==req.params.id);
    lista[index]=req.body
    res.status(200).json({message:'ok'})
    // falta manejo de errores
    // res.status(404).json({message:'error'})
})

app.put('/lista/:id', (req,res) =>{
  //console.log(req.body);
  //console.log(req.params.id);
  const index = lista.findIndex(e=>e.id==req.params.id);
  lista[index]=req.body
  res.status(200).json({message:'ok'})
  // falta manejo de errores
  // res.status(404).json({message:'error'})
})
app.put('/alumnos/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  users[userIndex] = { ...users[userIndex], ...req.body };

  return res.status(200).json(users[userIndex]);
});


app.put('/rutinas/:id', (req, res) => {
  const rutinaId = parseInt(req.params.id);
  const rutinaIndex = rutinas.findIndex(rutina => rutina.id === rutinaId);

  if (rutinaIndex === -1) {
    return res.status(404).json({ message: 'Rutina no encontrada' });
  }

  rutinas[rutinaIndex] = { ...rutinas[rutinaIndex], ...req.body };

  return res.status(200).json(rutinas[rutinaIndex]);
});

app.put('/admin/clases/:id', (req, res) => {
  const claseId = parseInt(req.params.id);
  const claseIndex = clases.findIndex(clase => clase.id === claseId);

  if (claseIndex === -1) {
    return res.status(404).json({ message: 'Clase no encontrada' });
  }

  clases[claseIndex] = { ...clases[claseIndex], ...req.body };

  return res.status(200).json(clases[claseIndex]);
});

app.put('/admin/profesores/:id', (req, res) => {
  const profesorId = parseInt(req.params.id);
  const profesorIndex = users.findIndex(profesor => profesor.id === profesorId && profesor.rol === 'profe');

  if (profesorIndex === -1) {
    return res.status(404).json({ message: 'Profe no encontrado' });
  }

  users[profesorIndex] = { ...users[profesorIndex], ...req.body };

  return res.status(200).json(users[profesorIndex]);
});

app.put('/perfil/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { nuevoDato, esEmail } = req.body;

  const userToUpdate = users.find(user => user.id === userId);
  if (!userToUpdate) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (esEmail) {
    userToUpdate.email = nuevoDato;
  } else {
    userToUpdate.password = nuevoDato;
  }

  return res.status(200).json({ message: 'Perfil actualizado exitosamente', user: userToUpdate });
});


const PORT = 3000
const server = app.listen(PORT, () => console.log(`Servidor express escuchando en http://localhost:${PORT}`))
server.on('error', error => console.log(`Error en servidor: ${error.message}`))
