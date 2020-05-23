const joinRoom = (req, res)=>{

    console.log(req.query);
    res.send("good");
};

const addRoom = (req, res)=>{
    res.send("good");
};



module.exports = {
    joinRoom,
    addRoom,
};