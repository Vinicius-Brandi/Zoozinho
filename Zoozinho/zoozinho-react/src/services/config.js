export const URL_API = "https://localhost:7100/api";

export function fomatarData(dataSemTratamento){
    const data = new Date(dataSemTratamento);

    const dia = String(data.getDate()).padStart(2,'0');
    const mes = String(data.getMonth()+1).padStart(2,'0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2,'0');
    const minutos = String(data.getMinutes()).padStart(2,'0');

    return `${dia}/${mes}/${ano}-${hora}:${minutos}`
}