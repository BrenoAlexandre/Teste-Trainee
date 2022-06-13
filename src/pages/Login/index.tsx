import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import InputMask from 'react-input-mask';
import Section from '../../components/Section';
import Text from '../../components/Text';
import Button from '../../components/Button';
import UsersService from '../../services/users.service';
import toastMsg, { ToastType } from '../../utils/toastMsg';

const Home: React.FunctionComponent = () => {
  const [cpf, setCpf] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);

  const history = useHistory();

  async function loginHandler(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoader(true);

    try {
      const data = await UsersService.login(cpf.replace(/\D/g, ''), password);

      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
        history.replace('/funcionarios');
      }

      setLoader(false);
    } catch (error) {
      toastMsg(ToastType.Error, 'Usuário incorreto, verifique seus dados.');
      setLoader(false);
    }
  }

  return (
    <Section className="home" title="Página inicial" description="Página inicial">
      <Row>
        <Col md={8}>
          <Text as="h1" size="2rem" weight={700}>
            Página inicial - Controle de Funcionários
          </Text>

          <Text as="small" size="1rem" weight={400}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          </Text>

          <form onSubmit={(e) => loginHandler(e)} style={{ paddingTop: '25px' }}>
            <Text as="h2" size="1.85rem" weight={700}>
              Login
            </Text>

            <Col md={3} className="mb-3">
              <label htmlFor="cpf" className="w-100">
                <Text as="span" size="1.2rem">
                  CPF
                </Text>
                <br />
                <InputMask
                  mask="999.999.999-99"
                  maskPlaceholder=""
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                >
                  {() => (
                    <input
                      data-testid="test-inputCpf"
                      id="cpf"
                      name="cpf"
                      placeholder="000.000.000-00"
                      className={classNames('form-control')}
                    />
                  )}
                </InputMask>
              </label>
            </Col>

            <Col md={3} className="mb-3">
              <label htmlFor="password" className="w-100">
                <Text as="span" size="1.2rem">
                  Senha
                </Text>
                <br />
                <input
                  data-testid="test-inputPassword"
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Insira sua senha"
                  className={classNames('form-control')}
                />
              </label>
            </Col>

            <Col md={12} className="mb-3">
              <Button type="submit" variant="primary" disabled={loader} cy="test-login">
                Login
              </Button>
            </Col>
          </form>
          <Text as="span"> Caso não consiga acessar, contate seu administrador</Text>
        </Col>
      </Row>
    </Section>
  );
};

export default Home;
