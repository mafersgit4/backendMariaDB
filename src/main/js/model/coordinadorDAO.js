"use strict"
import { createPool } from "mariadb";


/** 
 * leer nuestra tabla coordinador de la base de datos 
 */

export default class CoordinadorDAO {
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
        return this.pool.query('SELECT * FROM coordinador');
    }

    static async selectCoordinadorById(id) {
        const resultado = await this.pool.query('SELECT * FROM coordinador WHERE id = ?', [id]);
        return (resultado.length == 0) ? null : resultado[0];
    }

    static async insertCoordinador(coordi) {
        const { name, lastname, birthdate } = coordi;
        return this.pool.query('INSERT INTO coordinador (name, lastname, birthdate) VALUES (?, ?, ?)', [name, lastname, birthdate]);
    }

    static async updateCoordinador(coordi) {
        const { id, name, lastname, birthdate } = coordi;
        return this.pool.query('UPDATE coordinador SET name = ?, lastname = ?, birthdate = ? WHERE id = ?', [name, lastname, birthdate, id]);
    }

    static async deleteCoordinador(coordi) {
        return this.pool.query('DELETE FROM coordinador WHERE id = ?', [coordi]);
    }
};