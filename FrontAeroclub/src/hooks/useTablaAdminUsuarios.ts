import { useMemo, useState } from "react";
import { Usuarios, SortByTablaAdminUsuarios } from "../types.d";
import { usuarios } from "../mock/usuarios";

export function useTablaAdminUsuarios() {
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortByTablaAdminUsuarios>(
    SortByTablaAdminUsuarios.NONE
  );
  const [invertir, setInvertir] = useState(false);

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const handleChangeSort = (sort: SortByTablaAdminUsuarios) => {
    setSorting(sort);
  };

  const sortedUsuarios = useMemo(() => {
    if (sorting === SortByTablaAdminUsuarios.NONE) return usuarios;

    if (sorting === SortByTablaAdminUsuarios.DNI) {
      return invertir
        ? usuarios.sort((a, b) => a.dni - b.dni).reverse()
        : usuarios.sort((a, b) => a.dni - b.dni);
    }

    const compareProperties: Record<string, (usuario: Usuarios) => any> = {
      [SortByTablaAdminUsuarios.NOMBRE]: (asociado) => asociado.nombreCompleto,
      [SortByTablaAdminUsuarios.MAIL]: (asociado) => asociado.email,
    };

    return invertir
      ? usuarios
          .toSorted((a, b) => {
            const extractProperty = compareProperties[sorting];
            return extractProperty(a).localeCompare(extractProperty(b));
          })
          .reverse()
      : usuarios.toSorted((a, b) => {
          const extractProperty = compareProperties[sorting];
          return extractProperty(a).localeCompare(extractProperty(b));
        });
  }, [usuarios, sorting, invertir]);

  return {
    toggleColors,
    usuarios,
    showColors,
    handleChangeSort,
    sortedUsuarios,
    setInvertir,
    invertir,
  };
}
