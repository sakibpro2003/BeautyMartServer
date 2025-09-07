import mongoose from "mongoose"
import app from "./app"
import config from "./config"

function server(){
    try{
        mongoose.connect(config.database_url as string)
        app.listen(config.port, ()=>{
            console.log(`server ok ${config.port}`)
        })
    }catch(error){

    }
    
}

console.log(config.database_url)

server()