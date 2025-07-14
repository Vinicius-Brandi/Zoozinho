import { URL_API } from "./config";

const url_habitat = `${URL_API}/habitat`;

export async function cadastrarHabitat(habitatDTO) {
    const response = await fetch(url_habitat, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitatDTO)
    });
    if (!response.ok) {
        const errors = await response.json();
        throw errors;
    }
    return await response.json();
}

export async function listarHabitats() {
    const response = await fetch(url_habitat);
    if (!response.ok) throw new Error("Erro ao listar habitats");
    return await response.json();
}

export async function buscarHabitatPorId(id) {
    const response = await fetch(`${url_habitat}/${id}`);
    if (!response.ok) throw new Error("Habitat não encontrado");
    return await response.json();
}

export async function atualizarHabitat(id, habitatDTO) {
    const response = await fetch(`${url_habitat}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitatDTO)
    });
    if (!response.ok) {
        const errors = await response.json();
        throw errors;
    }
    return await response.json();
}

export async function deletarHabitat(id, forcar = false) {
    const url = new URL(`${url_habitat}/${id}`);
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
