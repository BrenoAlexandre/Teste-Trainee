import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import Section from '../../components/Section';
import Text from '../../components/Text';
import Button from '../../components/Button';
import UsersService from '../../services/users.service';
import toastMsg, { ToastType } from '../../utils/toastMsg';
import { MaskedInput } from '../../components/MaskedInput';
import Input from '../../components/Input';

const loginSchema = yup.object().shape({
  cpf: yup.string().length(11, 'CPF deve conter 11 dígitos').required('Campo obrigatório'),
  password: yup.string().min(6, 'Min. 6 caracteres').required('Campo obrigatório'),
});

interface ILogin {
  cpf: string;
  password: string;
}

const defaultValue = {
  cpf: '',
  password: '',
} as ILogin;

const Home: React.FunctionComponent = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [initialValues] = useState(defaultValue as ILogin);

  const history = useHistory();

  async function loginHandler(values: ILogin): Promise<void> {
    setLoader(true);
    const { cpf, password } = values;

    try {
      localStorage.clear();
      const data = await UsersService.login(cpf, password);

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

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            enableReinitialize
            onSubmit={(values) => loginHandler(values)}
          >
            {({ values, handleChange, errors, touched }) => (
              <Form>
                <Text as="h2" size="1.85rem" weight={700}>
                  Login
                </Text>

                <Col md={3} className="mb-3">
                  <MaskedInput
                    mask="999.999.999-99"
                    cy="test-inputCpf"
                    id="cpf"
                    name="cpf"
                    label="CPF"
                    msg={errors.cpf}
                    value={values.cpf}
                    onChange={handleChange}
                    placeholder="Insira o cpf do funcionário"
                  />
                </Col>

                <Col md={3} className="mb-3">
                  <Input
                    cy="test-inputPassword"
                    id="password"
                    name="password"
                    as="input"
                    label="Senha do funcionário"
                    isInvalid={(errors.password && touched.password) || false}
                    msg={errors.password}
                    placeholder="Senha"
                  />
                </Col>

                <Col md={12} className="mb-3">
                  <Button type="submit" variant="primary" disabled={loader} cy="test-login">
                    Login
                  </Button>
                </Col>
              </Form>
            )}
          </Formik>
          <Text as="span"> Caso não consiga acessar, contate seu administrador</Text>
        </Col>
      </Row>
    </Section>
  );
};

export default Home;
