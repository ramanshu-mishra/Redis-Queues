import express from "express"
import cors from "cors"
import {createClient} from "redis";

const client = createClient();
client.on("error", (e:Error)=>{
    console.log("Redis client Error: "+ e)
});

const app =express();
app.use(express.json());
app.use(cors());


app.post("/", async (req,res)=>{
    const problem = req.body?.problemId;
    const code = req.body?.code;
    const userId = req.body?.userId;

    if(!problem || !code || !userId){
        res.status(405).json({
            message: "undefined data"
        })
        return;
    }

    try{
    await client.lPush("problem", JSON.stringify({id: problem, code,userId}));
    res.status(200).json({
        message: "pushed for submission"
    });
    return ;
    }
    catch(e){
        res.status(500).json({
            message: "Internal server error: "+e
        })
        return ;
    }
    

})


async function startServer(){
    try{
        await client.connect();
        console.log("redis client connected");
        app.listen(3000, ()=>{
            console.log("Server running at port 3000");
        })

    }
    catch(e){
        const message = e instanceof Error ? e.message : "Internal Server Error";
        console.log(message);
    }
}

await startServer();


