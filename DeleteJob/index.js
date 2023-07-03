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
    if(req.headers["apk"]){
        let apk = req.headers["apk"];
        if(apk==="20203368"){
            if(req.query.id){
                let found = false;
                let [rows,fields]= await promisePool.query("Select * from jobs")
                for(const r of rows){
                    if(r.job_id===req.query.id){
                        found=true;
                        break;
                    }
                }
                if(found){
                    await promisePool.query("Delete from jobs where job_id=?",[req.query.id])
                    context.res={
                        status:200,
                        body:{
                            msj:"Id deleted: "+req.query.id
                        },
                        headers:{"Content-Type":"application/json"}
                    }
                }else{
                    context.res={
                        status:404,
                        body:{
                            msj:"Id not found"
                        },
                        headers:{"Content-Type":"application/json"}
                    }
                }
            }else{
                context.res={
                    status:400,
                    body:{
                        msj:"Send id"
                    },
                    headers:{"Content-Type":"application/json"}
                }
            }
        }else{
            context.res={
                status:401,
                body:{
                    msj:"Apk incorrecta"
                },
                headers:{"Content-Type":"application/json"}
            }
        }
    }else{
        context.res={
            status:400,
            body:{
                msj:"Send apk"
            },
            headers:{"Content-Type":"application/json"}
        }
    }
    
}