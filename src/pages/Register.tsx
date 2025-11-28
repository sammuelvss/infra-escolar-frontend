import { useState } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import { Mail, Lock, UserPlus, Loader2 } from 'lucide-react';
    import api from '../services/api';

    export function Register() {
      const navigate = useNavigate();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);

      async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
          await api.post('/auth/register', { email, password });
          alert('Conta criada! Agora faça login.');
          navigate('/');
        } catch (error) {
          alert('Erro ao criar conta.');
        } finally {
          setLoading(false);
        }
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
          <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl border border-gray-700">
            <div className="text-center text-white mb-6">
              <UserPlus className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="text-2xl font-bold mt-2">Criar Conta</h2>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={20}/>
                <input type="email" required placeholder="Seu email" value={email} onChange={e=>setEmail(e.target.value)} 
                  className="w-full pl-10 p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500" size={20}/>
                <input type="password" required placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)} 
                  className="w-full pl-10 p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <button disabled={loading} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded font-bold flex justify-center">
                {loading ? <Loader2 className="animate-spin" /> : 'Cadastrar'}
              </button>
            </form>
            <p className="text-center mt-4 text-gray-400">
              Já tem conta? <Link to="/" className="text-blue-400 hover:underline">Entrar</Link>
            </p>
          </div>
        </div>
      );
    }