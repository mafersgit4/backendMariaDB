"use strict"

import { strict as assert } from "node:assert";
import { afterEach, beforeEach, describe, it} from 'node:test';
import { createConnection } from 'mariadb';
import RolDAO from "../../main/js/model/rolDAO.js";

describe('Test RolDAO class', () => {
    beforeEach(async () => {
        const conn = await createConnection({
            database: 'ecommerce',
            host: "localhost",
            user: "root",
            password: "root!",
            trace: true
        });
        await conn.importFile({file: '../../main/sql/createRolTable.sql'});
        await conn.importFile({file: '../sql/rol_data.sql'});
        conn.end();
    });
    afterEach(async () => {
        const conn = await createConnection({
            host: "localhost",
            user: "root",
            password: "root!",
            database: "ecommerce",
            trace: true
        });
        await conn.query("DROP TABLE rol");
        conn.end();
    });

    
    describe('Test para seleccionar usuarios', () => {
        it ('devolver un array con los usuarios', async () => {
            const esperado = [
                { id: 1, name: 'Laura', lastname: 'Garcia', birthdate: '1982-07-21' },
                { id: 2, name: 'Maria', lastname: 'Gomez', birthdate: '1992-05-08' },
                { id: 3, name: 'Fernando', lastname: 'Reyes', birthdate: '2002-11-23' }
            ];
            const resultado = await RolDAO.selectAllUsers();
            assert.deepEqual(resultado, esperado);
        });
    });

    describe('Test para seleccionar usuarios por ID', () => {
        it ('devolver un objeto con el usuario y el id correspondiente', async () => {
            const usuario1 = { id: 1, name: 'Laura', lastname: 'Garcia', birthdate: '1982-07-21' };
            const resultado1 = await RolDAO.selectRolById(1);

            assert.deepEqual(resultado1, usuario1);
        });
    });

    describe('Test para insertar un rol', () => {
        it ('debería insertar un nuevo rol', async () => {
            assert.rejects(RolDAO.insertRol({ lastname: 'Kiara', birthdate: '2003-08-20' }),
               { name: 'SqlError', sqlMessage: "no puede estar vacío" }, 
            );
            assert.rejects(RolDAO.insertRol({ name: 'Joel', birthdate: '2003-08-20' }),
                { name: 'SqlError', sqlMessage: "no puede estar vacío" },
            );
            assert.rejects(RolDAO.insertRol({ name: 'Joel', lastname: 'Kiara'}),
                { name: 'SqlError', sqlMessage: "no puede estar vacío" },
            );
        });
    });

    describe('Test para actualizar un rol', () => {
        it ('debería actualizar un rol existente', async () => {
            const expected = { affectedRows: 1, insertId: 0, warningStatus: 0 };
            const rolActualizado = { id: 1, name: 'Jorge', lastname: 'Vargas', birthdate: '1976-03-11'};
            const resultado = await RolDAO.updateRol(rolActualizado);
            assert.equal(resultado.affectedRows, expected.affectedRows);
            assert.equal(resultado.insertId, expected.insertId);
            assert.equal(resultado.warningStatus, expected.warningStatus);
        });
    });

    describe('Test para eliminar un rol', () => {
        it ('deberia de eliminar un rol existente', async () => {
            const idEliminar = 2;
            const rolresultado = await RolDAO.deleteRol(idEliminar);
            const rolEliminado = await RolDAO.selectRolById(rolresultado);
            assert.deepEqual(rolEliminado.length, 0);
        });
    });
});