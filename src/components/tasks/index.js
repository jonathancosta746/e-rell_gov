import styles from "./index.module.css"

//hooks
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

//Material Design
import ClearSharpIcon from '@mui/icons-material/ClearSharp';


const Tasks = () => {
  const { user } = useAuthValue();
  const uid = user.uid

  const { documents: tasks} = useFetchDocuments("tasks", null, uid);

  const {deleteDocument} = useDeleteDocument("tasks");

  const formatarDataHora = (dataISO) => {
    if (!dataISO) return "";

    const data = new Date(dataISO);

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    // Verifica se o ISO inclui tempo (Txx:xx)
    const incluiHora = dataISO.includes('T');

    return incluiHora
      ? `${dia}/${mes}/${ano} ${horas}h${minutos}`
      : `${dia}/${mes}/${ano}`;
  };

  const userName = (user.displayName)?.split(" ")[0];

  return (
    <div className={styles.dashboard}>
      
      {tasks && tasks.length === 0 ? (
        <div className={styles.notask}>
          <p>Olá <span>{userName}</span>. Salve suas tarefas</p>
        </div>
      ) : (
        <p>Olá <span>{userName}</span>. Este é o calendario de eventos</p>
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
          {tasks &&
          tasks.map((task) => (
            <div className={styles.task_row} key={task.id}>
              <p>{task.empresa}</p>
              <p   className={`${styles.status} ${
                  task.status_compromisso === "Confirmada" ? styles.confirmado
                  : task.status_compromisso === "Cancelado" ? styles.cancelado
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