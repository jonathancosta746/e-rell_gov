import styles from "./index.module.css";

// hooks
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

import { useState, useMemo } from "react";

// Material Design
import ClearSharpIcon from '@mui/icons-material/ClearSharp';

const Tasks = () => {
  const { user } = useAuthValue();
  const uid = user.uid;

  const { documents: tasks } = useFetchDocuments("tasks", null, uid);
  const { deleteDocument } = useDeleteDocument("tasks");

  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  const formatarDataHora = (dataISO) => {
    if (!dataISO) return "";

    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    const incluiHora = dataISO.includes('T');

    return incluiHora
      ? `${dia}/${mes}/${ano} ${horas}h${minutos}`
      : `${dia}/${mes}/${ano}`;
  };

  const userName = (user.displayName)?.split(" ")[0];

  const empresasUnicas = useMemo(() => {
    const empresas = tasks?.map(task => task.empresa) || [];
    return [...new Set(empresas)];
  }, [tasks]);

  const statusUnicos = useMemo(() => {
    const status = tasks?.map(task => task.status_compromisso) || [];
    return [...new Set(status)];
  }, [tasks]);

  const tarefasFiltradas = useMemo(() => {
    return tasks?.filter((task) => {
      const filtraEmpresa = filtroEmpresa ? task.empresa === filtroEmpresa : true;
      const filtraStatus = filtroStatus ? task.status_compromisso === filtroStatus : true;
      return filtraEmpresa && filtraStatus;
    }) || [];
  }, [tasks, filtroEmpresa, filtroStatus]);

  return (
    <div className={styles.dashboard}>
      {tasks && tasks.length === 0 ? (
        <div className={styles.notask}>
          <p>Olá <span>{userName}</span>. Salve suas tarefas</p>
        </div>
      ) : (
        <>
          <p>Olá <span>{userName}</span>. Este é o calendário de eventos</p>

          {/* Filtros */}
          <div className={styles.filtros}>
            <select value={filtroEmpresa} onChange={(e) => setFiltroEmpresa(e.target.value)}>
              <option value="">Todas as empresas</option>
              {empresasUnicas.map((empresa) => (
                <option key={empresa} value={empresa}>{empresa}</option>
              ))}
            </select>

            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="">Todos os status</option>
              {statusUnicos.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className={styles.taks__area}>
        <div className={styles.cabecalho}>
          <p>Empresa</p>
          <p>Status</p>
          <p>Data do Pedido</p>
          <p>Data Marcada</p>
          <p>Cargo</p>
          <p>Nome</p>
          <p>Partido</p>
          <p>UF</p>
          <p>Alterado por</p>
        </div>

        {tarefasFiltradas.map((task) => (
          <div className={styles.task_row} key={task.id}>
            <p>{task.empresa}</p>
            <p className={`${styles.status} ${
              task.status_compromisso === "Confirmado" ? styles.confirmado
              : task.status_compromisso === "Cancelado" ? styles.cancelado
              : task.status_compromisso === "Concluído" ? styles.concluido
              : styles.pendente
            }`}>{task.status_compromisso}</p>
            <p>{formatarDataHora(task.dt_pedido)}</p>
            <p>{formatarDataHora(task.dt_marcada)}</p>
            <p>{task.cargo}</p>
            <p>{task.nome}</p>
            <p>{task.partido}</p>
            <p>{task.uf}</p>  
            <p>{task.user}</p>  
            <div className={styles.actions}>
              <button
                onClick={() => deleteDocument(task.id)}
                className={styles.btn__delete}
              >
                <ClearSharpIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
