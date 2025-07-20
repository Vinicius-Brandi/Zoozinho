import { URL_API } from "./config";

const url_categoria = `${URL_API}/categoria`;

export async function listarCategorias(skip = 0, pageSize = 6, pesquisa = "") {
  const url = new URL(url_categoria);

  url.searchParams.append("skip", skip.toString());
  url.searchParams.append("pageSize", pageSize.toString());

  if (pesquisa) {
    url.searchParams.append("pesquisa", pesquisa);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ao listar categorias: Status ${response.status} - ${errorBody}`);
  }
  const data = await response.json();
  return data;
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

export async function deletarCategoria(id) {
  const url = new URL(`${url_categoria}/${id}`);

  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    const errors = await response.json();
    throw errors;
  }
  return await response.json();
}