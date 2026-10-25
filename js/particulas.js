// Partículas da tela "Minhas Conquistas" do app (FundoParticulasNumerosVerdes em ProgressoScreen.kt):
// 40 símbolos e fórmulas matemáticas que surgem, sobem 100 px, giram 20° e somem num ciclo de 7,5 s.
(function () {
    var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var SIMBOLOS = ['+', '-', 'x', '÷', '=', '√', '?', '!', '3', '8', '9', '5', '7', 'π'];
    var EXPR = ['34 + 3 = 37', '(x + 7 - z) = 20', '(x - 3 + |x|)² / (x + 2)', 'E = mc²', 'a² + b² = c²'];
    var TODOS = SIMBOLOS.concat(SIMBOLOS, EXPR);
    var CORES = ['#5DF255', '#80DEEA', '#FFD700', '#CE93D8', '#A5D6A7'];
    var CICLO = 7500; // ms
    var QUANTIDADE = 40;

    function sorteia(a) { return a[Math.floor(Math.random() * a.length)]; }

    var particulas = [];
    for (var i = 0; i < QUANTIDADE; i++) {
        var t = sorteia(TODOS), expr = t.length > 3;
        particulas.push({
            t: t,
            x: Math.random(),
            y: Math.random(),
            tamanho: expr ? 14 + Math.random() * 6 : 16 + Math.random() * 16,
            alfa: 0.2 + Math.random() * 0.5,
            offset: Math.random() * CICLO,
            rot: expr ? Math.random() * 40 - 20 : Math.random() * 360,
            cor: sorteia(CORES)
        });
    }

    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dpr = 1, largura = 0, altura = 0;

    function redimensionar() {
        dpr = Math.min(window.devicePixelRatio || 1, 3);
        largura = window.innerWidth; altura = window.innerHeight;
        canvas.width = Math.round(largura * dpr); canvas.height = Math.round(altura * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (reduzir) desenhar(0);
    }

    function desenhar(agora) {
        ctx.clearRect(0, 0, largura, altura);
        ctx.textAlign = 'center';
        for (var i = 0; i < particulas.length; i++) {
            var p = particulas[i];
            // Com "reduzir movimento", as partículas ficam paradas e visíveis.
            var prog = reduzir ? 0.5 : ((agora + p.offset) % CICLO) / CICLO;
            var sobe = prog * 100 / dpr; // 100 px físicos, como no app
            ctx.save();
            ctx.globalAlpha = p.alfa * Math.sin(prog * Math.PI);
            ctx.fillStyle = p.cor;
            ctx.font = p.tamanho + 'px sans-serif';
            ctx.translate(p.x * largura, p.y * altura - sobe);
            ctx.rotate((p.rot + prog * 20) * Math.PI / 180);
            ctx.fillText(p.t, 0, 0);
            ctx.restore();
        }
    }

    window.addEventListener('resize', redimensionar);
    redimensionar();
    if (reduzir) return;

    var rodando = true;
    function quadro(agora) {
        if (!rodando) return;
        desenhar(agora);
        requestAnimationFrame(quadro);
    }
    document.addEventListener('visibilitychange', function () {
        rodando = !document.hidden;
        if (rodando) requestAnimationFrame(quadro);
    });
    requestAnimationFrame(quadro);
})();
