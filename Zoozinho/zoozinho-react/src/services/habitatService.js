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

export async function listarHabitats(skip = 0, pageSize = 6, termoPesquisa = "", filtrosExtras = {}) {
  const url = new URL(url_habitat);

  url.searchParams.append("skip", skip);
  url.searchParams.append("pageSize", pageSize);
  if (filtrosExtras.recintoId) {
    url.searchParams.append("recintoId", filtrosExtras.recintoId);
  }
  if (termoPesquisa) {
    url.searchParams.append("pesquisa", termoPesquisa);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ao listar habitats: Status ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  return data;
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

export async function deletarHabitat(id) {
  const url = `${url_habitat}/${id}`;

  const response = await fetch(url, {
    method: "DELETE"
  });

  if (!response.ok) {
    const errors = await response.json();
    throw errors;
  }

  return await response.json();
}
