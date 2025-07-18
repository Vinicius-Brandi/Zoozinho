import { URL_API } from "./config";

const url_recinto = `${URL_API}/recinto`;

export async function cadastrarRecinto(recintoDTO) {
    const response = await fetch(url_recinto, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recintoDTO)
    });
    if (!response.ok) {
        const errors = await response.json();
        throw errors;
    }
    return await response.json();
}

export async function listarRecintos(skip = 0, pageSize = 6) {
    const url = `${url_recinto}?skip=${skip}&pageSize=${pageSize}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao listar recintos");
    return await response.json();
}


export async function buscarRecintoPorId(id) {
    const response = await fetch(`${url_recinto}/${id}`);
    if (!response.ok) throw new Error("Recinto não encontrado");
    return await response.json();
}

export async function atualizarRecinto(id, recintoDTO) {
    const response = await fetch(`${url_recinto}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recintoDTO)
    });
    if (!response.ok) {
        const errors = await response.json();
        throw errors;
    }
    return await response.json();
}

export async function deletarRecinto(id, forcar = false) {
    const url = new URL(`${url_recinto}/${id}`);
    if (forcar) {
        url.searchParams.append("forcar", "true");
    }

    const response = await fetch(url, {
        method: "DELETE"
    });
    if (!response.ok) {
        const errors = await response.json();
        throw errors;
    }
    return await response.json();
}

export async function mostrarRelatorioRecinto(id) {
    const response = await fetch(`${url_recinto}/${id}/relatorio`);
    if (!response.ok) throw new Error("Erro ao obter relatório do recinto");
    return await response.json();
}

