<p align="center">
  <img src="https://softdesign.com.br/wp-content/themes/bones/library/images/logotipo.svg" alt="Softdesign logo" />
</p>

# Pré-requisitos

Digite o comando:

`$ yarn install`

E tenha um terminal rodando o <a href='https://github.com/BrenoAlexandre/Teste-Trainee-api'>backend</a>

# Start

Digite o comando:

`$ yarn start`

# Test

Digite o comando:

`$ yarn dev`


# Problemas conhecidos

- O campo de data do formulário não está no formato dd/mm/yyyy. (Não consegui trocar a formatação do input, mas a data vai pro banco e é exibida no formato correto)
- Ao acessar realizar login novamente após um logout, a lista de usuários não é carregada. Acredito que isso aconteça devido a um atraso no context ao atribuir o USER no local storage.
