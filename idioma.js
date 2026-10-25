// Alterna entre Português e English nas páginas legais.
// Ordem de escolha: ?lang=en|pt na URL, depois o idioma do navegador. Português é o padrão.
(function () {
    var botoes = document.querySelectorAll('.lang-toggle button[data-lang]');
    if (!botoes.length) return;

    function aplicar(lang) {
        document.querySelectorAll('.lang-section').forEach(function (secao) {
            secao.hidden = secao.id !== 'lang-' + lang;
        });
        botoes.forEach(function (b) {
            b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
        });
        document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    }

    botoes.forEach(function (b) {
        b.addEventListener('click', function () {
            var lang = b.getAttribute('data-lang');
            aplicar(lang);
            try { history.replaceState(null, '', '?lang=' + lang + location.hash); } catch (e) { }
        });
    });

    var pedido = new URLSearchParams(location.search).get('lang');
    var navegador = (navigator.language || 'pt').toLowerCase();
    aplicar(pedido === 'en' || pedido === 'pt' ? pedido : (navegador.indexOf('pt') === 0 ? 'pt' : 'en'));
})();
