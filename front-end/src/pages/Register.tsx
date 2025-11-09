import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Register = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: "u-new", email, name, role:'user' });
    nav("/");
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader><CardTitle>Înregistrare</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm">Nume</label>
              <Input required value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Email</label>
              <Input type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Parolă</label>
              <Input type="password" required value={pass} onChange={e=>setPass(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Creează cont</Button>
            <p className="text-sm text-muted-foreground">
              Ai deja cont? <Link to="/login" className="text-primary">Autentifică-te</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
