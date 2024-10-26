import { useMemo, useState } from "react";
import { Asociado, SortBy } from "../types.d";
import { asociados } from "../mock/asociados";

export function useTablaAsociadosPanelAdmin() {
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [invertir, setInvertir] = useState(false);

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const sortedAsociados = useMemo(() => {
    if (sorting === SortBy.NONE) return asociados;

    /*
  ASOCIADO = "asociado",
  CMA = "cma",
  CUOTA = "cuota",
  SALDO = "saldo",
    */

    if (sorting === SortBy.SALDO) {
      return invertir
        ? asociados.sort((a, b) => a.saldo - b.saldo).reverse()
        : asociados.sort((a, b) => a.saldo - b.saldo);
    }

    const compareProperties: Record<string, (asociado: Asociado) => any> = {
      [SortBy.ASOCIADO]: (asociado) => asociado.nombreCompleto,
      [SortBy.CMA]: (asociado) => asociado.cma,
      [SortBy.CUOTA]: (asociado) => asociado.cuota,
    };

    return invertir
      ? asociados
          .toSorted((a, b) => {
            const extractProperty = compareProperties[sorting];
            return extractProperty(a).localeCompare(extractProperty(b));
          })
          .reverse()
      : asociados.toSorted((a, b) => {
          const extractProperty = compareProperties[sorting];
          return extractProperty(a).localeCompare(extractProperty(b));
        });
  }, [asociados, sorting, invertir]);

  return {
    toggleColors,
    asociados,
    showColors,
    handleChangeSort,
    sortedAsociados,
    setInvertir,
    invertir,
  };
}
