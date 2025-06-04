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
  const [dt_pedido, setPedido] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [nome, setNome] = useState("");
  const [partido, setPartido] = useState("");
  const [status_compromisso, setStatuscompromisso] = useState("");
  const [uf, setUf] = useState("");

  const [formError, setFormError] = useState("");

  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument("tasks");

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    const now = new Date().toLocaleString("pt-BR");

    // check values (sem dt_inclusao e dt_edicao pois são automáticos)
    const camposObrigatorios = [
      cargo,
      dt_marcada,
      dt_pedido,
      empresa,
      nome,
      partido,
      status_compromisso,
      uf
    ];

    if (camposObrigatorios.some((campo) => !campo)) {
      setFormError("Por favor, preencha todos os campos!");
      return;
    }

    if (formError) return;

    insertDocument({
      cargo,
      dt_edicao: now,
      dt_marcada,
      dt_pedido,
      empresa,
      nome,
      partido,
      status_compromisso,
      uf,
      uid: user.uid,
      user: user.displayName,
    });

    // Limpar campos após envio
    setCargo("");
    setDtmarcada("");
    setPedido("");
    setEmpresa("");
    setNome("");
    setPartido("");
    setStatuscompromisso("");
    setUf("");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.input__task}>
        <label>
          <input 
            type="text" 
            name="cargo" 
            list="cargoOptions"
            required 
            placeholder="Cargo"
            autoComplete="off"
            onChange={(e) => setCargo(e.target.value)}
            value={cargo}
          />
          <datalist id="cargoOptions">
            <option value="Empresário" />
            <option value="Secretário" />
            <option value="Senador" />
            <option value="Ministro" />
            <option value="Deputado" />
          </datalist>
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
            type="datetime-local" 
            name="dt_marcada" 
            required 
            placeholder="Data Agendada"
            autoComplete="off"
            onChange={(e) => setDtmarcada(e.target.value)}
            value={dt_marcada}
          />
        </label>      

        <label>
          <input 
            type="text" 
            name="empresa" 
            list="empresas"
            required 
            placeholder="Empresa"
            autoComplete="off"
            onChange={(e) => setEmpresa(e.target.value)}
            value={empresa}
          />
          <datalist id="empresas">
            <option value="Abragames" />
            <option value="Abeaço" />
            <option value="Grupo Petrópolis" />
            <option value="SIAESP" />
          </datalist>
        </label>

        <label>
          <input 
            type="text" 
            name="nome" 
            required 
            placeholder="Nome"
            autoComplete="off"
            onChange={(e) => setNome(e.target.value)}
            value={nome}
          />
        </label> 

        <label>
          <input 
            type="text" 
            name="partido" 
            list="partidoOptions"
            required 
            placeholder="Partido"
            autoComplete="off"
            onChange={(e) => setPartido(e.target.value)}
            value={partido}
          />
          <datalist id="partidoOptions">
            <option value="Sem Partido" />
            <option value="PT" />
            <option value="PSDB" />
          </datalist>
        </label>
               
        <label>
          <input 
            type="text" 
            name="status_compromisso" 
            list="statusOptions"
            required 
            placeholder="Status"
            autoComplete="off"
            onChange={(e) => setStatuscompromisso(e.target.value)}
            value={status_compromisso}
          />
          <datalist id="statusOptions">
            <option value="Pendente" />
            <option value="Confirmada" />
            <option value="Cancelado" />
            <option value="Concluída" />
          </datalist>
        </label>

        <label>
          <input 
            type="text" 
            name="uf" 
            list="ufOptions"
            required 
            placeholder="UF"
            autoComplete="off"
            onChange={(e) => setUf(e.target.value)}
            value={uf}
          />
          <datalist id="ufOptions">
            <option value="AC" />
            <option value="AL" />
            <option value="AP" />
            <option value="AM" />
            <option value="BA" />
            <option value="CE" />
            <option value="DF" />
            <option value="ES" />
            <option value="GO" />
            <option value="MA" />
            <option value="MT" />
            <option value="MS" />
            <option value="MG" />
            <option value="PA" />
            <option value="PB" />
            <option value="PR" />
            <option value="PE" />
            <option value="PI" />
            <option value="RJ" />
            <option value="RN" />
            <option value="RS" />
            <option value="RO" />
            <option value="RR" />
            <option value="SC" />
            <option value="SP" />
            <option value="SE" />
            <option value="TO" />
          </datalist>
        </label>
      
        {!response.loading && 
          <button type="submit" className={styles.btn__input}>
            <AddSharpIcon/>
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
