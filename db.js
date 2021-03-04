const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "postgres",
    database: "nasa",
    port: 5432

});

const newUser = async (email, nombre, password, ) => {
   
        const results = await pool.query("INSERT INTO usuarios (email , nombre, password, auth) VALUES($1, $2, $3, 'false')RETURNING*;",
        [email, nombre, password])

        return results.rows;
}

const getUsers = async () => {
   
        const result = await pool.query(`SELECT * FROM usuarios`);
        return result.rows;
}

const changeAuth = async(id, auth)=>{
    const results = await pool.query("UPDATE usuarios SET auth=$1 WHERE id=$2 RETURNING*",
    [auth, id]);
    return results;
}


//punto 3
const getUser = async (email, password) => {
    const result = await pool.query("SELECT * FROM usuarios where email=$1 AND password=$2",
    [email, password]);
    return result.rows[0];
  };

//   const getUser = async (email, password) => {
//     const result = await pool.query(`SELECT * FROM usuarios where email=${email} AND password=${password}`);
  
//     return result;
//   };

module.exports = {
    newUser,
    getUsers,
    changeAuth,
    getUser

};
