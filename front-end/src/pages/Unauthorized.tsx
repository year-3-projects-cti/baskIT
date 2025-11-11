import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div className="container mx-auto max-w-2xl py-24 text-center">
    <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">Cod 403</p>
    <h1 className="text-4xl font-bold mb-4">Acces restricționat</h1>
    <p className="text-muted-foreground mb-8">
      Nu ai permisiunile necesare pentru a accesa această secțiune. Dacă ar trebui să ai acces, contactează administratorul
      pentru a-ți actualiza rolul.
    </p>
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Button asChild variant="secondary">
        <Link to="/">Înapoi la magazin</Link>
      </Button>
      <Button asChild>
        <Link to="/contact">Contactează-ne</Link>
      </Button>
    </div>
  </div>
);

export default Unauthorized;
