"use strict"
import { createPool } from "mariadb";

/** 
 * leer nuestra tabla rol de la base de datos 
 */
export default class RolDAO {
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

    /** 
     * Seleccionar todos los registros en la tabla de rol.
    */
    static async selectAllUsers() {
        return this.pool.query('SELECT * FROM rol');
    }

    /**
     * Busca un registro de la tabla rol en base a su id.
     * @param {number} id - id del usuario que se busca
     * @returns un objeto representando al usuario con dicho id
     */

    static async selectRolById(id) {
        const resultado = await this.pool.query('SELECT * FROM rol WHERE id = ?', [id]);
        return (resultado.length == 0) ? null : resultado[0];
        //return this.pool.query('SELECT * FROM rol WHERE id = ?', [id]);
    }

    static async insertRol(rol) {
        const { name, lastname, birthdate } = rol;
        return this.pool.query('INSERT INTO rol (name, lastname, birthdate) VALUES (?, ?, ?)', [name, lastname, birthdate]);
    }

    static async updateRol(rol) {
        const { id, name, lastname, birthdate } = rol;
        return this.pool.query('UPDATE rol SET name = ?, lastname = ?, birthdate = ? WHERE id = ?', [name, lastname, birthdate, id]);
    }

    static async deleteRol(rol) {
        return this.pool.query('DELETE FROM rol WHERE id = ?', [rol]);
    };
};
