import styles from "./index.module.css";
import { useState } from "react";

// hooks
import { useInsertDocument } from "../../hooks/useInsertDocument";
import { useAuthValue } from "../../context/AuthContext";

// Material Design
import AddSharpIcon from '@mui/icons-material/AddSharp';

const CreateTask = () => {
  const [cargo, setCargo] = useState("");
  const [dt_marcada, setDtmarcada] = useState("");
  const [horario, setHorario] = useState("");
  const [dt_pedido, setPedido] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [nome, setNome] = useState("");
  const [partido, setPartido] = useState("");
  const [status_compromisso, setStatuscompromisso] = useState("");
  const [uf, setUf] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [observacao, setObservacao] = useState("");

  const [formError, setFormError] = useState("");

  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument("tasks");

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    const camposObrigatorios = [
      cargo,
      dt_marcada,
      horario,
      dt_pedido,
      empresa,
      nome,
      partido,
      status_compromisso,
      uf,
      responsavel,
    ];

    if (camposObrigatorios.some((campo) => !campo)) {
      setFormError("Por favor, preencha todos os campos!");
      return;
    }

    if (formError) return;

    const now = new Date().toLocaleString("pt-BR");

    // Normaliza quebras de linha do campo observação
    const observacaoNormalizada = observacao
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");

    const observacoes = observacao
      ? [{
          observacao: observacaoNormalizada,
          dt_insercao: now,
          dt_edicao: now,
          user: user.displayName,
        }]
      : [];

    insertDocument({
      cargo,
      dt_edicao: now,
      dt_marcada,
      horario,
      dt_pedido,
      empresa,
      nome,
      partido,
      status_compromisso,
      uf,
      responsavel,
      observacoes,
      uid: user.uid,
      user: user.displayName,
    });

    // Limpar campos após envio
    setCargo("");
    setDtmarcada("");
    setHorario("");
    setPedido("");
    setEmpresa("");
    setNome("");
    setPartido("");
    setStatuscompromisso("");
    setUf("");
    setResponsavel("");
    setObservacao("");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.input__task}>
        {/* === CAMPOS DO FORMULÁRIO === */}

        {/* Cargo como select */}
        <label>
          <select
            name="cargo"
            required
            onChange={(e) => setCargo(e.target.value)}
            value={cargo}
          >
            <option value="" disabled>Selecione o Cargo</option>
            <option value="Empresário">Empresário</option>
            <option value="Secretário">Secretário</option>
            <option value="Senador">Senador</option>
            <option value="Ministro">Ministro</option>
            <option value="Deputado">Deputado</option>
          </select>
        </label>

        <label>
          <p>Data Pedido</p>
          <input 
            type="date" 
            name="dt_pedido" 
            required 
            onChange={(e) => setPedido(e.target.value)}
            value={dt_pedido}
          />
        </label>    

        <label>
          <p>Data Marcada</p>
          <input 
            type="date" 
            name="dt_marcada" 
            required 
            onChange={(e) => setDtmarcada(e.target.value)}
            value={dt_marcada}
          />
        </label>

        <label>
          <p>Horário</p>
          <input 
            type="time" 
            name="horario" 
            required 
            onChange={(e) => setHorario(e.target.value)}
            value={horario}
          />
        </label>

        {/* Campo Empresa como select */}
        <label>
          <select
            name="empresa"
            required
            onChange={(e) => setEmpresa(e.target.value)}
            value={empresa}
          >
            <option value="" disabled>Selecione a Empresa</option>
            <option value="Abragames">Abragames</option>
            <option value="Abeaço">Abeaço</option>
            <option value="Grupo Petrópolis">Grupo Petrópolis</option>
            <option value="SIAESP">SIAESP</option>
          </select>
        </label>

        <label>
          <input 
            type="text" 
            name="nome" 
            required 
            placeholder="Nome"
            onChange={(e) => setNome(e.target.value)}
            value={nome}
          />
        </label> 

        <label>
          <input 
            type="text" 
            name="partido" 
            list="partidoOptions" 
            placeholder="Partido"
            onChange={(e) => setPartido(e.target.value)}
            value={partido}
          />
          <datalist id="partidoOptions">
            <option value="Sem Partido" />
            <option value="PT" />
            <option value="PSDB" />
          </datalist>
        </label>
               
        {/* Campo Status como select */}
        <label>
          <select
            name="status_compromisso"
            required
            onChange={(e) => setStatuscompromisso(e.target.value)}
            value={status_compromisso}
          >
            <option value="" disabled>Selecione o Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Concluído">Concluído</option>
          </select>
        </label>

        {/* Campo UF como select */}
        <label>
          <select
            name="uf"
            required
            onChange={(e) => setUf(e.target.value)}
            value={uf}
          >
            <option value="" disabled>Selecione a UF</option>
            <option value="AC">AC</option>
            <option value="AL">AL</option>
            <option value="AP">AP</option>
            <option value="AM">AM</option>
            <option value="BA">BA</option>
            <option value="CE">CE</option>
            <option value="DF">DF</option>
            <option value="ES">ES</option>
            <option value="GO">GO</option>
            <option value="MA">MA</option>
            <option value="MT">MT</option>
            <option value="MS">MS</option>
            <option value="MG">MG</option>
            <option value="PA">PA</option>
            <option value="PB">PB</option>
            <option value="PR">PR</option>
            <option value="PE">PE</option>
            <option value="PI">PI</option>
            <option value="RJ">RJ</option>
            <option value="RN">RN</option>
            <option value="RS">RS</option>
            <option value="RO">RO</option>
            <option value="RR">RR</option>
            <option value="SC">SC</option>
            <option value="SP">SP</option>
            <option value="SE">SE</option>
            <option value="TO">TO</option>
          </select>
        </label>

        {/* Campo Responsável como select */}
        <label>
          <select
            name="responsavel"
            required
            onChange={(e) => setResponsavel(e.target.value)}
            value={responsavel}
          >
            <option value="" disabled>Selecione o Responsável</option>
            <option value="João Santos">João Santos</option>
            <option value="Dalila Costa">Dalila Costa</option>
            <option value="José Almeida">José Almeida</option>
          </select>
        </label>

        {/* CAMPO DE OBSERVAÇÃO */}
        <label>
          <textarea
            name="observacao"
            placeholder="Observações"
            rows={3}
            onChange={(e) => setObservacao(e.target.value)}
            value={observacao}
          />
        </label>
      
        {!response.loading && 
          <button type="submit" className={styles.btn__input}>
            <AddSharpIcon />
          </button>
        }

        {response.loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}

        {response.error && <p className="error">{response.error}</p>}
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

export default CreateTask;
