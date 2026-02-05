import mongoose from "mongoose"
import app from "./app"
import config from "./config"
// import dns from "node:dns"

function server(){
    // dns.setServers(["8.8.8.8","1.1.1.1"]);
    try{
        mongoose.connect(config.database_url as string)
        app.listen(config.port || 5000, ()=>{
            console.log(`server ok ${config.port || 5000}`)
        })
    }catch(error){

    }
    
}

console.log(config.database_url)

server()
