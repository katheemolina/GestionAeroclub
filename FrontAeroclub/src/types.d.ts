declare global {
  interface Array<T> {
    toSorted(compareFn?: (a: T, b: T) => number): T[];
  }
}

export enum SortBy {
  NONE = "none",
  ASOCIADO = "asociado",
  CMA = "cma",
  CUOTA = "cuota",
  SALDO = "saldo",
}

export enum SortByTablaAdminUsuarios {
  NONE = "none",
  USUARIO = "usuario",
  DNI = "dni",
  NOMBRE = "nombre",
  MAIL = "mail",
}

export type Asociado = {
  email: string;
  nombreCompleto: string;
  cma: "Vencido" | "Al día";
  cuota: "Paga" | "Impaga";
  saldo: number;
};

export type Usuarios = {
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  email: string;
  telefono: number;
  dni: number;
  fechaAlta: string;
  fechaBaja: string;
  direccion: string;
  fotoPerfil: string;
};

export type Rol =
  | "Asociado"
  | "Administrador"
  | "Instructor"
  | "Mecánico"
  | "Gestor"
  | "Invitado";

export type Aeronaves = { modelo: string; patente: string; alerta: Alerta };

export type Alerta = "ok" | "peligro" | "advertencia";
