import React, { useEffect, useState } from 'react';

import { useRouteMatch, Link } from 'react-router-dom';
import Logo from '../../assets/logo.svg';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import { Header, RepositoryInfo, Issues } from './styles';

interface RepositoryParams {
    repository: string;
}

interface Repository {
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    owner: {
        login: string;
        avatar_url: string;
    };
}

interface Issue {
    id: number;
    title: string;
    html_url: string;
    user: {
        login: string;
    };
}

const Repository: React.FC = () => {
    const [repository, setRepository] = useState<Repository | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);

    const { params } = useRouteMatch<RepositoryParams>();

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            const [repository, issues] = await Promise.all([
                api.get(`repos/${params.repository}`),
                api.get(`repos/${params.repository}/issues`),
            ]);

            setRepository(repository.data);
            setIssues(issues.data);
        };
        loadData();
    }, [params.repository]);

    return (
        <>
            <Header>
                <img src={Logo} alt="Github Explorer" />
                <Link to="/">
                    <FiChevronLeft size={16} />
                    Voltar
                </Link>
            </Header>

            {(repository && (
                <RepositoryInfo>
                    <header>
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                    </header>
                    <ul>
                        <li>
                            <strong>{repository.stargazers_count}</strong>
                            <span>Stars</span>
                        </li>

                        <li>
                            <strong>{repository.forks_count}</strong>
                            <span>Forks</span>
                        </li>

                        <li>
                            <strong>{repository.open_issues_count}</strong>
                            <span>Issues abertas</span>
                        </li>
                    </ul>
                </RepositoryInfo>
            )) || <></>}

            <Issues>
                {(issues &&
                    issues.map((item, index) => (
                        <a key={item.id} target="_blank" href={item.html_url}>
                            <div>
                                <strong>{item.user.login}</strong>
                                <p>{item.title}</p>
                            </div>
                            <FiChevronRight size={20} />
                        </a>
                    ))) || <></>}
            </Issues>
        </>
    );
};

export default Repository;