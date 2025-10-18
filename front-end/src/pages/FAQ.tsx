import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Cum pot plasa o comandă?",
      answer: "Plasarea unei comenzi este simplă! Navighează prin catalog, selectează coșul dorit, adaugă-l în coș, apoi finalizează comanda urmând pașii de checkout. Vei introduce datele de livrare și vei efectua plata securizat prin Stripe.",
    },
    {
      question: "Care sunt opțiunile de livrare?",
      answer: "Oferim două opțiuni de livrare: Standard (24-48 ore lucrătoare) și Express (12-24 ore pentru orașele mari). Costul livrării este de 25 RON pentru livrare standard și 35 RON pentru express.",
    },
    {
      question: "Pot personaliza coșurile cadou?",
      answer: "Da! Pentru fiecare coș poți adăuga un mesaj personalizat care va fi inclus într-o carte elegantă. Pentru personalizări mai complexe, te rugăm să ne contactezi direct.",
    },
    {
      question: "Ce metode de plată acceptați?",
      answer: "Acceptăm plăți securizate prin Stripe: carduri Visa, Mastercard, American Express și alte metode de plată online. Toate tranzacțiile sunt 100% securizate.",
    },
    {
      question: "Care este politica de retur?",
      answer: "Oferim drept de retur în 14 zile de la primirea coșului, conform legislației în vigoare. Produsele trebuie returnate în condiții nealterate. Contactează-ne pentru a inițiate procesul de retur.",
    },
    {
      question: "Pot comanda pentru livrare în altă zi?",
      answer: "Da! La checkout poți specifica data dorită de livrare. Recomandăm să plasezi comanda cu cel puțin 2-3 zile înainte pentru a ne asigura că totul este pregătit perfect.",
    },
    {
      question: "Produsele sunt proaspete?",
      answer: "Absolut! Toate produsele alimentare din coșurile noastre sunt verificate pentru prospeți și calitate. Lucrăm cu furnizori de încredere și pregătim coșurile chiar înainte de livrare.",
    },
    {
      question: "Pot urmări comanda mea?",
      answer: "Da! După plasarea comenzii vei primi un email cu numărul de urmărire. Poți verifica statusul comenzii oricând pe pagina de tracking sau folosind numărul de urmărire primit.",
    },
    {
      question: "Oferiți coșuri pentru evenimente corporate?",
      answer: "Da! Avem o gamă specială de coșuri corporate și oferim și personalizări pentru comenzi în bulk. Contactează-ne pentru o ofertă personalizată.",
    },
    {
      question: "Ce se întâmplă dacă destinatarul nu este acasă?",
      answer: "Curierul va încerca să contacteze destinatarul telefonic. Dacă nu este disponibil, va lăsa un aviz și va programa o nouă livrare sau produsul poate fi ridicat de la oficiul curier.",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-bold mb-6">Întrebări Frecvente</h1>
          <p className="text-xl text-muted-foreground">
            Găsește răspunsuri rapide la cele mai comune întrebări
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-12 text-center glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Nu ai găsit răspunsul?</h2>
            <p className="text-muted-foreground mb-6">
              Echipa noastră este aici să te ajute!
            </p>
            <a
              href="/contact"
              className="text-primary hover:underline font-semibold"
            >
              Contactează-ne →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
