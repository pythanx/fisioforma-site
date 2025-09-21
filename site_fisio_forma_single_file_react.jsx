import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MotionConfig, motion } from "framer-motion";
import { Dumbbell, MapPin, Phone, Mail, Clock, ChevronRight, CheckCircle2, Instagram, Facebook, MessageCircle } from "lucide-react";

// === CONFIGURAÇÕES RÁPIDAS ===
const CFG = {
  brand: {
    name: "FisioForma",
    tagline: "Comunidade, acolhimento e resultados reais",
    unit: "Unidade Anjo da Guarda — São Luís, MA",
    short: "FisioForma Anjo da Guarda",
  },
  contacts: {
    whatsapp: "5598000000000", // só números; troque pelo número real com DDI/DDD
    phoneRaw: "+55 (98) 0000-0000",
    email: "contato@fisioforma.com.br",
    address: "Av. Principal, 123 — Anjo da Guarda, São Luís — MA",
    mapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d-99.0!2d-44.000!3d-2.500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sFisioForma!5e0!3m2!1spt-BR!2sbr!4v0000000000000",
  },
  colors: {
    primary: "bg-red-600",
    primaryText: "text-red-600",
  },
};

// === COMPONENTE PRINCIPAL ===
export default function FisioformaSite() {
  const [year] = useState(() => new Date().getFullYear());

  useEffect(() => {
    // SEO básico / JSON-LD
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HealthClub",
      name: CFG.brand.name,
      address: CFG.contacts.address,
      telephone: CFG.contacts.phoneRaw,
      email: CFG.contacts.email,
      areaServed: "São Luís - MA",
      slogan: CFG.brand.tagline,
      url: window.location.href,
      sameAs: [
        "https://instagram.com/", // inserir perfil real
        "https://facebook.com/", // inserir perfil real
      ],
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const features = useMemo(
    () => [
      { title: "Acolhimento de verdade", desc: "Equipe preparada para receber iniciantes e recomeços, sem julgamentos.", icon: <CheckCircle2 className="h-6 w-6" /> },
      { title: "Atendimento humanizado", desc: "Foco na sua rotina, metas e limitações. Você em primeiro lugar.", icon: <CheckCircle2 className="h-6 w-6" /> },
      { title: "Resultados sustentáveis", desc: "Treinos e hábitos que cabem no seu dia a dia para evoluir de forma consistente.", icon: <CheckCircle2 className="h-6 w-6" /> },
    ],
    []
  );

  const plans = [
    {
      name: "Plano Essencial",
      price: "R$ 99/mês",
      bullets: [
        "Acesso à musculação",
        "Avaliação inicial básica",
        "Orientação de treino em ficha padrão",
      ],
      cta: "Matricule-se",
    },
    {
      name: "Plano Plus",
      price: "R$ 129/mês",
      bullets: [
        "Tudo do Essencial",
        "Acompanhamento mensal",
        "Acesso a desafios internos",
      ],
      cta: "Quero este",
    },
    {
      name: "Plano Premium",
      price: "R$ 169/mês",
      bullets: [
        "Tudo do Plus",
        "Suporte prioritário na recepção",
        "Acesso antecipado a eventos",
      ],
      cta: "Assinar",
    },
  ];

  const faqs = [
    {
      q: "A FisioForma é para iniciantes?",
      a: "Sim! Nosso foco é o público geral. Temos equipe pronta para orientar quem está começando e para quem está voltando após um período parado.",
    },
    {
      q: "Vocês fazem avaliação física?",
      a: "Sim. Realizamos avaliação física com horário agendado na recepção. Usamos protocolos reconhecidos e acompanhamos sua evolução.",
    },
    {
      q: "Há planos trimestrais ou anuais?",
      a: "Oferecemos condições especiais em fidelidade. Consulte na recepção para valores e regras atualizadas.",
    },
    {
      q: "Tem estacionamento e vestiário?",
      a: "Sim, contamos com estrutura de apoio para maior comodidade. Itens específicos podem variar — confirme na unidade.",
    },
    {
      q: "Quais os horários de funcionamento?",
      a: "Seg–Sex: 5h–22h | Sáb: 6h–12h. Feriados podem ter horários especiais.",
    },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white text-zinc-900">
        {/* NAVBAR */}
        <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 ${CFG.colors.primary} rounded-xl flex items-center justify-center shadow`}> 
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <div className="leading-tight">
                <p className="font-bold">{CFG.brand.name}</p>
                <p className="text-xs text-zinc-600">{CFG.brand.unit}</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-6 text-sm">
              <a href="#sobre" className="hover:underline">Sobre</a>
              <a href="#planos" className="hover:underline">Planos</a>
              <a href="#estrutura" className="hover:underline">Estrutura</a>
              <a href="#faq" className="hover:underline">FAQ</a>
              <a href="#contato" className="hover:underline">Contato</a>
            </nav>
            <div className="flex items-center gap-2">
              <a href={`https://wa.me/${CFG.contacts.whatsapp}`} target="_blank" rel="noreferrer">
                <Button className="rounded-2xl shadow-md">Fale no WhatsApp</Button>
              </a>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="relative">
          <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="text-3xl md:text-5xl font-extrabold leading-tight">
                {CFG.brand.name}: <span className={CFG.colors.primaryText}>treino que cabe na sua vida</span>
              </motion.h1>
              <p className="mt-4 text-lg text-zinc-700 max-w-prose">
                {CFG.brand.tagline}. Aqui você encontra atendimento humanizado, orientação segura e uma comunidade que puxa você pra frente.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#planos"><Button className="rounded-2xl">Ver planos</Button></a>
                <a href="#contato"><Button variant="outline" className="rounded-2xl">Agendar visita</Button></a>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-zinc-600">
                <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4"/> Seg–Sex 5h–22h</span>
                <span className="inline-flex items-center gap-1">Sáb 6h–12h</span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video w-full rounded-3xl shadow-xl bg-gradient-to-br from-zinc-100 to-zinc-200 grid place-content-center">
                <Dumbbell className={`${CFG.colors.primaryText.replace("text-","h-24 w-24 text-")} opacity-80`} />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="sobre" className="bg-zinc-50 border-y">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Sobre a {CFG.brand.short}</h2>
            <p className="text-zinc-700 max-w-3xl">
              Somos uma academia de bairro com espírito de comunidade. Nosso propósito é tornar o exercício físico acessível,
              seguro e prazeroso para pessoas de todas as idades. Nada de modismos: focamos no básico bem-feito, com acolhimento e
              evolução contínua. Não somos voltados a atletas de competição — aqui o público geral é prioridade.
            </p>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <Card key={i} className="rounded-2xl">
                  <CardHeader className="flex-row items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl ${CFG.colors.primary} text-white grid place-content-center`}>{f.icon}</div>
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-zinc-700">{f.desc}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PLANOS */}
        <section id="planos" className="">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Planos e valores</h2>
            <p className="text-zinc-700">Valores e condições podem variar; confirme na recepção para ofertas e fidelidade.</p>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {plans.map((p, i) => (
                <Card key={i} className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl">{p.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-extrabold">{p.price}</p>
                    <ul className="mt-4 space-y-2 text-zinc-700">
                      {p.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 mt-0.5" /> <span>{b}</span></li>
                      ))}
                    </ul>
                    <a href={`https://wa.me/${CFG.contacts.whatsapp}?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20o%20${encodeURIComponent(p.name)}%20na%20${encodeURIComponent(CFG.brand.short)}.`} target="_blank" rel="noreferrer">
                      <Button className="mt-6 w-full rounded-2xl">{p.cta}</Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ESTRUTURA */}
        <section id="estrutura" className="bg-zinc-50 border-y">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Estrutura</h2>
            <p className="text-zinc-700">Ambiente completo para musculação, cardio e aulas coletivas (variam conforme grade).</p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {[
                {t:"Musculação",d:"Área ampla com equipamentos selecionados e manutenção constante."},
                {t:"Cardio",d:"Esteiras, elípticos e bikes para diferentes níveis."},
                {t:"Apoio",d:"Recepção, vestiários e bebedouros — praticidade no dia a dia."},
              ].map((x, i) => (
                <Card className="rounded-2xl" key={i}>
                  <CardHeader><CardTitle className="text-lg">{x.t}</CardTitle></CardHeader>
                  <CardContent className="text-zinc-700">{x.d}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA INTERMEDIÁRIA */}
        <section className="">
          <div className="mx-auto max-w-6xl px-4 py-12 text-center">
            <h3 className="text-xl md:text-2xl font-bold">Pronto para começar?</h3>
            <p className="text-zinc-700 mt-2">Agende uma visita ou fale com a recepção pelo WhatsApp. É rápido e sem burocracia.</p>
            <div className="mt-4 flex justify-center">
              <a href={`https://wa.me/${CFG.contacts.whatsapp}`} target="_blank" rel="noreferrer">
                <Button size="lg" className="rounded-2xl inline-flex items-center gap-2">Falar agora <ChevronRight className="h-4 w-4"/></Button>
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-zinc-50 border-y">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Perguntas frequentes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((f, i) => (
                <Card key={i} className="rounded-2xl">
                  <CardHeader><CardTitle className="text-lg">{f.q}</CardTitle></CardHeader>
                  <CardContent className="text-zinc-700">{f.a}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CONTATO / MAPA */}
        <section id="contato">
          <div className="mx-auto max-w-6xl px-4 py-14 grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Fale com a gente</h2>
              <p className="text-zinc-700 mt-2">Tire dúvidas, agende avaliação e conheça nossos planos.</p>
              <div className="mt-6 space-y-3 text-zinc-700">
                <p className="flex items-center gap-2"><Phone className="h-5 w-5"/> {CFG.contacts.phoneRaw}</p>
                <p className="flex items-center gap-2"><Mail className="h-5 w-5"/> {CFG.contacts.email}</p>
                <p className="flex items-center gap-2"><MapPin className="h-5 w-5"/> {CFG.contacts.address}</p>
                <div className="flex items-center gap-3">
                  <a href={`https://wa.me/${CFG.contacts.whatsapp}`} target="_blank" rel="noreferrer"><Button className="rounded-2xl inline-flex gap-2"><MessageCircle className="h-4 w-4"/> WhatsApp</Button></a>
                  <a href="#" target="_blank" rel="noreferrer"><Button variant="outline" className="rounded-2xl inline-flex gap-2"><Instagram className="h-4 w-4"/> Instagram</Button></a>
                  <a href="#" target="_blank" rel="noreferrer"><Button variant="outline" className="rounded-2xl inline-flex gap-2"><Facebook className="h-4 w-4"/> Facebook</Button></a>
                </div>
              </div>

              {/* Formulário (frontend-only) */}
              <form className="mt-8 space-y-3" onSubmit={(e)=>{e.preventDefault(); alert("Mensagem enviada! (configure um backend depois)")}}>
                <div className="grid md:grid-cols-2 gap-3">
                  <Input placeholder="Seu nome" required />
                  <Input type="email" placeholder="Seu e-mail" required />
                </div>
                <Input placeholder="Telefone/WhatsApp" />
                <Textarea placeholder="Conte rapidamente seu objetivo" className="min-h-[120px]" />
                <Button type="submit" className="rounded-2xl">Enviar mensagem</Button>
                <p className="text-xs text-zinc-500">Ao enviar, você concorda com nosso atendimento e resposta por WhatsApp/e-mail.</p>
              </form>
            </div>

            <div className="rounded-2xl overflow-hidden shadow">
              <iframe
                title="Mapa da FisioForma"
                src={CFG.contacts.mapsEmbed}
                width="100%"
                height="380"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="border-0"
              />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-600 flex flex-col md:flex-row items-center justify-between gap-4">
            <p>© {year} {CFG.brand.name}. Todos os direitos reservados.</p>
            <p>
              {CFG.brand.short} • {CFG.contacts.address}
            </p>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
