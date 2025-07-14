import { URL_API } from "./config";


const url_galpao = `${URL_API}/galpao`;

export async function cadastrarGalpao(galpaoDTO) {
    const response = await fetch(url_galpao, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(galpaoDTO)
    });
    if (!response.ok) {
        const errors = await response.json();
        throw errors;
    }
    return await response.json();
}

export async function mostrarGalpao() {
    const response = await fetch(url_galpao);
    if (!response.ok) throw new Error("Nenhum galpão cadastrado");
    return await response.json();
}

export async function atualizarGalpao(galpaoDTO) {
    const response = await fetch(url_galpao, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(galpaoDTO)
    });
    if (!response.ok) {
        const errors = await response.json();
        throw errors;
    }
    return await response.json();
}

export async function listarAnimaisGalpao() {
    const response = await fetch(`${url_galpao}/animais`);
    if (!response.ok) throw new Error("Erro ao listar animais do galpão");
    return await response.json();
}