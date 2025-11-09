import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: "u1", email, name: email.split("@")[0], role: 'user' });
    nav("/");
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader><CardTitle>Autentificare</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm">Email</label>
              <Input type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Parolă</label>
              <Input type="password" required value={pass} onChange={e=>setPass(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Conectează-te</Button>
            <p className="text-sm text-muted-foreground">
              Nu ai cont? <Link to="/register" className="text-primary">Înregistrează-te</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
