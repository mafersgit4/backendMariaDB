"use strict"

import { strict as assert } from "node:assert";
import { afterEach, beforeEach, describe, it} from 'node:test';
import { createConnection } from 'mariadb';
import CoordinadorDAO from "../../main/js/model/coordinadorDAO.js";

describe('Test Coordinador Class', () => {
    beforeEach(async () => {
        const conn = await createConnection({
            database: 'ecommerce',
            host: "localhost",
            user: "root",
            password: "root!",
            trace: true
        });
        await conn.importFile({file: '../../main/sql/createCoordinadorTable.sql'});
        await conn.importFile({file: '../sql/coordinador_data.sql'});
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
        await conn.query("DROP TABLE coordinador");
        conn.end();
    });

    describe('Test para seleccionar coordinadores', () => {
        it ('devolver un array con los coordinadores', async () => {
            const esperado = [
                { id: 1, name: 'Óscar', lastname: 'Fernández', birthdate: '2001-04-10', email: 'oscar@gmail.com' },
                { id: 2, name: 'Ricardo', lastname: 'González', birthdate: '1995-05-05', email: 'ricardo@gmail.com' },
                { id: 3, name: 'Julieta', lastname: 'Maya', birthdate: '1977-07-17', email: 'julieta@gmail.com' }
            ];
            const resultado = await CoordinadorDAO.selectAllUsers();
            assert.deepEqual(resultado, esperado);
        });
    });

    describe('Test para seleccionar profesor por ID', () => {
        it ('devolver un objeto con el profesor y el id correspondiente', async () => {
            const usuario1 = { id: 1, name: 'Óscar', lastname: 'Fernández', birthdate: '2001-04-10', email: 'oscar@gmail.com' };
            const resultado1 = await CoordinadorDAO.selectCoordinadorById(1);

            assert.deepEqual(resultado1, usuario1);
        });
    });

    describe('Test para insertar un Coordinador', () => {
        it ('debería insertar un nuevo Coordinador', async () => {
            assert.rejects(CoordinadorDAO.insertCoordinador({ lastname: 'Kiara', birthdate: '2003-08-20' }),
               { name: 'SqlError', sqlMessage: "no puede estar vacío" }, 
            );
            assert.rejects(CoordinadorDAO.insertCoordinador({ name: 'Joel', birthdate: '2003-08-20' }),
                { name: 'SqlError', sqlMessage: "no puede estar vacío" },
            );
            assert.rejects(CoordinadorDAO.insertCoordinador({ name: 'Joel', lastname: 'Kiara'}),
                { name: 'SqlError', sqlMessage: "no puede estar vacío" },
            );
        });
    });

    describe('Test para actualizar un Coordinador', () => {
        it ('debería actualizar un Coordinador existente', async () => {
            const expected = { affectedRows: 1, insertId: 0, warningStatus: 0 };
            const CoordinadorActualizado = { id: 1, name: 'Jorge', lastname: 'Vargas', birthdate: '1976-03-11'};
            const resultado = await CoordinadorDAO.updateCoordinador(CoordinadorActualizado);
            assert.equal(resultado.affectedRows, expected.affectedRows);
            assert.equal(resultado.insertId, expected.insertId);
            assert.equal(resultado.warningStatus, expected.warningStatus);
        });
    });

    describe('Test para eliminar un Coordinador', () => {
        it ('deberia de eliminar un Coordinador existente', async () => {
            const idEliminar = 2;
            const CoordinadorResultado = await CoordinadorDAO.deleteCoordinador(idEliminar);
            const CoordinadorEliminado = await CoordinadorDAO.selectCoordinadorById(CoordinadorResultado);
            assert.deepEqual(CoordinadorEliminado, 0);
        });
    });
});