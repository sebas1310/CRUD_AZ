const mysql = require("mysql2");
const fs = require("fs");
const qs = require("qs");
const path = require("path");
const location = path.resolve(__dirname,"DigiCertGlobalRootCA.crt.pem");
const serviCa = [fs.readFileSync(location,"utf-8")];
const pool = mysql.createPool({
    user:"sebas",
    host :"bdfinal.mysql.database.azure.com",
    password:"Se20203368",
    database:"hr",
    port:"3306",
    ssl:{
        rejectUnauthorized:"true",
        ca:serviCa
    }
});
const promisePool = pool.promise();

module.exports = async function (context, req) {
    if(req.method==="GET"){
        if(req.query.name || req.query.apll){
            let nombre="";
            let apellido="";
            if(req.query.name){
                nombre=req.query.name;
            }
            if(req.query.apll){
                apellido = req.query.apll;
            }
            [rows, fields] = await promisePool.query("SELECT * FROM employees WHERE LOWER(first_name) = ? OR LOWER(last_name) = ?", [nombre.toLowerCase(), apellido.toLowerCase()]);
            context.res={
                status:200,
                body:{
                    success:"true",
                    nombre:nombre,
                    apellido:apellido,
                    cantidad:rows.length, 
                    lsita:rows
                },
                headers:{"Content-Type":"application/json"}
            };
        }else{
            [rows,fileds]= await promisePool.query("Select * from employees");
            context.res={
                status:200,
                body:{
                    success:"true",
                    lsita:rows
                },
                headers:{"Content-Type":"application/json"}
            };
        } 
    }else{
        context.res={
            status:400,
            body:{
                success:"false",
                msj:"Method not allowed"
            },
            headers:{"Content-Type":"application/json"}
        };
    }
}