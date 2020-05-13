import React, { useState, useEffect, FormEvent } from 'react';

import { Title, Form, Repositories, Error } from './styles';
import { FiChevronRight } from 'react-icons/fi';
import Logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';

import api from '../../services/api';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem(
            '@Githubexplorer:repositories',
        );

        if (storagedRepositories) {
            return JSON.parse(storagedRepositories);
        } else {
            return [];
        }
    });
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');

    useEffect(() => {
        localStorage.setItem(
            '@Githubexplorer:repositories',
            JSON.stringify(repositories),
        );
    }, [repositories]);

    const handleAddRepository = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!newRepo) {
            setInputError('Digite o autor/nome do repositório');
            return;
        }

        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);

            const repository = response.data;

            setRepositories([...repositories, repository]);

            setInputError('');
            setNewRepo('');
        } catch (error) {
            setInputError('Erro na busca por esse repositório');
        }
    };

    return (
        <>
            <img src={Logo} alt="Github Explorer" />
            <Title>Explore repositórios no github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    placeholder="Digite o nome do repositório"
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                />
                <button type="submit">Pesquisar</button>
            </Form>
            {inputError && <Error>{inputError}</Error>}
            <Repositories>
                {repositories.map((repository) => (
                    <Link
                        to={`repositories/${repository.full_name}`}
                        key={repository.full_name}
                        href="#"
                    >
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    );
};

export default Dashboard;
