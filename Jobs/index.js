const mysql = require("mysql2");
const fs = require("fs");
const qs = require("qs");
const path = require("path");
const location = path.resolve(__dirname,"DigiCertGlobalRootCA.crt.pem");
const serviCa = [fs.readFileSync(location,"utf-8")];
const pool = mysql.createPool({
    host:"bdfinal.mysql.database.azure.com",
    user:"sebas",
    password:"Se20203368",
    port:"3306",
    database:"hr",
    ssl:{
        rejectUnauthorized:"true",
        ca:serviCa
    }
});
const promisePool = pool.promise();


module.exports = async function (context, req) {
    if(req.method==="POST"){
        let [rows,fields]=await promisePool.query("Select * from jobs");
        if(req.rawBody){
            let data = qs.parse(req.rawBody);
            let job_title = data.job_title;
            let minsal = data.min_salary;
            let maxsal = data.max_salary;
            let job_id = data.job_id;
            let flag = false;
            for(const r of rows){
                if(r.job_title===job_title){
                    flag=true;
                    break;
                }
            }
            if(flag){
                context.res={
                    status:400,
                    body:{
                        success:"false",
                        msj:"Jobtitle se encuentra repetido"
                    },
                    headers:{"Content-Type":"application/json"}
                }
            }else{
                let values = {
                    job_id:job_id,
                    job_title:job_title,
                    min_salary:minsal,
                    max_salary:maxsal
                }
                await promisePool.query("Insert into jobs set ?",values);
                let [fil,fields] = await promisePool.query("Select * from jobs where job_id=?",[job_id]);
                context.res={
                    status:201,
                    body:{
                        success:"true",
                        JobCreated:fil,
                    },
                    headers:{"Content-Type":"application/json"}
                }
            }
        }else{
            context.res={
                status:400,
                body:{
                    success:"false",
                    msj:"Missing Data"
                },
                headers:{"Content-Type":"application/json"}
            }
        }
    }else{
        context.res={
            status:404,
            headers:{"Content-Type":"application/json"}
        }
    }
}