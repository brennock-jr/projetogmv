import { createFileRoute } from '@tanstack/react-router'
import { useIdentity } from '@/lib/identity-context'
import { useState, useEffect } from 'react'
import { Shield, Upload, Save, User as UserIcon } from 'lucide-react'

export const Route = createFileRoute('/perfil')({
  component: PerfilPage,
})

function PerfilPage() {
  const { user } = useIdentity()
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' })

  // Estados do formulário
  const [fotoBase64, setFotoBase64] = useState('')
  const [idade, setIdade] = useState('')
  const [altura, setAltura] = useState('')
  const [peso, setPeso] = useState('')
  const [tipoSanguineo, setTipoSanguineo] = useState('')
  const [localServico, setLocalServico] = useState('')
  const [anoServico, setAnoServico] = useState('')
  const [termoAceite, setTermoAceite] = useState(false)

  // Carregar dados existentes quando o componente for montado
  useEffect(() => {
    if (user?.userMetadata) {
      const meta = user.userMetadata as any
      setIdade(meta.idade || '')
      setAltura(meta.altura || '')
      setPeso(meta.peso || '')
      setTipoSanguineo(meta.tipoSanguineo || '')
      setLocalServico(meta.localServico || '')
      setAnoServico(meta.anoServico || '')
      setFotoBase64(meta.foto || '')
      setTermoAceite(!!meta.termoAceite)
    }
  }, [user])

  // Função para comprimir a imagem no navegador
  const processarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        // Redimensionar para um máximo de 150x150 para poupar espaço
        const canvas = document.createElement('canvas')
        const MAX_SIZE = 150
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width
            width = MAX_SIZE
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height
            height = MAX_SIZE
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Converter para JPEG com 70% de qualidade
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
        setFotoBase64(compressedBase64)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setMensagem({ tipo: '', texto: '' })

    try {
      // Obter o token do utilizador atual para autenticar o pedido ao GoTrue/Netlify
      const token = await (user as any)?.jwt?.()
      
      const resposta = await fetch('/.netlify/identity/user', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            idade,
            altura,
            peso,
            tipoSanguineo,
            localServico,
            anoServico,
            foto: fotoBase64,
            termoAceite,
          }
        }),
      })

      if (!resposta.ok) throw new Error('Falha ao atualizar o perfil.')
      
      setMensagem({ tipo: 'sucesso', texto: 'Dossiê de agente atualizado com sucesso.' })
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: 'Ocorreu um erro ao guardar os dados.' })
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 border-b border-military-olive/30 pb-4 flex items-center gap-3">
        <Shield className="w-8 h-8 text-military-olive" />
        <div>
          <h1 className="text-2xl font-bold text-military-green uppercase tracking-wider">Dossiê do Agente</h1>
          <p className="text-gray-600 text-sm">Registo Pessoal e Informações Médicas</p>
        </div>
      </div>

      {mensagem.texto && (
        <div className={`mb-6 p-4 rounded text-sm font-medium ${mensagem.tipo === 'erro' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl border border-parchment-dark overflow-hidden">
        <form onSubmit={handleGuardar} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Coluna da Fotografia */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-40 h-40 bg-parchment rounded-sm border-2 border-dashed border-military-olive/50 flex items-center justify-center overflow-hidden relative group">
                {fotoBase64 ? (
                  <img src={fotoBase64} alt="Foto do Agente" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-gray-400" />
                )}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs font-semibold">Alterar Foto</span>
                  <input type="file" accept="image/*" onChange={processarImagem} className="hidden" />
                </label>
              </div>
              <p className="text-xs text-gray-500 text-center max-w-[150px]">
                A imagem será automaticamente comprimida para o registo.
              </p>
            </div>

            {/* Coluna dos Dados */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Idade</label>
                  <input type="number" required value={idade} onChange={(e) => setIdade(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded bg-parchment focus:border-military-olive focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Altura (cm)</label>
                  <input type="number" required value={altura} onChange={(e) => setAltura(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded bg-parchment focus:border-military-olive focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Peso (kg)</label>
                  <input type="number" required step="0.1" value={peso} onChange={(e) => setPeso(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded bg-parchment focus:border-military-olive focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Tipo Sanguíneo</label>
                  <select required value={tipoSanguineo} onChange={(e) => setTipoSanguineo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded bg-parchment focus:border-military-olive focus:outline-none text-sm">
                    <option value="">Selecione...</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Local de Serviço Militar</label>
                  <input type="text" required value={localServico} onChange={(e) => setLocalServico(e.target.value)} placeholder="Ex: Regimento de Infantaria" className="w-full px-3 py-2 border border-gray-300 rounded bg-parchment focus:border-military-olive focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Ano de Serviço</label>
                  <input type="number" required value={anoServico} onChange={(e) => setAnoServico(e.target.value)} placeholder="Ex: 2018" className="w-full px-3 py-2 border border-gray-300 rounded bg-parchment focus:border-military-olive focus:outline-none text-sm" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <label className="flex items-start gap-3 p-4 bg-red-50/50 border border-red-100 rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    required 
                    checked={termoAceite}
                    onChange={(e) => setTermoAceite(e.target.checked)}
                    className="mt-1 w-4 h-4 text-military-olive rounded border-gray-300 focus:ring-military-olive"
                  />
                  <span className="text-xs text-gray-700 leading-relaxed">
                    <strong>Termo de Consentimento:</strong> Declaro para os devidos fins que compreendo os riscos inerentes às atividades ao ar livre e missões operacionais propostas. Isento os organizadores, a chefia e o Grupo Missões Veteranos de quaisquer responsabilidades cíveis ou criminais sobre condições adversas de saúde, lesões ou incidentes resultantes da minha participação. Confirmo que as informações médicas fornecidas são verdadeiras.
                  </span>
                </label>
              </div>

            </div>
          </div>

          <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={carregando || !termoAceite}
              className="flex items-center gap-2 bg-military-olive hover:bg-military-green text-white px-6 py-2.5 rounded font-bold uppercase tracking-wider text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {carregando ? 'A Guardar...' : 'Guardar Dossiê'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}