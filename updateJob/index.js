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
    database:"hr",
    port:"3306",
    ssl:{
        rejectUnauthorized:"true",
        ca:serviCa
    }
});
const promisePool = pool.promise();


module.exports = async function (context, req) {
    let job_title = req.body.job_title;
    let minsal = req.body.min_salary;
    let maxsal = req.body.max_salary;
    let job_id = req.body.job_id;
    
    context.log(minsal)
    context.log(job_title)
    context.log(maxsal)
    context.log(job_id)

    let values = {
        job_title:job_title,
        min_salary:minsal,
        max_salary:maxsal
    }

    await promisePool.query("Update jobs set ? where job_id=?",[values,job_id]);
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