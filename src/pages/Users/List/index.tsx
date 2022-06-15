import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Section from '../../../components/Section';
import Text from '../../../components/Text';
import DataTable from '../../../components/DataTable';
import { IUser } from '../../../interfaces';
import UsersService from '../../../services/users.service';
import toastMsg, { ToastType } from '../../../utils/toastMsg';
import Button from '../../../components/Button';

const columns = [
  { label: 'Nome', key: 'name' },
  { label: 'Data de nascimento', key: 'birthdate', isDate: true },
  { label: 'CPF', key: 'cpf' },
  { label: 'Permissão', key: 'role' },
];

const Users: React.FunctionComponent = (): React.ReactElement => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const history = useHistory();

  const fetchUsers = async (): Promise<void> => {
    try {
      const rawUser = localStorage.getItem('user');
      if (!rawUser) {
        throw new Error();
      }
      const user: IUser = JSON.parse(rawUser);

      if (user.role === 'admin') {
        setIsAdmin(true);
      }

      const rawData = await UsersService.users();
      const data = rawData.filter((u) => u.id !== user.id);
      setUsers(data);
    } catch (error) {
      toastMsg(ToastType.Error, (error as Error).message);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      const res = await UsersService.delete(id);
      toastMsg(ToastType.Success, res);
      fetchUsers();
    } catch (error) {
      toastMsg(ToastType.Error, (error as Error).message);
    }
  };

  useEffect(() => {
    let isCleaningUp = false;

    if (!isCleaningUp) {
      fetchUsers();
    }
    return () => {
      isCleaningUp = true;
    };
  }, []);

  return (
    <Section className="users" title="Listagem de funcionários" description="Listagem de funcionários">
      <Row>
        <Col md={12}>
          <Text as="h1" size="2rem" weight={700}>
            Funcionários
          </Text>
          <Text as="small" size=".85rem" weight={400}>
            Gerencie seu grupo com agilidade!
          </Text>
        </Col>
      </Row>
      <Row>
        {isAdmin && (
          <Col md={3} className="mt-3 mb-2">
            <Button type="button" variant="primary" onClick={() => history.push('/funcionarios/acao')} cy="test-create">
              Cadastrar funcionário
            </Button>
          </Col>
        )}
        <Col md={3} className="mt-3 mb-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              localStorage.clear();
              history.push('/');
            }}
            cy="test-logout"
          >
            Logout
          </Button>
        </Col>
        <Col md={12}>
          <DataTable
            data={users}
            columns={columns}
            hasActions={!!isAdmin}
            deleteAction={(id) => deleteUser(id)}
            editAction={(id) => history.push(`/funcionarios/acao/${id}`)}
          />
        </Col>
      </Row>
    </Section>
  );
};

export default Users;
