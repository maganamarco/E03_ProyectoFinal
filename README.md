# E03_ProyectoFinal
**Materia:** Modelado de Datos

**Integrantes:**
- Emiliano Solis Ek
- Arturo Cabrera Vidaña 
- Marco Antonio Magaña Mis

**b. Descripción del dataset**

El dataset Student Alcohol Consumption contiene información recolectada en dos escuelas portuguesas y describe características académicas, sociales y familiares de los estudiantes, junto con dos variables clave: consumo de alcohol entre semana (Dalc) y consumo de alcohol en fin de semana (Walc).

El objetivo principal del dataset es analizar factores que influyen en el consumo de alcohol entre adolescentes.

**c. Diccionario de datos (metadatos)**

| Columna     | Descripción                                         |
| ----------- | --------------------------------------------------- |
| school      | Escuela del estudiante (GP o MS)                    |
| sex         | Sexo del estudiante (F/M)                           |
| age         | Edad del estudiante (15–22 años)                    |
| address     | Tipo de domicilio (U = urbano, R = rural)           |
| famsize     | Tamaño familiar (LE3 = ≤3, GT3 = >3)                |
| Pstatus     | Situación de los padres (T = juntos, A = separados) |
| Medu / Fedu | Nivel educativo de madre/padre (0–4)                |
| Mjob / Fjob | Trabajo de madre/padre                              |
| reason      | Razón para elegir la escuela                        |
| guardian    | Tutor legal                                         |
| traveltime  | Tiempo de transporte a la escuela (1–4)             |
| studytime   | Tiempo de estudio semanal (1–4)                     |
| failures    | Número de reprobaciones                             |
| schoolsup   | Apoyo escolar extra (yes/no)                        |
| famsup      | Apoyo familiar (yes/no)                             |
| paid        | Clases extras pagadas (yes/no)                      |
| activities  | Actividades extracurriculares (yes/no)              |
| nursery     | Asistió a guardería (yes/no)                        |
| higher      | Interés en educación superior (yes/no)              |
| internet    | Acceso a Internet en casa (yes/no)                  |
| romantic    | Relación romántica actual (yes/no)                  |
| famrel      | Calidad de relaciones familiares (1–5)              |
| freetime    | Tiempo libre después de la escuela (1–5)            |
| goout       | Frecuencia de salir (1–5)                           |
| Dalc        | Consumo de alcohol entre semana (1–5)               |
| Walc        | Consumo de alcohol en fin de semana (1–5)           |
| health      | Salud actual (1–5)                                  |
| absences    | Número de inasistencias                             |
| G1, G2, G3  | Calificaciones del primer, segundo y tercer periodo |

**d. Modelado del dataset en una BD NoSQL (MongoDB)**

El dataset Student Alcohol Consumption contiene información de estudiantes, incluyendo datos personales, académicos y niveles de consumo de alcohol. Para una base de datos NoSQL como MongoDB, este dataset se modela utilizando documentos BSON, porque MongoDB está orientado a documentos.

En lugar de dividir la información del estudiante en varias tablas como ocurriría en una base de datos relacional (por ejemplo: tabla estudiantes, tabla historial académico, tabla contacto familiar, etc.), en MongoDB toda la información del estudiante se puede almacenar dentro de un solo documento.

Esto es posible porque MongoDB permite representar cada registro del dataset como un documento JSON con campos anidados. Por ejemplo, un documento puede contener:

- Datos personales
- Información escolar
- Hábitos de estudio
- Consumo de alcohol (Dalc y Walc)
- Relaciones familiares
- Actividades extracurriculares

Gracias al formato BSON/JSON, MongoDB facilita que cada estudiante del dataset pueda representarse como un objeto completo, sin necesidad de normalización ni relaciones complejas.

Ejemplo de cómo se modela un estudiante en MongoDB:
{
  "school": "GP",
  "sex": "F",
  "age": 17,
  "address": "U",
  "famsize": "GT3",
  "Pstatus": "T",
  "Medu": 4,
  "Fedu": 4,
  "Mjob": "teacher",
  "Fjob": "health",
  "studytime": 2,
  "failures": 0,
  "activities": "yes",
  "higher": "yes",
  "internet": "yes",
  "Dalc": 1,
  "Walc": 1,
  "health": 5,
  "absences": 2,
  "G1": 15,
  "G2": 15,
  "G3": 15
}

**e. Herramientas utilizadas**

- MongoDB Compass: Para almacenar la base de datos
- Github: Para crear el repositorio y darle formato a la tarea 
- Wget: Para descargar desde la pagina web de MongoDB Compass
- Kaggle: Para descargar la base de datos

**f. Proceso de importación de datos a MongoDB**

- Descargar student-mat.csv desde Kaggle.
- Abrir MongoDB Compass.
- Crear una base de datos llamada student_consumption.
- Crear colección: students.
- En Compass, seleccionar Import Data > CSV.
- Seleccionar el archivo student-mat.csv.
- Validar tipos de datos:
 - numéricos → int
 - yes/no → convertirlos a boolean opcionalmente
- Importar.

**g. Sentencias CRUD para MongoDB (5 ejemplos por operación)**

CREATE (Insertar): 

1. db.students.insertOne({ school: "GP", sex: "F", age: 16 });
2. db.students.insertOne({ school: "MS", sex: "M", age: 17, alcohol: { Dalc: 3, Walc: 4 }});
3. db.students.insertOne({ school: "GP", academic: { G1: 12, G2: 14, G3: 13 }});
4. db.students.insertOne({ school: "GP", lifestyle: { health: 5, goout: 2 }});
5. db.students.insertOne({ school: "MS", attendance: { absences: 10 }});

READ (Consultar):

1. db.students.find({ sex: "F" });
2. db.students.find({ "alcohol.Dalc": { $gte: 3 } });
3. db.students.find({ "academic.G3": { $gte: 15 } });
4. db.students.find({ age: { $gte: 18 } });
5. db.students.find({ "lifestyle.health": 5 });

UPDATE (Actualizar): 

1. db.students.updateOne({ sex: "M" }, { $set: { age: 18 }});
2. db.students.updateOne({ school: "GP" }, { $set: { "academic.G1": 18 }});
3. db.students.updateOne({ "alcohol.Dalc": 5 }, { $set: { "alcohol.Dalc": 4 }});
4. db.students.updateOne({ "attendance.absences": 0 }, { $inc: { "attendance.absences": 1 }});
5. db.students.updateOne({ sex: "F", age: 16 }, { $set: { romantic: "yes" }});

DELETE (Eliminar): 

1. db.students.deleteOne({ age: 22 });
2. db.students.deleteOne({ "academic.failures": 3 });
3. db.students.deleteMany({ "alcohol.Dalc": 1 });
4. db.students.deleteOne({ school: "MS", sex: "F" });
5. db.students.deleteMany({ "attendance.absences": { $gt: 20 }});

**Referencias**
- https://www.kaggle.com/datasets/uciml/student-alcohol-consumption?select=student-mat.csv
- https://www.mongodb.com/
