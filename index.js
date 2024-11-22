var data = []

const carregarLista = async () => {

    const lista = document.querySelector('input')

    const url = lista.value

    data = extrairDados(url)

    console.log(data);
    
    const canais = await playerApi(data, 'get_live_streams')
    const filmes = await playerApi(data, 'get_vod_streams')
    const series = await playerApi(data, 'get_series')

    console.log(canais, filmes, series);

    $('#select-canais').html('<option>Selecione</option>')
    $('#select-filmes').html('<option>Selecione</option>')
    $('#select-series').html('<option>Selecione</option>')

    canais.forEach(canal => {
        $('#select-canais').append(`<option value=".${canal.stream_id}.m3u8">${canal.name}</option>`)    
    });

    filmes.slice(0, 1000).forEach(filme => {
        $('#select-filmes').append(`<option value="/movie.${filme.stream_id}.${filme.container_extension}">${filme.name}</option>`)    
    });

    series.slice(0, 1000).forEach(serie => {
        $('#select-series').append(`<option value="/series.${serie.stream_id}.${serie.container_extension}">${serie.name}</option>`)    
    });

    
}

function extrairDados(url) {
    const urlObj = new URL(url);

    const dns = urlObj.origin;
    const params = urlObj.searchParams;

    const username = params.get("username");
    const password = params.get("password");

    return { dns, username, password };
}

async function playerApi(data, action) {

    const url = `${data.dns}/player_api.php?username=${data.username}&password=${data.password}&action=${action}`;

    try {

        
        const response = await $.ajax({
            url: url,
            type: 'GET',
            crossDomain: true,
            dataType: 'json',
        });

        if (!response) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        return response || [];

    } catch (error) {
        console.error('Erro na API:', error.message);
        return [];
    }
}


const renderizarVideo = ({ target }) => {

    const elm = $(target)
    const value = elm.val()

    const [type, stream_id, container_extension] = value.split('.')

    const streamUrl = `${data.dns}${type}/${data.username}/${data.password}/${stream_id}.${container_extension}`

    console.log(value, streamUrl);
    
    

    const player = new Playerjs({
        id: 'player',
        file: streamUrl,
        width: '100%',
        height: '100%',
        autoplay: true,
    })

}


$('#btn-carregar').on('click', carregarLista)

$('select').on('change', renderizarVideo)