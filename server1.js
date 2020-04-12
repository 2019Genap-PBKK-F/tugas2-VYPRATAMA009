const express = require("express");
var cors = require('cors');
const app = express();
const sql = require('mssql');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(cors())
app.options('*', cors());

app.use(function (req, res, next) {
   //Enabling CORS 
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
   next();
 });

app.get("/", function (req, response) {
   response.writeHead(200, { 'Content-Type': 'text/plain' });
   response.end('Hello World!\n - TESTING API -');
});

const config = {
   user: 'sa',
   password: 'SaSa1212',
   server: '10.199.13.253',
   database: 'nrp05111740000156'
};

var query = function (res, query, params) {
   sql.connect(config, function (err) {
      if (err) {
         res.end('Connection Error\n' + err)
      }
      else {
         var request = new sql.Request()
         if (params != null){
            params.forEach(function (p) {
               request.input(p.name, p.sqltype, p.value);
            });
         }
         request.query(query, function (err, recordset) {
            if (err) {
               console.log('Query Error\n' + err)
            }
            else {
               res.send(recordset)
            }
         })
      }
   })
}


//api untuk tabel kategori unit
app.get("/api/kategori", function (req, res) {
   var qr = "select id, nama as name from KategoriUnit";
   query(res, qr, null);
})

app.get("/api/kategori/:id", cors(), function (req, res) {
   var qr = "select * from KategoriUnit where id = " + req.params.id;
   query(res, qr, null);
})

app.post('/api/kategori',function(req,res){
   var param = [
      { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
   ]
    
    var qr = "insert into KategoriUnit (nama) values (@nama);"
    query(res, qr, param);
})

app.put('/api/kategori/:id', cors(),function(req,res){
   var param = [
      { name: 'id', sqltype: sql.Int, value: req.params.id },
      { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
    ]
    //console.log(param)
    var qr = "update KategoriUnit set nama = @nama WHERE id = @id;"
    query(res, qr, param);
})

app.delete('/api/kategori/:id', function (req, res, next) {
   var qr = "delete from KategoriUnit where id=" + req.params.id;
   query(res, qr, null);
})

//api data dasar
app.get("/api/dasar", function (req, res) {
   var qr = "select id, nama as name from DataDasar";
   query(res, qr, null);
})

app.get("/api/dasar/:id", cors(), function (req, res) {
   var qr = "select * from DataDasar where id = " + req.params.id;
   query(res, qr, null);
})

app.post('/api/dasar',function(req,res){
   var param = [
      { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
   ]
    
    var qr = "insert into DataDasar (nama) values (@nama);"
    query(res, qr, param);
})

app.put('/api/dasar/:id', cors(),function(req,res){
   var param = [
      { name: 'id', sqltype: sql.Int, value: req.params.id },
      { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
    ]
    //console.log(param)
    var qr = "update DataDasar set nama = @nama WHERE id = @id;"
    query(res, qr, param);
})

app.delete('/api/dasar/:id', function (req, res, next) {
   var qr = "delete from DataDasar where id=" + req.params.id;
   query(res, qr, null);
})








// Console will print the message
app.listen(8027, function () {
   console.log('CORS-enabled web server listening on port 8027')
})