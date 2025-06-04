import { NavLink } from "react-router-dom";

import styles from "./index.module.css";

import { useAuthentication } from "../../hooks/useAuthentication";

import { useAuthValue } from "../../context/AuthContext";

import Logo from "../images/Logo e favicon-03.avif"
const NavBar = () => {

  const {user} = useAuthValue();
  const {logout} = useAuthentication();

  return (
    <nav className={styles.navbar}>
        <img src={Logo} alt="E-REL GOV" className={styles.logo}/>
        <ul className={styles.links_list}>
            {!user && (
                <>
                    <li>
                        <NavLink 
                            to="/login"
                            className={({isActive}) => (isActive ? styles.active : styles.no__active)}
                                >Entrar
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/register"
                            className={({isActive}) => (isActive ? styles.active : styles.no__active)}
                                >Cadastrar
                        </NavLink>
                    </li>
                </>
            )}
            {user && (
                <>
                <li>
                    <NavLink 
                        to="/"
                        className={({isActive}) => (isActive ? styles.active : styles.no__active)}
                        >Calendario
                    </NavLink>
                </li>
               
            </>
            )}
            <li>
                <NavLink 
                  to="/about" 
                  className={({isActive}) => (isActive ? styles.active : styles.no__active)}>Sobre
                </NavLink>
            </li>
            {user && (
                <li>
                    <button className={styles.btn_sair} onClick={logout}>Sair</button>
                </li>
            )}
        </ul>
    </nav>
  );
};

export default NavBar