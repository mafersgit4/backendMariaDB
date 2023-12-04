"use strict"

export default class User {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }

  get id () {
    return id;
  }

  set id (value) {
    id = value;
  }

  get nombre () {
    return nombre;
  }

  set nombre (value) {
    nombre = value;
  }

}

