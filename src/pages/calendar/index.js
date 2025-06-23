import { useState } from "react";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useAuthValue } from "../../context/AuthContext";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth,
  isSameDay,
  format,
  parseISO,
} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import styles from "./index.module.css";

import CopiarInfoBotao from "../../components/btnCopyInfo/index";

const horas = Array.from({ length: 17 }, (_, i) => 6 + i); // Horário das 6h às 22h (6 + 16)

const Calendario = () => {
  const { user } = useAuthValue();
  const { documents: tasks } = useFetchDocuments("tasks", null, user?.uid);

  const [dataAtual, setDataAtual] = useState(new Date());
  const [visualizacao, setVisualizacao] = useState("mensal"); // "mensal" ou "semanal"

  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const abrirModal = (evento) => {
    setEventoSelecionado(evento);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEventoSelecionado(null);
  };

  // Filtra eventos do dia para o calendário mensal (como antes)
  const eventosDoDia = (data) => {
    return (
      tasks?.filter((task) => {
        if (!task.dt_marcada) return false;
        const dataEvento = parseISO(task.dt_marcada);
        return isSameDay(data, dataEvento);
      }) || []
    );
  };

  // Filtra eventos para dia e hora no semanal
  const eventosNoHorario = (dia, hora) => {
    return (
      tasks?.filter((task) => {
        if (!task.dt_marcada || !task.horario) return false;
        const dataEvento = parseISO(task.dt_marcada);
        if (!isSameDay(dia, dataEvento)) return false;

        // horário esperado no formato HH:mm (exemplo: "14:30")
        const [h] = task.horario.split(":").map(Number);

        // Verifica se a hora do evento corresponde à hora da célula
        // E se o minuto do evento está dentro de um "intervalo" para cair na célula da hora cheia
        // Por exemplo, se um evento é 14:15, ele ainda apareceria na célula das 14:00
        // Se você quiser que apareça APENAS em 14:00, use h === hora && m === 0;
        return h === hora;
      }) || []
    );
  };

  // Render Calendário Mensal (igual antes)
  const renderCalendarioMensal = () => {
    const inicioMes = startOfMonth(dataAtual);
    const fimMes = endOfMonth(dataAtual);
    const inicioGrade = startOfWeek(inicioMes, { weekStartsOn: 0 }); // domingo
    const fimGrade = endOfWeek(fimMes, { weekStartsOn: 0 });

    const dias = [];
    let dia = inicioGrade;
    while (dia <= fimGrade) {
      dias.push(dia);
      dia = addDays(dia, 1);
    }

    return (
      <>
        <div className={styles.diasSemana}>
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia, i) => (
            <div key={i} className={styles.diaSemana}>
              {dia}
            </div>
          ))}
        </div>

        <div className={styles.gradeMensal}>
          {dias.map((d, i) => (
            <div
              key={i}
              className={`${styles.dia} ${
                !isSameMonth(d, dataAtual) ? styles.foraDoMes : ""
              }`}
            >
              <div className={styles.numeroDia}>{format(d, "d")}</div>
              <div className={styles.eventosDia}>
                {eventosDoDia(d).map((ev, idx) => (
                <div
                    key={idx}
                    className={styles.evento}
                    onClick={() => abrirModal(ev)}
                    style={{ cursor: "pointer" }}
                >
                    <strong>{ev.nome} - {ev.horario}</strong>
                    <br />
                    <small>{ev.empresa}</small>
                    <br />
                    <small>
                    <em>{ev.responsavel}</em>
                    </small>
                    <br />
                </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  // Render Calendário Semanal estilo Google Agenda
  const renderCalendarioSemanal = () => {
    // Semana: segunda a domingo (pode ajustar para domingo se quiser)
    const inicioSemana = startOfWeek(dataAtual, { weekStartsOn: 1 });
    const fimSemana = endOfWeek(dataAtual, { weekStartsOn: 1 });

    const diasSemana = [];
    let dia = inicioSemana;
    while (dia <= fimSemana) {
      diasSemana.push(dia);
      dia = addDays(dia, 1);
    }

    return (
      <>
        {/* Cabeçalho com dias da semana */}
        <div className={styles.diasSemanaSemanal}>
          <div className={styles.diaSemanaSemanal}>Hora</div> {/* Coluna para "Hora" */}
          {diasSemana.map((d, i) => (
            <div key={i} className={styles.diaSemanaSemanal}>
              <div>{format(d, "EEE", { locale: ptBR })}</div>
              <div className="data">{format(d, "dd/MM", { locale: ptBR })}</div>
            </div>
          ))}
        </div>

        {/* Grade principal do calendário semanal */}
        <div className={styles.gradeSemanal}>
          {horas.map((hora) => (
            <div key={hora} className={styles.linhaHorario}> {/* Uma div para cada linha de horário */}
              <div className={styles.horaColuna}>
                {hora}:00
              </div>
              {diasSemana.map((dia, i) => {
                const eventos = eventosNoHorario(dia, hora);

                return (
                  <div key={`${hora}-${i}`} className={styles.celulaSemanal}>
                    {eventos.map((ev, idx) => (
                      <div
                        key={idx}
                        className={styles.eventoSemanal}
                        onClick={() => abrirModal(ev)}
                        title={`${ev.nome} - ${ev.empresa} (${ev.horario})`}
                        style={{ cursor: "pointer" }}
                      >
                        <span className={styles.eventoHorario}>{ev.horario}</span> - {ev.nome}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={styles.calendarioContainer}>
      <div className={styles.controleMes}>
        {visualizacao === "mensal" ? (
          <>
            <button onClick={() => setDataAtual(subMonths(dataAtual, 1))}>◀</button>
            <h2>{format(dataAtual, "MMMM yyyy", { locale: ptBR })}</h2> {/* Ajustei o formato para 'yyyy' */}
            <button onClick={() => setDataAtual(addMonths(dataAtual, 1))}>▶</button>
          </>
        ) : (
          <>
            <button onClick={() => setDataAtual(subWeeks(dataAtual, 1))}>◀</button>
            <h2>
              {`Semana de ${format(
                startOfWeek(dataAtual, { weekStartsOn: 1 }),
                "dd/MM"
              )} até ${format(endOfWeek(dataAtual, { weekStartsOn: 1 }), "dd/MM")}`}
            </h2>
            <button onClick={() => setDataAtual(addWeeks(dataAtual, 1))}>▶</button>
          </>
        )}

        <button
          style={{ marginLeft: "20px", padding: "6px 12px" }}
          onClick={() =>
            setVisualizacao(visualizacao === "mensal" ? "semanal" : "mensal")
          }
        >
          {visualizacao === "mensal" ? "Ver Semana" : "Ver Mês"}
        </button>
      </div>

      {visualizacao === "mensal" ? renderCalendarioMensal() : renderCalendarioSemanal()}

      {modalAberto && eventoSelecionado && (
        <div className={styles.modalOverlay} onClick={fecharModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <CopiarInfoBotao eventoSelecionado={eventoSelecionado} />
              <button onClick={fecharModal} className={styles.btnFechar}>
                Fechar
              </button>
            </div>

            <h3>Detalhes do Evento</h3>
            <p>
              <strong>Nome:</strong> {eventoSelecionado.nome}
            </p>
            <p>
              <strong>Empresa:</strong> {eventoSelecionado.empresa}
            </p>
            <p>
              <strong>Responsável:</strong> {eventoSelecionado.responsavel}
            </p>
            <p>
              <strong>Status:</strong> {eventoSelecionado.status_compromisso}
            </p>
            <p>
              <strong>Data Marcada:</strong> {eventoSelecionado.dt_marcada}
            </p>
            <p>
              <strong>Horário:</strong> {eventoSelecionado.horario}
            </p>
            <p>
              <strong>Cargo:</strong> {eventoSelecionado.cargo}
            </p>
            <p>
              <strong>Partido:</strong> {eventoSelecionado.partido}
            </p>
            <p>
              <strong>UF:</strong> {eventoSelecionado.uf}
            </p>
            <p>
              <strong>Última Alteração:</strong> {eventoSelecionado.user}
            </p>

            {/* Histórico de Observações */}
            {eventoSelecionado.observacoes && eventoSelecionado.observacoes.length > 0 && (
              <div className={styles.historicoObservacoes}>
                <h4>Observações:</h4>
                {eventoSelecionado.observacoes
                  .slice()
                  .sort((a, b) => new Date(b.dt_insercao) - new Date(a.dt_insercao))
                  .map((obs, index) => (
                    <div key={index} className={styles.observacaoItem}>
                      <p>{obs.observacao}</p>
                      <small>
                        <strong>Por:</strong> {obs.user}
                      </small>
                      <br />
                      <small>
                        <strong>Em:</strong> {obs.dt_insercao}
                      </small>
                      <hr />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;