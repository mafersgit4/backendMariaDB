"use strict"

import { strict as assert } from "node:assert";
import { afterEach, beforeEach, describe, it} from 'node:test';
import { createConnection } from 'mariadb';
import ProfesorDAO from "../../main/js/model/profesorDAO.js";

describe('Test ProfesorDAO class', () => {
    beforeEach(async () => {
        const conn = await createConnection({
            database: 'ecommerce',
            host: "localhost",
            user: "root",
            password: "root!",
            trace: true
        });
        await conn.importFile({file: '../../main/sql/createProfesorTable.sql'});
        await conn.importFile({file: '../sql/profesor_data.sql'});
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
        await conn.query("DROP TABLE profesor");
        conn.end();
    });

    describe('Test para seleccionar profesores', () => {
        it ('devolver un array con los profesores', async () => {
            const esperado = [
                { id: 1, name: 'José', lastname: 'Padilla', birthdate: '2004-08-24', email: 'jose@gmail.com'},
                { id: 2, name: 'Héctor', lastname: 'Villa', birthdate: '1991-03-18', email: 'hector@gmail.com'},
                { id: 3, name: 'Ilse', lastname: 'Gleason', birthdate: '1975-02-08', email: 'ilse@gmail.com'}
            ];
            const resultado = await ProfesorDAO.selectAllUsers();
            assert.deepEqual(resultado, esperado);
        });
    });

    describe('Test para seleccionar profesor por ID', () => {
        it ('devolver un objeto con el profesor y el id correspondiente', async () => {
            const usuario1 = { id: 1, name: 'José', lastname: 'Padilla', birthdate: '2004-08-24', email: 'jose@gmail.com' };
            const resultado1 = await ProfesorDAO.selectProfesorById(1);

            assert.deepEqual(resultado1, usuario1);
        });
    });

    describe('Test para insertar un Profesor', () => {
        it ('debería insertar un nuevo Profesor', async () => {
            assert.rejects(ProfesorDAO.insertProfesor({ lastname: 'Kiara', birthdate: '2003-08-20' }),
               { name: 'SqlError', sqlMessage: "no puede estar vacío" }, 
            );
            assert.rejects(ProfesorDAO.insertProfesor({ name: 'Joel', birthdate: '2003-08-20' }),
                { name: 'SqlError', sqlMessage: "no puede estar vacío" },
            );
            assert.rejects(ProfesorDAO.insertProfesor({ name: 'Joel', lastname: 'Kiara'}),
                { name: 'SqlError', sqlMessage: "no puede estar vacío" },
            );
        });
    });

    describe('Test para actualizar un Profesor', () => {
        it ('debería actualizar un Profesor existente', async () => {
            const expected = { affectedRows: 1, insertId: 0, warningStatus: 0 };
            const ProfesorActualizado = { id: 1, name: 'Jorge', lastname: 'Vargas', birthdate: '1976-03-11'};
            const resultado = await ProfesorDAO.updateProfesor(ProfesorActualizado);
            assert.equal(resultado.affectedRows, expected.affectedRows);
            assert.equal(resultado.insertId, expected.insertId);
            assert.equal(resultado.warningStatus, expected.warningStatus);
        });
    });

    describe('Test para eliminar un Profesor', () => {
        it ('deberia de eliminar un Profesor existente', async () => {
            const idEliminar = 2;
            const ProfesorResultado = await ProfesorDAO.deleteProfesor(idEliminar);
            const ProfesorEliminado = await ProfesorDAO.selectProfesorById(ProfesorResultado);
            assert.deepEqual(ProfesorEliminado, 0);
        });
    });


});
