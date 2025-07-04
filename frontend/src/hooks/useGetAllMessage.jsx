const { getMessage } = require("@/http/api");
const { useEffect } = require("react")


const useGetAllMessage = ()=>{
    useEffect(async ()=>{
        const fetchMessages = await getMessage();
    },[]);
}