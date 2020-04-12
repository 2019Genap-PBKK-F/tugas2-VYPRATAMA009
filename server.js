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


//API baru

//api untuk tabel Kategori Unit
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


//api tabel Unit
app.get("/api/unit", function (req, res) {
    var qr = "select * from Unit";
    query(res, qr, null)
 })
 
 app.get("/api/unit/:id", cors(), function (req, res) {
    var qr = "select * from Unit where id = " + req.params.id;
    query(res, qr, null)
 })
 
 app.post('/api/unit',function(req,res){
    var param = [
       { name: 'KategoriUnit_id', sqltype: sql.Int, value: req.body.KategoriUnit_id },
       { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
    ]
     
     var qr = "insert into Unit (KategoriUnit_id, nama) values (@KategoriUnit_id, @nama);"
     query(res, qr, param);
 })
 
 app.put('/api/unit/:id', cors(),function(req,res){
    var param = [
       { name: 'id', sqltype: sql.Int, value: req.params.id },
       { name: 'KategoriUnit_id', sqltype: sql.Int, value: req.body.KategoriUnit_id },
       { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
     ]
     //console.log(param)
     var qr = "update Unit set nama = @nama, KategoriUnit_id = @KategoriUnit_id WHERE id = @id;"
     query(res, qr, param);
 })
 
 app.delete('/api/unit/:id', function (req, res, next) {
    var qr = "delete from Unit where id=" + req.params.id;
    query(res, qr, null);
 })


//api capaian unit
app.get("/api/capaian", function (req, res) {
    var qr = "select * from Capaian_Unit";
    query(res, qr, null);
 })
 
 app.get("/api/capaian/:data_id&:unit_id", cors(), function (req, res) {
    var qr = "select * from Capaian_Unit where DataDasar_id = " + req.params.data_id + " AND Unit_id = " + req.params.unit_id;
    query(res, qr, null);
 })
 
 app.post('/api/capaian',function(req,res){
    var param = [
       { name: 'DataDasar_id', sqltype: sql.Int, value: req.body.DataDasar_id },
       { name: 'Unit_id', sqltype: sql.Int, value: req.body.Unit_id },
       { name: 'capaian', sqltype: sql.Float, value: req.body.capaian }
    ]
     
     var qr = "insert into Capaian_Unit (DataDasar_id, Unit_id, waktu, capaian) values (@DataDasar_id, @Unit_id, CURRENT_TIMESTAMP, @capaian);"
     query(res, qr, param);
 })
 
 app.put('/api/capaian/:data_id&:unit_id', cors(),function(req,res){
    var param = [
       { name: 'DataDasar_id_old', sqltype: sql.Int, value: req.params.data_id },
       { name: 'Unit_id_old', sqltype: sql.Int, value: req.params.unit_id },
       { name: 'DataDasar_id', sqltype: sql.Int, value: req.body.DataDasar_id },
       { name: 'Unit_id', sqltype: sql.Int, value: req.body.Unit_id },
       { name: 'waktu', sqltype: sql.DateTime, value: req.body.waktu },
       { name: 'capaian', sqltype: sql.Float, value: req.body.capaian }
     ]
     //console.log(param)
     var qr = "update Capaian_Unit set waktu = @waktu, capaian = @capaian, DataDasar_id = @DataDasar_id, Unit_id = @Unit_id WHERE DataDasar_id = @DataDasar_id_old AND Unit_id = @Unit_id_old ;"
     query(res, qr, param);
 })
 
 app.delete('/api/capaian/:data_id&:unit_id', function (req, res, next) {
    var qr = "delete from Capaian_Unit where DataDasar_id = " + req.params.data_id + " AND Unit_id = " + req.params.unit_id;
    query(res, qr, null);
 })
 



// Console will print the message
app.listen(8027, function () {
   console.log('CORS-enabled web server listening on port 8027')
})