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
    if(req.body){
        if(req.body.name && req.body.apellido && req.body.id && req.body.mail && req.body.jobid){
            let employee_id = req.body.id;
            let first_name = req.body.name;
            let last_name=req.body.apellido;
            let email=req.body.mail;
            let hire_date="1987-06-17 00:00:00";
            let job_id = req.body.jobid;

            let values={
                employee_id:employee_id,
                first_name:first_name,
                last_name:last_name,
                email:email,
                hire_date:hire_date,
                job_id:job_id
            };

            await promisePool.query("Insert into employees set ?",values);
            
            let [rows,fileds] = await promisePool.query("Select * from employees where employee_id=?",[employee_id]);
            context.res={
                status:200,
                body:{
                    success:"true",
                    EmpleadoCreado:rows
                },
                headers:{"Content-Type":"application/json"}
            };
        }else{
            context.res={
                status:400,
                body:{
                    succes:"false",
                    msj:"missing data"
                },
                headers:{"Content-Type":"application/json"}
            };
        }
    }else{
        context.res={
            status:400,
            body:{
                succes:"false",
                msj:"No data",
            },
            headers:{"Content-Type":"application/json"}
        }
    }
}