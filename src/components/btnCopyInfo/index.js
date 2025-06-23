/* global ClipboardItem */
import React from "react";
import styles from "./index.module.css";


const CopiarInfoBotao = ({ eventoSelecionado }) => {
  const copiarTodasInfos = () => {
    if (!eventoSelecionado) return;

    let html = `<div><strong>Detalhes do Evento</strong><br/>`;
    html += `<strong>Nome:</strong> ${eventoSelecionado.nome}<br/>`;
    html += `<strong>Empresa:</strong> ${eventoSelecionado.empresa}<br/>`;
    html += `<strong>Responsável:</strong> ${eventoSelecionado.responsavel}<br/>`;
    html += `<strong>Status:</strong> ${eventoSelecionado.status_compromisso}<br/>`;
    html += `<strong>Data Marcada:</strong> ${eventoSelecionado.dt_marcada}<br/>`;
    html += `<strong>Horário:</strong> ${eventoSelecionado.horario}<br/>`;
    html += `<strong>Cargo:</strong> ${eventoSelecionado.cargo}<br/>`;
    html += `<strong>Partido:</strong> ${eventoSelecionado.partido}<br/>`;
    html += `<strong>UF:</strong> ${eventoSelecionado.uf}<br/>`;
    html += `<strong>Alterado por:</strong> ${eventoSelecionado.user}<br/><br/>`;

    if (eventoSelecionado.observacoes && eventoSelecionado.observacoes.length > 0) {
      html += `<strong>Observações:</strong><br/>`;
      const obsOrdenadas = eventoSelecionado.observacoes
        .slice()
        .sort((a, b) => new Date(b.dt_insercao) - new Date(a.dt_insercao));
      obsOrdenadas.forEach((obs) => {
        html += `<em>${obs.dt_insercao}</em> - <strong>${obs.user}:</strong> ${obs.observacao}<br/>`;
      });
    }
    html += `</div>`;

    let textoPlano = `Detalhes do Evento\n`;
    textoPlano += `Nome: ${eventoSelecionado.nome}\n`;
    textoPlano += `Empresa: ${eventoSelecionado.empresa}\n`;
    textoPlano += `Responsável: ${eventoSelecionado.responsavel}\n`;
    textoPlano += `Status: ${eventoSelecionado.status_compromisso}\n`;
    textoPlano += `Data Marcada: ${eventoSelecionado.dt_marcada}\n`;
    textoPlano += `Horário: ${eventoSelecionado.horario}\n`;
    textoPlano += `Cargo: ${eventoSelecionado.cargo}\n`;
    textoPlano += `Partido: ${eventoSelecionado.partido}\n`;
    textoPlano += `UF: ${eventoSelecionado.uf}\n`;
    textoPlano += `Última Alteração: ${eventoSelecionado.user}\n\n`;

    if (eventoSelecionado.observacoes && eventoSelecionado.observacoes.length > 0) {
      textoPlano += `Observações:\n`;
      const obsOrdenadas = eventoSelecionado.observacoes
        .slice()
        .sort((a, b) => new Date(b.dt_insercao) - new Date(a.dt_insercao));
      obsOrdenadas.forEach((obs) => {
        textoPlano += `${obs.dt_insercao} - ${obs.user}: ${obs.observacao}\n`;
      });
    }

    if (navigator.clipboard && navigator.clipboard.write && typeof ClipboardItem !== "undefined") {
      const blobHtml = new Blob([html], { type: "text/html" });
      const blobText = new Blob([textoPlano], { type: "text/plain" });
      const data = [
        new ClipboardItem({
          "text/html": blobHtml,
          "text/plain": blobText,
        }),
      ];
      navigator.clipboard
        .write(data)
        .then(() => {
          alert("Informações copiadas com formatação para a área de transferência!");
        })
        .catch(() => {
          alert("Falha ao copiar as informações.");
        });
    } else {
      navigator.clipboard
        .writeText(textoPlano)
        .then(() => {
          alert("Informações copiadas para a área de transferência!");
        })
        .catch(() => {
          alert("Falha ao copiar as informações.");
        });
    }
  };

  return (
    <button onClick={copiarTodasInfos} className={styles.btnCopiar}>
      📋 Copiar
    </button>
  );
};

export default CopiarInfoBotao;
