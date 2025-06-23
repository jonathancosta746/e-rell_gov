import styles from "./index.module.css";

// hooks
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";

import { useState, useMemo, useEffect } from "react";

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
  const [filtroMes, setFiltroMes] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [dadosEditados, setDadosEditados] = useState({});
  const [valoresOriginais, setValoresOriginais] = useState({});
  const [observacoesAbertas, setObservacoesAbertas] = useState([]);

  // Novos estados para observações
  const [novaObsTexto, setNovaObsTexto] = useState("");
  const [editandoObsId, setEditandoObsId] = useState(null); // agora guarda dt_insercao da obs editada
  const [textoObsEditada, setTextoObsEditada] = useState("");

  // Inicializa filtro mês e ano atuais ao montar componente
  useEffect(() => {
    const hoje = new Date();
    const mesAtual = String(hoje.getMonth() + 1).padStart(2, "0"); // "01" a "12"
    const anoAtual = String(hoje.getFullYear());

    setFiltroMes(mesAtual);
    setFiltroAno(anoAtual);
  }, []);

  const toggleObservacoes = (id) => {
    setObservacoesAbertas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setEditandoObsId(null);
    setTextoObsEditada("");
    setNovaObsTexto("");
  };

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
        dt_marcada: task.dt_marcada ? task.dt_marcada.slice(0, 10) : "",
        horario: task.horario || "",
        cargo: task.cargo,
        nome: task.nome,
        partido: task.partido,
        uf: task.uf,
        responsavel: task.responsavel || "",
      });
      setValoresOriginais({});
    }
  };

  const handleChange = (e, campo) => {
    const valor = e.target.value;

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

  // Função para adicionar nova observação
  const adicionarObservacao = (taskId) => {
    if (!novaObsTexto.trim()) return;

    const tarefa = tasks.find(t => t.id === taskId);
    if (!tarefa) return;

    const novaObs = {
      observacao: novaObsTexto,
      user: user.displayName || user.email,
      dt_insercao: new Date().toLocaleString(),
    };

    const observacoesAtualizadas = [...(tarefa.observacoes || []), novaObs];

    updateDocument(taskId, { observacoes: observacoesAtualizadas });
    setNovaObsTexto("");
  };

  // Função para salvar edição da observação
  const salvarEdicaoObservacao = (taskId, dt_insercao) => {
    if (!textoObsEditada.trim()) return;

    const tarefa = tasks.find(t => t.id === taskId);
    if (!tarefa) return;

    const novasObs = [...(tarefa.observacoes || [])];
    const index = novasObs.findIndex(obs => obs.dt_insercao === dt_insercao);
    if (index === -1) return;

    novasObs[index] = {
      ...novasObs[index],
      observacao: textoObsEditada,
      dt_insercao: new Date().toLocaleString(),
    };

    updateDocument(taskId, { observacoes: novasObs });
    setEditandoObsId(null);
    setTextoObsEditada("");
  };

  // Função para excluir uma observação
  const excluirObservacao = (taskId, dt_insercao) => {
    const tarefa = tasks.find(t => t.id === taskId);
    if (!tarefa) return;

    const novasObs = (tarefa.observacoes || []).filter(obs => obs.dt_insercao !== dt_insercao);

    updateDocument(taskId, { observacoes: novasObs });

    if (editandoObsId === dt_insercao) {
      setEditandoObsId(null);
      setTextoObsEditada("");
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

      let filtraMes = true;
      if (filtroMes) {
        const dt = new Date(task.dt_marcada);
        if (!isNaN(dt)) {
          const mes = String(dt.getMonth() + 1).padStart(2, "0");
          filtraMes = mes === filtroMes;
        } else {
          filtraMes = false;
        }
      }

      return filtraEmpresa && filtraStatus && filtraAno && filtraMes;
    }) || [];
  }, [tasks, filtroEmpresa, filtrosStatus, filtroAno, filtroMes]);

  // Função para converter dt_insercao string para Date
  const parseDate = (str) => {
    if (!str) return new Date(0);
    const [datePart, timePart] = str.split(", ");
    const [day, month, year] = datePart.split("/");
    return new Date(`${year}-${month}-${day}T${timePart}`);
  };

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

            <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
              <option value="">Todos os meses</option>
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
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
          <p>Horário</p>
          <p>Cargo</p>
          <p>Nome</p>
          <p>Partido</p>
          <p>UF</p>
          <p>Responsável</p>
          <p>Alterado por</p>
        </div>

        {tarefasFiltradas.map((task) => (
          <div key={task.id}>
            <div className={styles.task_row}>
              {editandoId === task.id ? (
                <>
                  <input type="text" list="empresas" value={dadosEditados.empresa || ""} onChange={(e) => handleChange(e, "empresa")} onFocus={handleFocusClear("empresa", task.empresa)} onBlur={handleBlurRestore("empresa")} />
                  <input type="text" list="statusOptions" value={dadosEditados.status_compromisso || ""} onChange={(e) => handleChange(e, "status_compromisso")} onFocus={handleFocusClear("status_compromisso", task.status_compromisso)} onBlur={handleBlurRestore("status_compromisso")} />
                  <p className={styles.nao_editavel}>{formatarDataHora(task.dt_pedido)}</p>
                  <input type="date" value={dadosEditados.dt_marcada || ""} onChange={(e) => handleChange(e, "dt_marcada")} onFocus={handleFocusClear("dt_marcada", task.dt_marcada)} onBlur={handleBlurRestore("dt_marcada")} style={{ width: "130px" }} />
                  <input type="time" value={dadosEditados.horario || ""} onChange={(e) => handleChange(e, "horario")} onFocus={handleFocusClear("horario", task.horario)} onBlur={handleBlurRestore("horario")} style={{ width: "90px" }} />
                  <input type="text" list="cargoOptions" value={dadosEditados.cargo || ""} onChange={(e) => handleChange(e, "cargo")} onFocus={handleFocusClear("cargo", task.cargo)} onBlur={handleBlurRestore("cargo")} />
                  <input type="text" value={dadosEditados.nome || ""} onChange={(e) => handleChange(e, "nome")} onFocus={handleFocusClear("nome", task.nome)} onBlur={handleBlurRestore("nome")} />
                  <input type="text" list="partidoOptions" value={dadosEditados.partido || ""} onChange={(e) => handleChange(e, "partido")} onFocus={handleFocusClear("partido", task.partido)} onBlur={handleBlurRestore("partido")} />
                  <input type="text" list="ufOptions" value={dadosEditados.uf || ""} onChange={(e) => handleChange(e, "uf")} onFocus={handleFocusClear("uf", task.uf)} onBlur={handleBlurRestore("uf")} />
                  <input type="text" value={dadosEditados.responsavel || ""} onChange={(e) => handleChange(e, "responsavel")} onFocus={handleFocusClear("responsavel", task.responsavel)} onBlur={handleBlurRestore("responsavel")} />
                  <p className={styles.nao_editavel}>{task.user}</p>
                </>
              ) : (
                <>
                  <p>{task.empresa}</p>
                  <p className={`${styles.status} ${task.status_compromisso === "Confirmado" ? styles.confirmado : task.status_compromisso === "Cancelado" ? styles.cancelado : task.status_compromisso === "Concluído" ? styles.concluido : styles.pendente}`}>{task.status_compromisso}</p>
                  <p>{formatarDataHora(task.dt_pedido)}</p>
                  <p>{formatarDataHora(task.dt_marcada)}</p>
                  <p>{task.horario || "-"}</p>
                  <p>{task.cargo}</p>
                  <p>{task.nome}</p>
                  <p>{task.partido}</p>
                  <p>{task.uf}</p>
                  <p>{task.responsavel}</p>
                  <p>{task.user}</p>
                </>
              )}
              <div className={styles.actions}>
                <button onClick={() => handleEditar(task)} className={styles.btn_edit}>
                  {editandoId === task.id ? <CheckIcon /> : <EditIcon />}
                </button>
                <button onClick={() => toggleObservacoes(task.id)} className={styles.btn_expand} title="Ver observações">
                  📄
                </button>
                <button onClick={() => deleteDocument(task.id)} className={styles.btn_delete}>
                  <ClearSharpIcon />
                </button>
              </div>
            </div>

            {observacoesAbertas.includes(task.id) && (
              <div className={styles.observacoes}>
                {/* Botão e campo para adicionar nova observação */}
                <div className={styles.adicionarObservacao}>
                  <textarea
                    placeholder="Nova observação..."
                    value={novaObsTexto}
                    onChange={(e) => setNovaObsTexto(e.target.value)}
                    rows={3}
                    style={{ width: "100%", resize: "vertical" }}
                  />
                  <button onClick={() => adicionarObservacao(task.id)}>Adicionar Observação</button>
                </div>

                {task.observacoes && task.observacoes.length > 0 ? (
                  [...task.observacoes]
                    .sort((a, b) => parseDate(b.dt_insercao) - parseDate(a.dt_insercao))
                    .map((obs) => (
                      <div key={obs.dt_insercao} className={styles.obsItem} style={{ position: "relative" }}>
                        {editandoObsId === obs.dt_insercao ? (
                          <>
                            <textarea
                              value={textoObsEditada}
                              onChange={(e) => setTextoObsEditada(e.target.value)}
                              rows={3}
                              style={{ width: "100%", resize: "vertical" }}
                            />
                            <div>
                              <button onClick={() => salvarEdicaoObservacao(task.id, obs.dt_insercao)}>Salvar</button>
                              <button onClick={() => setEditandoObsId(null)}>Cancelar</button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={styles.observacao}>
                              <p>{obs.observacao}</p>
                            </div>
                            <div className={styles.informacao}>
                              <p><strong>Por:</strong> {obs.user}</p>
                              <p><strong>Data:</strong> {obs.dt_insercao}</p>
                            </div>

                            <button
                              onClick={() => {
                                setEditandoObsId(obs.dt_insercao);
                                setTextoObsEditada(obs.observacao);
                              }}
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "40px",
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                              }}
                              title="Editar Observação"
                            >
                              <EditIcon />
                            </button>

                            <button
                              onClick={() => excluirObservacao(task.id, obs.dt_insercao)}
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                              }}
                              title="Excluir Observação"
                            >
                              <ClearSharpIcon />
                            </button>
                          </>
                        )}
                      </div>
                    ))
                ) : (
                  <p>Nenhuma observação.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Listas para datalists usados nos inputs */}
      <datalist id="empresas">
        {empresasUnicas.map((empresa) => (
          <option key={empresa} value={empresa} />
        ))}
      </datalist>
      <datalist id="statusOptions">
        {statusUnicos.map((status) => (
          <option key={status} value={status} />
        ))}
      </datalist>
      <datalist id="cargoOptions">
        {/* Preencha com cargos relevantes */}
        <option value="Gerente" />
        <option value="Analista" />
        <option value="Supervisor" />
      </datalist>
      <datalist id="partidoOptions">
        {/* Preencha com partidos relevantes */}
        <option value="PT" />
        <option value="PSDB" />
        <option value="MDB" />
      </datalist>
      <datalist id="ufOptions">
        {/* Preencha com UFs */}
        <option value="SP" />
        <option value="RJ" />
        <option value="MG" />
        <option value="DF" />
      </datalist>
    </div>
  );
};

export default Tasks;
