import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useHeader() {
  const navigate = useNavigate();

  //este state lo utilizo para saber si aprete el boton para cerrar
  //o abrir la ventana, dependiendo si es true o false
  const [openWindow, setOpenWindow] = useState(false);

  const [openMenu, setOpenMenu] = useState(false);

  const [openMenuResponsive, setOpenMenuResponsive] = useState(false);

  const actionMenuResponsive = (e: any) => {
    e.preventDefault();

    setOpenMenuResponsive(!openMenuResponsive);
  };

  const actionMenu = (e: any) => {
    e.preventDefault();

    setOpenMenu(!openMenu);
  };

  const desplegarVentana = () => {
    setOpenWindow(true);
  };

  const cerrarVentana = () => {
    setOpenWindow(false);
  };

  //con esta funcion chequeo si existe un token en el localstorage
  // si existe entonces puedo entrar a mis datos y sino voy a signin
  const onClickToSignIn = () => {
    if (localStorage.getItem("Token")) {
      navigate("/mis-pets-perdidas", { replace: true });
    } else {
      alert("No has iniciado sesión, te redirigimos al login");
      navigate("/sign-in", { replace: true });
    }
  };

  return {
    openMenu,
    openWindow,
    openMenuResponsive,
    cerrarVentana,
    desplegarVentana,
    actionMenu,
    actionMenuResponsive,
    navigate,
  };
}
