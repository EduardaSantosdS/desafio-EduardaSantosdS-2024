class RecintosZoo {
    constructor(numero, bioma, tamanhoTotal, animaisExistentes) {
        this.numero = numero;
        this.bioma = bioma;
        this.tamanhoTotal = tamanhoTotal;
        this.animaisExistentes = animaisExistentes;
    }

    analisaRecintos(tipo, quantidade) {
        const resultado = { erro: null, recintosViaveis: [] };

        if (quantidade <= 0) {
            resultado.erro = "Quantidade inválida";
            resultado.recintosViaveis = false;
            return resultado;
        }

        const animal = animaisPermitidos[`${tipo.substring(0, 1)}${tipo.toLowerCase().substring(1)}`];
        if (!animal) {
            resultado.erro = "Animal inválido";
            resultado.recintosViaveis = false;
            return resultado;
        }

        for (const recinto of recintos) {

            const tamanhoAtualOcupado = recinto.animaisExistentes.reduce((total, a) => total + a.tamanho, 0); 
            const tamanhoNecessario = animal.tamanho * quantidade; 
 
            const tiposExistentes = new Set(recinto.animaisExistentes.map(a => a.tipo));
            const novoTipoJaExiste = tiposExistentes.has(animal.tipo);
            if (!novoTipoJaExiste) {
                tiposExistentes.add(animal.tipo);   
            }
            const quantidadeTiposExistentes = tiposExistentes.size; 
 
            const espacoExtra = quantidadeTiposExistentes > 1 ? 1 : 0; 
            const espacoOcupadoTotal = tamanhoAtualOcupado + tamanhoNecessario + espacoExtra; 
 
            const tamanhoDisponivel = recinto.tamanhoTotal - espacoOcupadoTotal; 

            if (tamanhoDisponivel >= 0) {
                if (!recinto.bioma.some(b => animal.bioma.includes(b))) {
                    console.log(`Recinto ${recinto.numero} - Bioma incompatível`);
                    continue;
                }

                const jaTemCarnivoros = recinto.animaisExistentes.some(a => a.categoria === 'Carnívoro');
                if (animal.categoria === 'Herbívoro' && jaTemCarnivoros) {
                    console.log(`Recinto ${recinto.numero} - Herbívoros não podem compartilhar recinto com carnívoros`);
                    continue;
                }

                if (animal.categoria === 'Carnívoro') {
                    const todosMesmatipo = recinto.animaisExistentes.every(a => a.tipo === animal.tipo);
                    if (!todosMesmatipo) {
                        console.log(`Recinto ${recinto.numero} - Animais existentes não são da mesma espécie que o novo animal`);
                        continue;
                    }
                }

                if (animal.tipo === 'Hipopótamo') {
                    const temOutrastipos = recinto.animaisExistentes.some(a => a.tipo !== 'Hipopótamo');
                    if (temOutrastipos && (!recinto.bioma.includes('Savana') || !recinto.bioma.includes('Rio'))) {
                        console.log(`Recinto ${recinto.numero} - Hipopótamos não podem compartilhar o recinto sem Savana e Rio`);
                        continue;
                    }
                }

                if (animal.tipo === 'Macaco') {
                    if (recinto.animaisExistentes.length === 0 && quantidade === 1) {
                        console.log(`Recinto ${recinto.numero} - Macacos não podem estar sozinhos no recinto`);
                        continue;
                    }
                }

                const espacoAtualizado = recinto.tamanhoTotal - espacoOcupadoTotal;
                resultado.recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoAtualizado} total: ${recinto.tamanhoTotal})`);
            } else {
                console.log(`Recinto ${recinto.numero} - Espaço insuficiente`);
            }
        }

        if (resultado.recintosViaveis.length === 0) {
            resultado.erro = "Não há recinto viável";
            resultado.recintosViaveis = false;
        }

        return resultado;
    }


}

class Animal {
    constructor(tipo, tamanho, bioma, categoria) {
        this.tipo = tipo;
        this.tamanho = tamanho;
        this.bioma = bioma;  
        this.categoria = categoria;  
    }
}

const animaisPermitidos = {
    'Leão': new Animal('Leão', 3, 'Savana', 'Carnívoro'),
    'Leopardo': new Animal('Leopardo', 2, 'Savana', 'Carnívoro'),
    'Crocodilo': new Animal('Crocodilo', 3, 'Rio', 'Carnívoro'),
    'Macaco': new Animal('Macaco', 1, ['Savana', 'Floresta'], 'Herbívoro'),
    'Gazela': new Animal('Gazela', 2, 'Savana', 'Herbívoro'),
    'Hipopótamo': new Animal('Hipopótamo', 4, ['Savana', 'Rio'], 'Herbívoro')
};

const recintos = [
    new RecintosZoo(1, ['Savana'], 10, [new Animal('Macaco', 1, ['Savana'], 'Herbívoro'), new Animal('Macaco', 1, ['Savana'], 'Herbívoro'), new Animal('Macaco', 1, ['Savana'], 'Herbívoro')]),
    new RecintosZoo(2, ['Floresta'], 5, []),
    new RecintosZoo(3, ['Savana', 'Rio'], 7, [new Animal('Gazela', 2, 'Savana', 'Herbívoro')]),
    new RecintosZoo(4, ['Rio'], 8, []),
    new RecintosZoo(5, ['Savana'], 9, [new Animal('Leão', 3, 'Savana', 'Carnívoro')])
];

export { RecintosZoo as RecintosZoo };