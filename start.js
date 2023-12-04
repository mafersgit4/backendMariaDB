"use strict"
import {createPool} from 'mariadb'; //solo traer createPool 


async function connectDB(host, user, password, database, connectionLimit, tracelevel) {
    const pool = createPool({
        host: host,
        user: user,
        password: password,
        database: database,
        connectionLimit: connectionLimit,
        tracelevel: tracelevel
    });
    const result = await pool.query("SELECT * from rol where nombre = 'Administrador' ")
    console.log(result);
}


connectDB('localhost', 'root', 'root!', 'ecommerce', '5', true);