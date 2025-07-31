const canvas = document.getElementById('waveCanvas');
        const ctx = canvas.getContext('2d');

        // Define as propriedades das ondas
        const waves = [];
        const numWaves = 6; // Reduzido para um efeito mais misturado e suave
        const baseAmplitude = 60; // Amplitude base das ondas, um pouco menor para suavidade
        const baseFrequency = 0.007; // Frequência base das ondas
        const baseSpeed = 0.004; // Velocidade base das ondas
        let waveOffset = 0; // Offset para animar as ondas

        // Cores das ondas (ajustadas para ciano-azul com diferentes opacidades)
        // O hex #03e2ff é (3, 226, 255) em RGB
        const colors = [
            'rgba(3, 226, 255, 0.1)',    // Ciano-azul, bem transparente
            'rgba(3, 226, 255, 0.08)',   //
            'rgba(3, 226, 255, 0.06)',   //
            'rgba(3, 226, 255, 0.05)',  //
            'rgba(3, 226, 255, 0.04)', //
            'rgba(3, 226, 255, 0.03)'  // Ciano-azul mais claro, quase invisível
        ];

        // Cores para o gradiente de fundo do canvas (do topo para o fundo)
        const gradientTopColor = '#0077ff'; // Azul mais claro no topo
        const gradientBottomColor = '#003366'; // Azul mais escuro na parte inferior

        // Ponto de origem das ondas (mais baixo na tela, onde elas "nascem")
        let waveOriginY; // Será calculado na função resizeCanvas

        // Função para ajustar o tamanho do canvas para preencher a janela
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            waveOriginY = canvas.height * 0.8; // Ajustado para 80% da altura, para que as ondas "subam" mais
        }

        // Adiciona um listener para redimensionar o canvas quando a janela for redimensionada
        window.addEventListener('resize', resizeCanvas);
        // Chama a função de redimensionamento uma vez para configurar o tamanho inicial
        resizeCanvas();

        // Inicializa as propriedades de cada onda
        for (let i = 0; i < numWaves; i++) {
            waves.push({
                // Amplitude diminui para ondas mais distantes (maior 'i'), criando perspectiva
                amplitude: baseAmplitude - i * 8, // Ajuste sutil da amplitude
                // Frequência aumenta ligeiramente para ondas mais distantes
                frequency: baseFrequency + i * 0.0005, // Ajuste mais sutil da frequência
                // Velocidade aumenta ligeiramente para ondas mais distantes
                speed: baseSpeed + i * 0.0003, // Ajuste mais sutil da velocidade
                color: colors[i % colors.length] // Cicla pelas cores definidas
            });
        }

        // Função principal para desenhar as ondas
        function drawWaves() {
            // Desenha o gradiente de fundo
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, gradientTopColor);
            gradient.addColorStop(1, gradientBottomColor);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Desenha as ondas de trás para frente (as mais claras/distantes primeiro, as mais escuras/próximas por cima)
            for (let i = numWaves - 1; i >= 0; i--) {
                const wave = waves[i];
                ctx.beginPath(); // Inicia um novo caminho
                ctx.moveTo(0, canvas.height); // Começa no canto inferior esquerdo

                // Desenha a onda usando uma função seno
                for (let x = 0; x < canvas.width; x++) {
                    // A altura y da onda é calculada a partir do ponto de origem (fundo)
                    // e a onda sobe em direção ao centro da tela.
                    // O termo `(numWaves - 1 - i) * 40` cria a perspectiva, fazendo as ondas "mais distantes"
                    // aparecerem mais acima na tela, simulando o horizonte.
                    const y = waveOriginY - (numWaves - 1 - i) * 40 + Math.sin(x * wave.frequency + waveOffset * wave.speed) * wave.amplitude;
                    ctx.lineTo(x, y); // Desenha uma linha até o próximo ponto
                }

                ctx.lineTo(canvas.width, canvas.height); // Desenha até o canto inferior direito
                ctx.closePath(); // Fecha o caminho para formar uma forma preenchível

                ctx.fillStyle = wave.color; // Define a cor de preenchimento da onda
                ctx.fill(); // Preenche a forma da onda
            }

            // Atualiza o offset da onda para a animação
            waveOffset += 1; // Ajuste este valor para controlar a velocidade geral da animação
        }

        // Loop de animação
        function animate() {
            drawWaves(); // Desenha as ondas
            requestAnimationFrame(animate); // Solicita o próximo frame da animação
        }

        // Inicia a animação quando a janela é totalmente carregada
        window.onload = function() {
            animate();
        };
