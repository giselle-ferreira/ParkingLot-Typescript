
interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
    clienteId?: string;
}

interface Pessoa {
    nome: string;
    cpf: string;
}

interface Cliente extends Pessoa {
    veiculos: Veiculo[];
}


(function() {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTempo(mili: number): string {
        const min = Math.floor(mili / 60000);
        const sec = Math.floor((mili % 60000) / 1000 ); // o resto da divisão dividido por mil

        return `${min}min e ${sec}seg`;
    }


    function patio(){
        function ler(): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : []
        }

        function salvar(veiculos: Veiculo[]){
            localStorage.setItem('patio', JSON.stringify(veiculos));
        }

        function adicionar(veiculo: Veiculo, salva?: boolean){
            const row = document.createElement('tr');

            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class="delete border-0 bg-transparent " data-placa="${veiculo.placa}">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#FF0000" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
              </svg></button>
            </td>
            `

            row.querySelector('.delete')?.addEventListener('click', function() {
                remover(this.dataset.placa) // o this funcionou porque tiramos o strict do tsconfig.json
            })

            $('#patio')?.appendChild(row)

               
            if(salva) salvar([...ler(), veiculo]) //vem todos os antigos do método ler() que já estão armazenados e o veículo novo                             
             
        }

        function remover(placa: string){
            const { entrada, nome } = ler().find((veiculo) => veiculo.placa === placa );

            // quanto tempo ficou no pátio
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            // confirmar se o carro permanecerá no pátio.
            // Se a resposta for não, dá um return. Se clicar em OK, salva.
            if(!confirm(`O veículo ${nome}, de placa ${placa}, permaneceu por ${tempo}. Deseja encerrar?`)) return;
            salvar(ler().filter(veiculo => veiculo.placa !== placa)); // salva e retorna todos os veículos que restaram

            render(); // para renderizar novamente com o veículo removido do pátio
        }        

        function render(){
            $('#patio')!.innerHTML = '';
            const patio = ler();

            // se #patio existir
            if(patio.length === 0 ){
                $('thead').remove();
                $('#mensagem').append('Nenhum veículo cadastrado.')
            } else {                
                patio.forEach((veiculo) => adicionar(veiculo));
                $('#mensagem').remove();
                
            }
        }

        return { ler, adicionar, remover, salvar, render };
    }

    // para renderizar toda vez que iniciar
    patio().render();

    $('#cadastrar')?.addEventListener('click', () => {
        const nome = $('#nome')?.value;
        const placa = $('#placa')?.value;

        if(!nome || !placa){
            alert('Os campos nome e placa são obrigatórios');
            return;
        }

        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true)
    })
})();