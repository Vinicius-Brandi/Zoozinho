import { URL_API } from "./config";


const url_categoria = `${URL_API}/categoria`;

export async function listarCategorias() {
    const response = await fetch(url_categoria);
    if (!response.ok) throw new Error("Erro ao listar categorias");
    return await response.json();
}

export async function buscarCategoriaPorId(id) {
    const response = await fetch(`${url_categoria}/${id}`);
    if (!response.ok) throw new Error("Categoria não encontrada");
    return await response.json();
}

export async function cadastrarCategoria(categoriaDTO) {
    const response = await fetch(url_categoria, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoriaDTO)
    });
    if (!response.ok) {
        const errors = await response.json();
        throw errors;
    }
    return await response.json();
}

export async function atualizarCategoria(id, categoriaDTO) {
    const response = await fetch(`${url_categoria}?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoriaDTO)
    });
    if (!response.ok) {
        const errors = await response.json();
        throw errors;
    }
    return await response.json();
}

export async function deletarCategoria(id, forcar = false) {
    const url = new URL(`${url_categoria}/${id}`);
    if (forcar) url.searchParams.append("forcar", "true");

    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
        const errors = await response.json();
        throw errors;
    }
    return await response.json();
}
