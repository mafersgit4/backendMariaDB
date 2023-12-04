"use strict"
import { createPool } from "mariadb";


/** 
 * leer nuestra tabla profesor de la base de datos 
 */

export default class ProfesorDAO {
    static pool = createPool({
        host: 'localhost',
        user: 'root',
        password: 'root!',
        database: 'ecommerce',
        connectionLimit: 5,
        dateStrings: true,
        insertIdAsNumber: true,
        timezone: 'auto',
        trace: true 
    });

    static async selectAllUsers() {
        return this.pool.query('SELECT * FROM profesor');
    }

    static async selectProfesorById(id) {
        const resultado = await this.pool.query('SELECT * FROM profesor WHERE id = ?', [id]);
        return (resultado.length == 0) ? null : resultado[0];
    }

    static async insertProfesor(profesor) {
        const { name, lastname, birthdate } = profesor;
        return this.pool.query('INSERT INTO profesor (name, lastname, birthdate) VALUES (?, ?, ?)', [name, lastname, birthdate]);
    }

    static async updateProfesor(profesor) {
        const { id, name, lastname, birthdate } = profesor;
        return this.pool.query('UPDATE profesor SET name = ?, lastname = ?, birthdate = ? WHERE id = ?', [name, lastname, birthdate, id]);
    }

    static async deleteProfesor(profesor) {
        return this.pool.query('DELETE FROM profesor WHERE id = ?', [profesor]);
    }
}