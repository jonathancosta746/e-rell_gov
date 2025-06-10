import styles from "./index.module.css";

// hooks
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";

import { useState, useMemo } from "react";

// Material Design
import ClearSharpIcon from '@mui/icons-material/ClearSharp';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

const Tasks = () => {
  const { user } = useAuthValue();
  const uid = user.uid;

  const { documents: tasks } = useFetchDocuments("tasks", null, uid);
  const { deleteDocument } = useDeleteDocument("tasks");
  const { updateDocument } = useUpdateDocument("tasks");

  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [filtrosStatus, setFiltrosStatus] = useState([]);
  const [filtroAno, setFiltroAno] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [dadosEditados, setDadosEditados] = useState({});
  const [valoresOriginais, setValoresOriginais] = useState({});

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

  const handleEditar = (task) => {
    if (editandoId === task.id) {
      updateDocument(task.id, {
        ...dadosEditados,
        user: user.displayName || user.email,
      });
      setEditandoId(null);
    } else {
      setEditandoId(task.id);
      setDadosEditados({
        empresa: task.empresa,
        status_compromisso: task.status_compromisso,
        dt_marcada: task.dt_marcada,
        cargo: task.cargo,
        nome: task.nome,
        partido: task.partido,
        uf: task.uf,
      });
      setValoresOriginais({});
    }
  };

  const handleChange = (e, campo) => {
    const valor = campo === "dt_marcada"
      ? new Date(e.target.value).toISOString()
      : e.target.value;

    setDadosEditados((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleFocusClear = (campo, valorAtual) => (e) => {
    setValoresOriginais((prev) => ({
      ...prev,
      [campo]: valorAtual || "",
    }));
    e.target.value = "";
    handleChange({ target: { value: "" } }, campo);
  };

  const handleBlurRestore = (campo) => (e) => {
    const valorAtual = e.target.value;
    if (!valorAtual && valoresOriginais[campo] !== undefined) {
      setDadosEditados((prev) => ({
        ...prev,
        [campo]: valoresOriginais[campo],
      }));
    }
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

  const anosUnicos = useMemo(() => {
    const anos = tasks?.map(task => {
      const data = new Date(task.dt_marcada);
      return data.getFullYear();
    }).filter(ano => !isNaN(ano)) || [];

    return [...new Set(anos)].sort((a, b) => b - a);
  }, [tasks]);

  const toggleStatus = (status) => {
    setFiltrosStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const tarefasFiltradas = useMemo(() => {
    return tasks?.filter((task) => {
      const filtraEmpresa = filtroEmpresa ? task.empresa === filtroEmpresa : true;
      const filtraStatus = filtrosStatus.length > 0 ? filtrosStatus.includes(task.status_compromisso) : true;
      const filtraAno = filtroAno ? new Date(task.dt_marcada).getFullYear().toString() === filtroAno : true;
      return filtraEmpresa && filtraStatus && filtraAno;
    }) || [];
  }, [tasks, filtroEmpresa, filtrosStatus, filtroAno]);

  return (
    <div className={styles.dashboard}>
      {tasks && tasks.length === 0 ? (
        <div className={styles.notask}>
          <p>Olá <span>{userName}</span>. Salve suas tarefas</p>
        </div>
      ) : (
        <>
          <p>Olá <span>{userName}</span>. Este é o calendário de eventos</p>

          <div className={styles.filtros}>
            <select value={filtroEmpresa} onChange={(e) => setFiltroEmpresa(e.target.value)}>
              <option value="">Todas as empresas</option>
              {empresasUnicas.map((empresa) => (
                <option key={empresa} value={empresa}>{empresa}</option>
              ))}
            </select>

            <select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)}>
              <option value="">Todos os anos</option>
              {anosUnicos.map((ano) => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>

            <div className={styles.checkboxContainer}>
              {statusUnicos.map((status) => (
                <label key={status} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    value={status}
                    checked={filtrosStatus.includes(status)}
                    onChange={() => toggleStatus(status)}
                  />
                  {status}
                </label>
              ))}
            </div>
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
            {editandoId === task.id ? (
              <>
                <input
                  type="text"
                  list="empresas"
                  value={dadosEditados.empresa || ""}
                  onChange={(e) => handleChange(e, "empresa")}
                  onFocus={handleFocusClear("empresa", task.empresa)}
                  onBlur={handleBlurRestore("empresa")}
                />
                <input
                  type="text"
                  list="statusOptions"
                  value={dadosEditados.status_compromisso || ""}
                  onChange={(e) => handleChange(e, "status_compromisso")}
                  onFocus={handleFocusClear("status_compromisso", task.status_compromisso)}
                  onBlur={handleBlurRestore("status_compromisso")}
                />
                <p className={styles.nao_editavel}>{formatarDataHora(task.dt_pedido)}</p>
                <input
                  type="datetime-local"
                  value={
                    dadosEditados.dt_marcada
                      ? new Date(dadosEditados.dt_marcada).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) => handleChange(e, "dt_marcada")}
                  onFocus={handleFocusClear("dt_marcada", task.dt_marcada)}
                  onBlur={handleBlurRestore("dt_marcada")}
                />
                <input
                  type="text"
                  list="cargoOptions"
                  value={dadosEditados.cargo || ""}
                  onChange={(e) => handleChange(e, "cargo")}
                  onFocus={handleFocusClear("cargo", task.cargo)}
                  onBlur={handleBlurRestore("cargo")}
                />
                <input
                  type="text"
                  value={dadosEditados.nome || ""}
                  onChange={(e) => handleChange(e, "nome")}
                  onFocus={handleFocusClear("nome", task.nome)}
                  onBlur={handleBlurRestore("nome")}
                />
                <input
                  type="text"
                  list="partidoOptions"
                  value={dadosEditados.partido || ""}
                  onChange={(e) => handleChange(e, "partido")}
                  onFocus={handleFocusClear("partido", task.partido)}
                  onBlur={handleBlurRestore("partido")}
                />
                <input
                  type="text"
                  list="ufOptions"
                  value={dadosEditados.uf || ""}
                  onChange={(e) => handleChange(e, "uf")}
                  onFocus={handleFocusClear("uf", task.uf)}
                  onBlur={handleBlurRestore("uf")}
                />
                <p className={styles.nao_editavel}>{task.user}</p>
              </>
            ) : (
              <>
                <p>{task.empresa}</p>
                <p className={`${styles.status} ${
                  task.status_compromisso === "Confirmado"
                    ? styles.confirmado
                    : task.status_compromisso === "Cancelado"
                    ? styles.cancelado
                    : task.status_compromisso === "Concluído"
                    ? styles.concluido
                    : styles.pendente
                }`}>{task.status_compromisso}</p>
                <p>{formatarDataHora(task.dt_pedido)}</p>
                <p>{formatarDataHora(task.dt_marcada)}</p>
                <p>{task.cargo}</p>
                <p>{task.nome}</p>
                <p>{task.partido}</p>
                <p>{task.uf}</p>
                <p>{task.user}</p>
              </>
            )}
            <div className={styles.actions}>
              <button onClick={() => handleEditar(task)} className={styles.btn_edit}>
                {editandoId === task.id ? <CheckIcon /> : <EditIcon />}
              </button>
              <button onClick={() => deleteDocument(task.id)} className={styles.btn_delete}>
                <ClearSharpIcon />
              </button>
            </div>
          </div>
        ))}

        {/* DATALISTS */}
        <datalist id="empresas">
          <option value="Abragames" />
          <option value="Abeaço" />
          <option value="Grupo Petrópolis" />
          <option value="SIAESP" />
        </datalist>

        <datalist id="statusOptions">
          <option value="Pendente" />
          <option value="Confirmado" />
          <option value="Cancelado" />
          <option value="Concluído" />
        </datalist>

        <datalist id="cargoOptions">
          <option value="Empresário" />
          <option value="Secretário" />
          <option value="Senador" />
          <option value="Ministro" />
          <option value="Deputado" />
        </datalist>

        <datalist id="partidoOptions">
          <option value="Sem Partido" />
          <option value="PT" />
          <option value="PSDB" />
        </datalist>

        <datalist id="ufOptions">
          <option value="AC" /><option value="AL" /><option value="AP" />
          <option value="AM" /><option value="BA" /><option value="CE" />
          <option value="DF" /><option value="ES" /><option value="GO" />
          <option value="MA" /><option value="MT" /><option value="MS" />
          <option value="MG" /><option value="PA" /><option value="PB" />
          <option value="PR" /><option value="PE" /><option value="PI" />
          <option value="RJ" /><option value="RN" /><option value="RS" />
          <option value="RO" /><option value="RR" /><option value="SC" />
          <option value="SP" /><option value="SE" /><option value="TO" />
        </datalist>
      </div>
    </div>
  );
};

export default Tasks;
