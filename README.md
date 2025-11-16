# Portfolio - Wesley Rios

Portfolio pessoal desenvolvido com HTML, CSS, JavaScript e Three.js.

## Estrutura de Diretórios

```
Portfolio/
├── index.html              # Página principal
├── images/
│   └── profile-photo.jpg   # Sua foto de perfil (adicione aqui)
├── firebase.json           # Configuração do Firebase Hosting
├── .firebaserc            # ID do projeto Firebase
└── .gitignore             # Arquivos ignorados pelo Git
```

## Como Adicionar sua Foto de Perfil

1. Coloque sua foto na pasta `images/`
2. Renomeie o arquivo para `profile-photo.jpg`
3. Formatos suportados: JPG, PNG, WebP
4. Tamanho recomendado: 400x400px ou maior (quadrado)

## Deploy no Firebase Hosting

### Pré-requisitos

1. Instale o Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Faça login no Firebase:
```bash
firebase login
```

### Configuração Inicial

1. Edite o arquivo `.firebaserc` e substitua `"your-project-id"` pelo ID do seu projeto Firebase:
```json
{
  "projects": {
    "default": "seu-projeto-id"
  }
}
```

2. Se ainda não criou um projeto no Firebase:
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Crie um novo projeto
   - Ative o Firebase Hosting

### Deploy

1. Inicialize o Firebase Hosting (apenas na primeira vez):
```bash
firebase init hosting
```
   - Selecione o projeto existente
   - Configure o diretório público como `.` (ponto)
   - Configure como single-page app: `Yes`
   - Não sobrescreva o index.html: `No`

2. Faça o deploy:
```bash
firebase deploy
```

3. Para fazer deploy apenas do hosting:
```bash
firebase deploy --only hosting
```

### Atualizações Futuras

Após a configuração inicial, basta executar:
```bash
firebase deploy
```

## Recursos

- **Three.js**: Animação 3D de fundo
- **Glassmorphism**: Efeito de vidro nos cards
- **Responsive Design**: Layout adaptável para mobile e desktop
- **Smooth Scroll**: Navegação suave entre seções

