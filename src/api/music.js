import request from "@/utils/request";

let music={
    querymusic:data => request.get("/api/querymusic",data),
    upload:data=>request.post("/api/upload",data),
    addmusic:data=>request.post("/api/addmusic",data),
    delete:data=>request.get("/api/deletemusic",data),
    updata:data=>request.post("/api/updatemusic",data)
}

export default music;