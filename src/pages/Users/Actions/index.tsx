import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { Row, Col } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import Section from '../../../components/Section';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import UsersService from '../../../services/users.service';
import { IParam } from '../../../interfaces';
import toastMsg, { ToastType } from '../../../utils/toastMsg';

const createSchema = yup.object().shape({
  name: yup.string().min(2, 'Min. 2 caracteres').max(50, 'Máximo 50 caracteres').required('Campo obrigatório'),
  lastName: yup.string().min(2, 'Min. 2 caracteres').max(50, 'Máximo 50 caracteres').required('Campo obrigatório'),
  email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
});

interface ICreate {
  name: string;
  lastName: string;
  email: string;
}

const defaultValue = {
  name: '',
  lastName: '',
  email: '',
} as ICreate;

const Create: React.FunctionComponent = (): React.ReactElement => {
  const history = useHistory();
  const { id } = useParams<IParam>();
  const [loader, setLoader] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState(defaultValue as ICreate);

  const handleSubmit = async (values: ICreate): Promise<void> => {
    try {
      setLoader(true);
      const { name, lastName, email } = values;

      if (id) {
        await UsersService.update(name, lastName, email, id);
        toastMsg(ToastType.Success, 'Atualização realizada com sucesso!');
      } else {
        await UsersService.create(name, lastName, email);
        toastMsg(ToastType.Success, 'Cadastro realizado com sucesso!');
      }

      setLoader(false);
      history.push('/funcionarios');
    } catch (error) {
      setLoader(false);
      toastMsg(ToastType.Error, (error as Error).message);
    }
  };

  useEffect(() => {
    let isCleaningUp = false;

    async function getUserById(): Promise<void> {
      try {
        if (!isCleaningUp && id) {
          const res = await UsersService.user(id);
          if (res) {
            const obj = {
              name: res.first_name,
              lastName: res.last_name,
              email: res.email,
            } as ICreate;

            setInitialValues(obj);
          }
        }
      } catch (error) {
        toastMsg(ToastType.Error, (error as Error).message);
      }
    }

    getUserById();

    return () => {
      isCleaningUp = true;
    };
  }, [history, id]);

  return (
    <Section
      className="create"
      title={`${id ? 'Editar' : 'Criar'} funcionário`}
      description={`${id ? 'Editar' : 'Criar'} funcionário`}
    >
      <Row className="mb-5">
        <Col md={12}>
          <Text as="h1" size="2rem" weight={700}>
            {id ? 'Editar' : 'Criar'} funcionário
          </Text>
          <Text as="small" size=".85rem" weight={400}>
            Os campos abaixo já contém validações configuradas para exemplo
          </Text>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Formik
            initialValues={initialValues}
            validationSchema={createSchema}
            enableReinitialize
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({ errors, touched }) => (
              <Form autoComplete="off">
                <Row>
                  <Col md={12} className="mb-3">
                    <Input
                      cy="test-inputName"
                      isInvalid={(errors.name && touched.name) || false}
                      msg={errors.name}
                      label="Nome do funcionário"
                      id="name"
                      name="name"
                      as="input"
                      placeholder="Insira um nome para o funcionário"
                    />
                  </Col>
                  <Col md={12} className="mb-3">
                    <Input
                      cy="test-inputLastName"
                      isInvalid={(errors.lastName && touched.lastName) || false}
                      msg={errors.lastName}
                      label="Sobrenome"
                      id="lastName"
                      name="lastName"
                      as="input"
                      placeholder="Insira um sobrenome para o funcionário"
                    />
                  </Col>
                  <Col md={12} className="mb-3">
                    <Input
                      cy="test-inputEmail"
                      isInvalid={(errors.email && touched.email) || false}
                      msg={errors.email}
                      label="E-mail"
                      id="email"
                      name="email"
                      as="input"
                      placeholder="Insira um e-mail para o funcionário"
                    />
                  </Col>
                  <Col md={12} className="mt-3">
                    <Button type="submit" disabled={loader} variant="primary" cy="test-create">
                      {id ? 'Editar informações do funcionário' : 'Cadastrar novo funcionário'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Section>
  );
};

export default Create;
