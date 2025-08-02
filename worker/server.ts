import express from "express";
import cors from "cors"
import {createClient} from "redis";
const app = express();
app.use(cors());
app.use(express.json());

const client = createClient();

interface ProblemInterface{
    id: string,
    code: string,
    userId: string
}


 async function WorkerCode(){
        while(true){
            await ProcessProblems();
        }
    
}


async function ProcessProblems(){
    const prob = await client.brPop("problem", 0);
    
    const probelem: ProblemInterface = JSON.parse(prob?.element as string);
    console.log(probelem);
    console.log("Solving problem with id: "+ probelem.id);
    // process the problem
    await new Promise((res)=>{
        setTimeout(res, 1000);
    })
    console.log("Processed problem with PID: "+ probelem.id);
}

async function startServer(){
    try{
        await client.connect();
        console.log("redis client connected");
        app.listen(3001, ()=>{
            console.log("process listening at port 3001");
        });

        WorkerCode();

    }
    catch(e){
        const message = e instanceof Error ? e.message : "Internal server Error";
        console.log(message);
    }
}

startServer();

