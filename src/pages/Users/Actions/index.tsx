import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { Row, Col } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import Section from '../../../components/Section';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import UsersService from '../../../services/users.service';
import { IParam } from '../../../interfaces';
import toastMsg, { ToastType } from '../../../utils/toastMsg';
import ERole from '../../../enums/ERole';
import Input from '../../../components/Input';
import { MaskedInput } from '../../../components/MaskedInput';
import { DateInput } from '../../../components/DateInput';

const createSchema = yup.object().shape({
  name: yup.string().min(2, 'Min. 2 caracteres').max(120, 'Máximo 120 caracteres').required('Campo obrigatório'),
  cpf: yup.string().length(11, 'CPF deve conter 11 dígitos').required('Campo obrigatório'),
  birthdate: yup.date().required('Campo obrigatório'),
  role: yup.mixed<keyof typeof ERole>().oneOf(Object.values([ERole.admin, ERole.user])),
  obs: yup.string().max(500, 'Max. 500 caracteres'),
  password: yup.string().min(6, 'Min. 6 caracteres').required('Campo obrigatório'),
  confirmPassword: yup
    .string()
    .min(6, 'Min. 6 caracteres')
    .required('Campo obrigatório')
    .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais'),
});

const updateSchema = yup.object().shape({
  name: yup.string().min(2, 'Min. 2 caracteres').max(120, 'Máximo 120 caracteres').required('Campo obrigatório'),
  cpf: yup.string().length(11, 'CPF deve conter 11 dígitos').required('Campo obrigatório'),
  birthdate: yup.date().required('Campo obrigatório'),
  role: yup.mixed<keyof typeof ERole>().oneOf(Object.values([ERole.admin, ERole.user])),
  obs: yup.string().max(500, 'Max. 500 caracteres'),
});

interface ICreate {
  name: string;
  cpf: string;
  birthdate: Date | undefined;
  role: ERole;
  obs: string;
  password: string;
  confirmPassword: string;
}

const defaultValue = {
  name: '',
  cpf: '',
  birthdate: undefined,
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

  async function submitHandler(values: ICreate): Promise<void> {
    try {
      setLoader(true);
      const { name, cpf, birthdate = new Date(), role, obs, password, confirmPassword } = values;

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
  }

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
      <Formik
        initialValues={initialValues}
        validationSchema={!id ? createSchema : updateSchema}
        enableReinitialize
        onSubmit={(values) => submitHandler(values)}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form>
            <Row>
              <Col md={8}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Input
                      cy="test-inputName"
                      isInvalid={(errors.name && touched.name) || false}
                      msg={errors.name}
                      label="Nome"
                      id="name"
                      name="name"
                      as="input"
                      placeholder="Insira o nome do funcionário"
                      disabled={!!id}
                    />
                  </Col>

                  <Col md={4} className="mb-3">
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
                      disabled={!!id}
                    />
                  </Col>

                  <Col md={4} className="mb-3">
                    <DateInput
                      cy="test-inputBirthdate"
                      id="birthdate"
                      name="birthdate"
                      value={`${values.birthdate}`}
                      onChange={handleChange}
                      label="Data de aniversário"
                      disabled={!!id}
                    />
                  </Col>

                  <Col md={4} className="mb-3">
                    <Input
                      cy="test-inputRole"
                      id="role"
                      name="role"
                      label="Papel do funcionário"
                      as="select"
                      isInvalid={(errors.role && touched.role) || false}
                      msg={errors.role}
                      placeholder="-- Selecione --"
                    >
                      <>
                        <option>-- Selecione --</option>
                        <option value={ERole.admin}>Administrador</option>
                        <option value={ERole.user}>Colaborador</option>
                      </>
                    </Input>
                  </Col>

                  {!id && (
                    <>
                      <Col md={6} className="mb-3">
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
                      <Col md={6} className="mb-3">
                        <Input
                          cy="test-inputConfirmPassword"
                          id="confirmPassword"
                          name="confirmPassword"
                          label="Confirmar senha"
                          as="input"
                          isInvalid={(errors.confirmPassword && touched.confirmPassword) || false}
                          msg={errors.confirmPassword}
                          placeholder="Confirmar senha"
                        />
                      </Col>
                    </>
                  )}

                  <Col md={12} className="mb-3">
                    <Input
                      cy="test-inputObs"
                      id="obs"
                      name="obs"
                      as="input"
                      label="Observações sobre o funcionário"
                      component="textarea"
                    />
                  </Col>

                  <Col md={12} className="mb-3">
                    <Button type="submit" cy="test-login" variant="primary" disabled={!!loader}>
                      {id ? 'Editar' : 'Criar'} funcionário
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Section>
  );
};

export default Create;
