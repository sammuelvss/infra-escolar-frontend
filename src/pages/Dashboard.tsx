import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { LogOut, School, MapPin, Building2, PieChart, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Escola {
  id_escola: number;
  nome: string;
  municipio: string;
  dependencia: string;
  endereco?: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<Escola[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Buscamos um pouco mais de escolas para os gráficos ficarem interessantes
        // Se quiser ver todas, teria que ajustar o backend para trazer tudo ou criar rota de estatisticas
        const response = await api.get('/schools');
        setSchools(response.data);
      } catch (error) {
        console.error("Erro ao carregar escolas", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  // --- Lógica para Gerar os Dados dos Gráficos ---

  // 1. Contar escolas por Dependência (Municipal, Estadual, Privada)
  const dependenciaCount = schools.reduce((acc, escola) => {
    const key = escola.dependencia || 'Não informado';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.keys(dependenciaCount).map(key => ({
    name: key,
    value: dependenciaCount[key]
  }));

  // 2. Contar escolas por Município
  const municipioCount = schools.reduce((acc, escola) => {
    const key = escola.municipio || 'Outros';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barChartCategories = Object.keys(municipioCount);
  const barChartValues = Object.values(municipioCount);


  // --- Configurações Visuais dos Gráficos (ECharts) ---

  const pieOption = {
    backgroundColor: 'transparent',
    title: { 
      text: 'Distribuição por Dependência', 
      left: 'center', 
      textStyle: { color: '#fff', fontSize: 16 } 
    },
    tooltip: { trigger: 'item' },
    legend: { bottom: '0%', textStyle: { color: '#ccc' } },
    series: [
      {
        name: 'Dependência',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#1f2937', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 18, fontWeight: 'bold', color: '#fff' }
        },
        data: pieChartData
      }
    ]
  };

  const barOption = {
    backgroundColor: 'transparent',
    title: { 
      text: 'Escolas por Município', 
      left: 'center', 
      textStyle: { color: '#fff', fontSize: 16 } 
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: [
      {
        type: 'category',
        data: barChartCategories,
        axisTick: { alignWithLabel: true },
        axisLabel: { color: '#ccc' },
        axisLine: { lineStyle: { color: '#374151' } }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: { color: '#ccc' },
        splitLine: { lineStyle: { color: '#374151' } }
      }
    ],
    series: [
      {
        name: 'Quantidade',
        type: 'bar',
        barWidth: '60%',
        data: barChartValues,
        itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <School className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Infraestrutura Escolar</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-transparent hover:border-red-500"
          >
            <LogOut size={18} /> 
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Seção de Gráficos */}
        {!loading && schools.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Gráfico 1: Pizza */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <PieChart size={20} />
                <h3 className="font-semibold">Perfil das Escolas</h3>
              </div>
              <ReactECharts option={pieOption} style={{ height: '300px' }} />
            </div>

            {/* Gráfico 2: Barras */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gray-600 transition-colors">
               <div className="flex items-center gap-2 mb-4 text-blue-400">
                <BarChart3 size={20} />
                <h3 className="font-semibold">Distribuição Regional</h3>
              </div>
              <ReactECharts option={barOption} style={{ height: '300px' }} />
            </div>
          </div>
        )}

        {/* Seção da Tabela */}
        <div>
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-white">Lista Detalhada</h2>
              <p className="text-gray-400 mt-1 text-sm">
                Visualizando as primeiras {schools.length} unidades cadastradas.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-gray-500 animate-pulse">Carregando dados do sistema...</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-semibold border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Nome da Escola</th>
                      <th className="px-6 py-4">Município</th>
                      <th className="px-6 py-4">Dependência</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {schools.map((escola) => (
                      <tr key={escola.id_escola} className="hover:bg-gray-700/50 transition-colors duration-150 group">
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">#{escola.id_escola}</td>
                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                             <School size={16} />
                          </div>
                          {escola.nome}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-500" />
                            {escola.municipio}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            escola.dependencia === 'Estadual' 
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                              : escola.dependencia === 'Municipal'
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : 'bg-gray-500/10 text-gray-300 border-gray-500/20'
                          }`}>
                            <Building2 size={12} />
                            {escola.dependencia}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-gray-900/30 border-t border-gray-700 text-center text-gray-500 text-xs">
                Mostrando {schools.length} resultados de um total de registros no banco.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}