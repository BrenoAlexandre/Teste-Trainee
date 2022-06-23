import React, { useEffect, useState } from 'react';
import { Button as BootButton, Row, Col, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { formatCPF } from '@brazilian-utils/brazilian-utils';
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

  const [open, setOpen] = useState<boolean>(false);
  const [delId, setDelId] = useState<string>('');

  const handleClose = (): void => setOpen(false);
  const handleOpen = (id: string): void => {
    setOpen(true);
    setDelId(id);
  };

  const history = useHistory();

  const fetchUsers = async (): Promise<void> => {
    try {
      const rawUser = localStorage.getItem('USER');
      if (!rawUser) {
        throw new Error();
      }
      const user: IUser = JSON.parse(rawUser);

      if (user.role === 'admin') {
        setIsAdmin(true);
      }

      const rawData = await UsersService.users();
      const data = rawData.filter((u) => u.id !== user.id).map((u) => ({ ...u, cpf: formatCPF(u.cpf) }));
      setUsers(data);
    } catch (error) {
      toastMsg(ToastType.Error, (error as Error).message);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      const res = await UsersService.delete(id);
      if (res) {
        toastMsg(ToastType.Success, 'User succesfully deleted');
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      toastMsg(ToastType.Error, (error as Error).message);
    }
  };

  useEffect((): void => {
    try {
      let isCleaningUp = false;

      if (!isCleaningUp) {
        fetchUsers();
      }

      isCleaningUp = true;
    } catch (error) {
      toastMsg(ToastType.Error, (error as Error).message);
    }
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
            deleteAction={(id) => handleOpen(id)}
            editAction={(id) => history.push(`/funcionarios/acao/${id}`)}
          />
          <Modal show={open} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Excluir usuário?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                Você tem certeza que deseja excluir este usuário?
                <br />
                <br /> Suas ações não poderam ser desfeitas.
              </p>
            </Modal.Body>

            <Modal.Footer>
              <BootButton variant="secondary" onClick={handleClose}>
                Cancelar
              </BootButton>
              <BootButton variant="primary" onClick={() => deleteUser(delId)}>
                Excluir
              </BootButton>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Section>
  );
};

export default Users;
