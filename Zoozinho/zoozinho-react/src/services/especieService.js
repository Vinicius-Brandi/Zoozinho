import { URL_API } from "./config";

const url_especie = `${URL_API}/especie`;

export async function listarEspecies(skip = 0, pageSize = 10, termoPesquisa = "", filtrosExtras = {}) {
  const url = new URL(url_especie);

  url.searchParams.append("skip", skip);
  url.searchParams.append("pageSize", pageSize);

  if (termoPesquisa) {
    url.searchParams.append("pesquisa", termoPesquisa);
  }

  if (filtrosExtras.categoriaId) {
    url.searchParams.append("categoriaId", filtrosExtras.categoriaId);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ao listar espécies: Status ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  return data;
}

export async function buscarEspeciePorId(id) {
  const response = await fetch(`${url_especie}/${id}`);
  if (!response.ok) throw new Error("Espécie não encontrada");
  return await response.json();
}

export async function cadastrarEspecie(especieDTO) {
  const response = await fetch(url_especie, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(especieDTO)
  });
  if (!response.ok) {
    const errors = await response.json();
    throw errors;
  }
  return await response.json();
}

export async function atualizarEspecie(id, especieDTO) {
  const response = await fetch(`${url_especie}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(especieDTO)
  });
  if (!response.ok) {
    const errors = await response.json();
    throw errors;
  }
  return await response.json();
}

export async function deletarEspecie(id, forcar = false) {
  const url = new URL(`${url_especie}/${id}`);
  if (forcar) url.searchParams.append("forcar", "true");

  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    const errors = await response.json();
    throw errors;
  }
  return await response.json();
}

export async function relatorioEspeciesPorCategoria() {
  const response = await fetch(`${url_especie}/relatorio`);
  if (!response.ok) throw new Error("Erro ao gerar relatório");
  return await response.json();
}