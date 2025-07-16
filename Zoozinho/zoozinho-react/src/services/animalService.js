import { URL_API } from "./config";


const url_animal = `${URL_API}/animal`

export async function listarAnimais(skip = 0, pageSize = 6) {
    const url = `${url_animal}?skip=${skip}&pageSize=${pageSize}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao listar animais");
    return await response.json(); 
}


export async function buscarAnimalPorId(id){
    const url = `${url_animal}/${id}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Animal não encontrado');
    return await response.json();
}

export async function cadastrarAnimal(animalDTO){
    const response = await fetch(url_animal,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(animalDTO),
    });
    if (!response.ok){
        const errors = await response.json();
        throw errors;
    }
    return await response.json();
}

export async function atualizarAnimal(id, animalDTO){
    const response = await fetch(`${url_animal}/${id}`,{
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(animalDTO),
    });
    if (!response.ok){
        const errors = await response.json();
        throw errors;
    }
    return await response.json();
}

export async function deletarAnimal(id, forcar = false){
    const url = new URL(`${url_animal}/${id}`); 
    if (forcar) {
        url.searchParams.append('forcar', 'true');
    }

    const response = await fetch(url, { method: 'DELETE' });
    if(!response.ok){
        const errors = await response.json();
        throw errors;
    }
    return await response.json()
}

export async function listarMovimentacoes(id, skip = 0, pageSize=10) {
    const url = `${url_animal}/${id}/movimentacoes?skip=${skip}&pageSize=${pageSize}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao listar movimentações');
    return await response.json();
}