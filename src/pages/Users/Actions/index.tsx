import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Form, Formik } from 'formik';
import { Row, Col } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import classNames from 'classnames';
import Section from '../../../components/Section';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import UsersService from '../../../services/users.service';
import { IParam } from '../../../interfaces';
import toastMsg, { ToastType } from '../../../utils/toastMsg';
import ERole from '../../../enums/ERole';

const createSchema = yup.object().shape({
  name: yup.string().min(2, 'Min. 2 caracteres').max(50, 'Máximo 50 caracteres').required('Campo obrigatório'),
  cpf: yup.string().length(11, 'CPF deve conter 11 dígitos').required('Campo obrigatório'),
  birthdate: yup.date().required('Campo obrigatório'),
  role: yup.mixed<keyof typeof ERole>().oneOf(Object.values([ERole.admin, ERole.user])),
  obs: yup.string().max(500, 'Max. 500 caracteres'),
  password: yup.string().min(6, 'Min. 6 caracteres').required('Campo obrigatório'),
  confirmPassword: yup
    .string()
    .min(6, 'Min. 6 caracteres')
    .required('Campo obrigatório')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

interface ICreate {
  name: string;
  cpf: string;
  birthdate: Date;
  role: ERole;
  obs: string;
  password: string;
  confirmPassword: string;
}

const defaultValue = {
  name: '',
  cpf: '',
  birthdate: new Date(),
  role: ERole.default,
  obs: '',
  password: '',
  confirmPassword: '',
} as ICreate;

const Create: React.FunctionComponent = (): React.ReactElement => {
  const history = useHistory();
  const { id } = useParams<IParam>();
  const [loader, setLoader] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState(defaultValue as ICreate);

  const submitHandler = async (values: ICreate): Promise<void> => {
    try {
      setLoader(true);
      const { name, cpf, birthdate, role, obs, password, confirmPassword } = values;

      if (id) {
        await UsersService.update(id, { name, cpf, birthdate, role, obs });
        toastMsg(ToastType.Success, 'Atualização realizada com sucesso!');
      } else {
        await UsersService.create({ name, cpf, birthdate, role, obs, password, confirmPassword });
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
              name: res.name,
              cpf: res.cpf,
              birthdate: res.birthdate,
              role: res.role,
              obs: res.obs,
              password: res.password,
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
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Formik
            initialValues={initialValues}
            validationSchema={createSchema}
            enableReinitialize
            onSubmit={submitHandler}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12} className="mb-3">
                    <label htmlFor="name" className="w-100">
                      Nome
                      <br />
                      <input
                        date-testid="test-inputName"
                        id="name"
                        name="name"
                        disabled={!!id}
                        value={`${values.name}`}
                        onChange={handleChange}
                        placeholder="Nome do funcionário"
                        className={classNames('form-control')}
                      />
                    </label>
                  </Col>

                  <Col md={4} className="mb-3">
                    <label htmlFor="cpf" className="w-100">
                      CPF
                      <br />
                      <input
                        data-testid="test-inputCpf"
                        id="cpf"
                        name="cpf"
                        disabled={!!id}
                        value={`${values.cpf}`}
                        onChange={handleChange}
                        placeholder="CPF do funcionário"
                        className={classNames('form-control')}
                      />
                    </label>
                  </Col>

                  <Col md={4} className="mb-3">
                    <div className="w-100">
                      Data de Nascimento
                      <br />
                      <input
                        data-testid="test-inputBirthdate"
                        id="birthdate"
                        name="birthdate"
                        type="date"
                        disabled={!!id}
                        value={`${values.birthdate}`}
                        onChange={handleChange}
                        className={classNames('form-control')}
                      />
                    </div>
                  </Col>

                  <Col md={4} className="mb-3">
                    <label htmlFor="role" className="w-100">
                      Papel do funcionário
                      <br />
                      <select
                        data-testid="test-selectRole"
                        id="role"
                        name="role"
                        value={`${values.role}`}
                        onChange={handleChange}
                        className={classNames('form-control')}
                      >
                        <option>-- Selecione --</option>
                        <option value={ERole.admin}>Administrador</option>
                        <option value={ERole.user}>Colaborador</option>
                      </select>
                    </label>
                  </Col>

                  {!id && (
                    <>
                      <Col md={6} className="mb-3">
                        <label htmlFor="password" className="w-100">
                          Senha
                          <br />
                          <input
                            data-testid="test-inputPassword"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Senha"
                            className={classNames('form-control')}
                          />
                        </label>
                      </Col>

                      <Col md={6} className="mb-3">
                        <label htmlFor="confirmPassword" className="w-100">
                          Confirmar senha
                          <br />
                          <input
                            data-testid="test-inputConfirmPassword"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirmar senha"
                            className={classNames('form-control')}
                          />
                        </label>
                      </Col>
                    </>
                  )}

                  <Col md={12} className="mb-3">
                    <label htmlFor="obs" className="w-100">
                      Observações
                      <br />
                      <textarea
                        data-testid="test-inputObs"
                        id="obs"
                        name="obs"
                        value={`${values.obs}`}
                        onChange={handleChange}
                        placeholder="Observações sobre o funcionário..."
                        className={classNames('form-control')}
                      />
                    </label>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Button type="submit" cy="test-login" variant="primary" disabled={!!loader}>
                      {id ? 'Editar' : 'Criar'} funcionário
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
