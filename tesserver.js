const express = require("express");
var cors = require('cors');
const app = express();
const sql = require('mssql');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(cors())

app.get("/", function (req, response) {
   response.writeHead(200, { 'Content-Type': 'text/plain' });
   response.end('Hello World!\n - TESTING API -');
});

const config = {
   user: 'su',
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

// get list
app.get("/api/mahasiswa", function (req, res) {
   var qr = "select * from Mahasiswa";
   query(res, qr, null);
});

app.get("/api/mahasiswa/:ID", function (req, res) {
   var param = [
      { name: 'ID', sqltype: sql.Int, value: req.params.ID }
   ]
   var qr = "select * from Mahasiswa where ID = " + req.params.ID;
   query(res, qr, null);
});

app.post('/api/mahasiswa',function(req,res){
   var param = [
      { name: 'NRP', sqltype: sql.Char, value: req.body.NRP },
      { name: 'Nama', sqltype: sql.VarChar, value: req.body.Nama },
      { name: 'Angkatan', sqltype: sql.Int, value: req.body.Angkatan },
      { name: 'Tgl_lahir', sqltype: sql.Date, value: req.body.Tgl_lahir },
      { name: 'active', sqltype: sql.Bit, value: req.body.active }
    ]
    
    var qr = "insert into Mahasiswa (NRP,Nama,Tgl_lahir,active,Angkatan) values (@NRP, @Nama, @Tgl_lahir, @active, @Angkatan);"
    query(res, qr, param);
})

app.put('/api/mahasiswa/:id',function(req,res){
   var param = [
    { name: 'ID', sqltype: sql.Int, value: req.params.ID },
    { name: 'NRP', sqltype: sql.Char, value: req.body.NRP },
    { name: 'Nama', sqltype: sql.VarChar, value: req.body.Nama },
    { name: 'Angkatan', sqltype: sql.Int, value: req.body.Angkatan },
    { name: 'Tgl_lahir', sqltype: sql.Date, value: req.body.Tgl_lahir },
    { name: 'active', sqltype: sql.Bit, value: req.body.active }
  
    ]
    console.log(param)
    var qr = "update Mahasiswa set NRP = @NRP, Nama = @Nama, Angkatan = @Angkatan, Tgl_lahir = @Tgl_lahir, active = @active WHERE ID = @ID;"
    query(res, qr, param);
})

app.delete('/api/mahasiswa/:ID', function (req, res, next) {
   var qr = "delete from Mahasiswa where ID=" + req.params.ID;
   query(res, qr, null);
})

// Console will print the message
app.listen(8027, function () {
   console.log('CORS-enabled web server listening on port 8027')
})