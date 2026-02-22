import { Play, Lock, Shield, Star, Volume2, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    name: "Jean",
    role: "Mentorado",
    description: `"O nivel de conexões que eu adquiri estando junto com o Marcelo já fez a mentoria se pagar antes mesmo de começar"`,
    link: "https://www.youtube.com/embed/DTOfGEgXki4"
  },
  {
    name: "Alisson",
    role: "Cliente Arsenal de Vendas",
    description: `"O mercado está carente de pessoas boas e de tudo que eu vi o seu conteúdo é o melhor"`,
    link: "https://www.youtube.com/embed/wsF5iiJR58c"
  },
  {
    name: "Yuri",
    role: "Mentorado",
    description: `"Entrei na comunidade e foi um divisor de águas, abriu completamente os meus olhos. Muito mão na massa, é uma coisa muito próxima."`,
    link: "https://www.youtube.com/embed/FdWLnpq0PEo"
  },
  {
    name: "Guilherme",
    role: "Mentorado",
    description: `"A comunidade e a mentoria do Marcelo mudou a minha vida, só tenho que agradecer, não conseguia passar confiança nas propostas e depois de 1 mês deu 10 mil reais"`,
    link: "https://www.youtube.com/embed/vZ9JApgf2FM"
  },
  {
    name: "Lucas",
    role: "Mentorado",
    description: `"A mentoria já estava paga porque o projeto estava vendido e ainda sobrou dinheiro. Depois que eu peguei a mentoria minha confiança aumentou e minha vida mudou."`,
    link: "https://www.youtube.com/embed/YFQ7g9cTFJQ"
  },
  {
    name: "Aluno da Comunidade",
    role: "Comunidade",
    description: `"Apesar do conteúdo dos concorrentes serem bons, nada se compara a experiência e o acompanhamento que vocês entregam"`,
    link: "https://www.youtube.com/embed/FjPu6mSPNgg"
  }
];

export default function App() {
  const [showButton, setShowButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [leadData, setLeadData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('trackCustom', 'ClickCTA_VSL', {
        content_name: 'Botao_Acesso_VSL'
      });
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (typeof (window as any).fbq === 'function') {
      // Confirmação de Lead capturado
      (window as any).fbq('track', 'Lead', {
        content_name: 'Lead_VSL_Capturado',
      });
      // Início de checkout (já que ele é redirecionado na sequência para pagar)
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: 'Checkout_VSL',
      });
    }

    // Enviar dados para o Webhook
    try {
      await fetch("https://autowebhook.mgtinc.cloud/webhook/LEADS-ARSENAL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });
    } catch (error) {
      console.error("Erro ao enviar lead para o webhook:", error);
    }

    // Redirect to Cakto checkout with user data potentially added as query params
    const checkoutUrl = new URL("https://pay.cakto.com.br/x6dp98t_355817");
    checkoutUrl.searchParams.set("name", leadData.name);
    checkoutUrl.searchParams.set("email", leadData.email);
    checkoutUrl.searchParams.set("phone", leadData.phone);

    window.location.href = checkoutUrl.toString();
  };

  useEffect(() => {
    // Reduzindo o tempo para 1 segundo (estava 5s) para você testar mais fácil
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] font-sans selection:bg-white selection:text-black flex flex-col">
      {/* Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-8 bg-[#1d1d1f] rounded-2xl border border-white/10 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#86868b] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">
              Quase lá!
            </h3>
            <p className="text-[#86868b] mb-6">
              Preencha os dados abaixo para continuar.
            </p>
            <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-[#f5f5f7] mb-1">Nome completo</label>
                <input
                  type="text"
                  required
                  value={leadData.name}
                  onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f5f5f7] mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={leadData.email}
                  onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f5f5f7] mb-1">WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={leadData.phone}
                  onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white hover:bg-gray-200 text-black font-semibold text-lg py-4 rounded-xl transition-all duration-300 mt-6 tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processando...' : 'Continuar'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Top Bar */}
      <div className="w-full bg-white text-center py-3 text-xs md:text-sm font-medium tracking-wide text-black">
        Atenção: Este vídeo sairá do ar em breve.
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center">
        {/* Headlines */}
        <div className="text-center max-w-4xl mx-auto mb-12 space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter text-white leading-[1.05]">
            Sem teoria.<br />
            <span className="text-[#86868b]">Somente execução.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#86868b] font-medium max-w-3xl mx-auto leading-relaxed tracking-tight">
            Agora você vai ver uma venda real de um projeto de 22 mil reais. Está preparado?
          </p>
        </div>

        {/* VSL Player */}
        <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#1d1d1f]">
          <iframe
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { margin: 0; padding: 0; background: #1d1d1f; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
                    vturb-smartplayer { width: 100% !important; height: 100% !important; }
                  </style>
                </head>
                <body>
                  <vturb-smartplayer id="vid-699b5cdcc89dd0b2f58111b8" style="display: block; margin: 0 auto; width: 100%;"></vturb-smartplayer>
                  <script type="text/javascript">
                    var s=document.createElement("script");
                    s.src="https://scripts.converteai.net/4000cfee-6301-49d1-a1d0-07f3a10f1621/players/699b5cdcc89dd0b2f58111b8/v4/player.js";
                    s.async=true;
                    document.head.appendChild(s);
                  </script>
                </body>
              </html>
            `}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm text-[#86868b] font-medium tracking-tight">
          <Lock className="w-4 h-4" />
          <span>Informações criptografadas de ponta a ponta.</span>
        </div>

        {/* CTA Button (Delayed) */}
        <div className={`mt-16 transition-all duration-1000 transform flex flex-col items-center w-full ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
          <button
            onClick={handleOpenModal}
            className="bg-white hover:bg-gray-200 text-black font-semibold text-lg md:text-xl py-4 px-10 md:px-14 rounded-full transition-all duration-300 w-full md:w-auto tracking-tight"
          >
            Quero ter acesso agora
          </button>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-8 md:gap-12 text-[#86868b] text-sm font-medium tracking-tight">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Compra Segura
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Garantia de 7 dias
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Acesso Imediato
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mt-32 w-full max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
                Pessoas que já tiveram acesso ao ecossistema
              </h2>
              <p className="text-[#86868b] text-lg">
                Veja o que dizem aqueles que já aplicaram o método.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-[#1d1d1f] rounded-2xl p-6 border border-white/5 flex flex-col hover:border-white/10 transition-colors">
                  <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 bg-black border border-white/5">
                    <iframe
                      src={testimonial.link}
                      title={`Depoimento ${testimonial.name}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <p className="text-[#f5f5f7] text-base leading-relaxed italic mb-6 flex-1">
                      {testimonial.description}
                    </p>
                    <div className="mt-auto">
                      <h3 className="text-white font-semibold text-lg">{testimonial.name}</h3>
                      <p className="text-[#86868b] text-sm font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <button
                onClick={handleOpenModal}
                className="bg-white hover:bg-gray-200 text-black font-semibold text-lg md:text-xl py-4 px-10 md:px-14 rounded-full transition-all duration-300 w-full md:w-auto tracking-tight"
              >
                Quero ter acesso agora
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-auto bg-black">
        <div className="max-w-5xl mx-auto px-6 text-center text-xs text-[#86868b] space-y-6 font-medium tracking-tight">
          <p className="max-w-2xl mx-auto leading-relaxed">
            Este site não faz parte do site do Facebook ou da Meta Platforms, Inc. Além disso, este site não é endossado pelo Facebook de nenhuma maneira. FACEBOOK é uma marca comercial independente da META PLATFORMS, INC.
          </p>
          <div className="flex justify-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
          </div>
          <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
