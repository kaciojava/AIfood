# AIfood - Sistema de Delivery (Microsserviços)

Este projeto implementa o back-end de um ecossistema de delivery escalável, utilizando a arquitetura de microsserviços e persistência poliglota, com implantação orquestrada via Docker e Kubernetes.

## 🏗️ Arquitetura e Serviços

O ecossistema foi desenhado sob o padrão *Database-per-Service*, garantindo isolamento estrutural.

1. **Auth Service (Porta 3001):** 
   - Gerencia a autenticação e autorização via JWT.
   - **Banco de Dados:** PostgreSQL.
2. **Catalog Service (Porta 3002):** 
   - Gerencia o cardápio e a flexibilidade estrutural dos produtos.
   - **Banco de Dados:** MongoDB.
3. **Order Service (Porta 3003):** 
   - Controla o fluxo transacional e a máquina de estados dos pedidos.
   - **Banco de Dados:** PostgreSQL.
4. **Payment Service (Porta 3004):** 
   - Processa os pagamentos e atualiza a situação financeira do pedido.
   - **Banco de Dados:** PostgreSQL.

## 🚀 Como Executar o Projeto (Local)

Para rodar todo o ecossistema e os bancos de dados localmente utilizando contêineres:

1. Clone o repositório.
2. Certifique-se de que o Docker e o Docker Compose estão instalados.
3. Na raiz do projeto, execute:
   ```bash
   docker compose up -d --build
4. Os serviços estarão disponíveis nas portas 3001 a 3004.

## Orquestração com Kubernetes (K8s)
Os manifestos de infraestrutura estão localizados na pasta k8s/. Eles incluem as definições de Deployment, Service e ConfigMap para manter a aplicação resiliente e escalável no cluster.

Para aplicar as configurações em um cluster Kubernetes:
    ```bash
    kubectl apply -f k8s/deployment.yaml
## Testes Automatizados
O projeto conta com testes de integração utilizando Jest e Supertest.
Para rodar os testes do serviço de pedidos, por exemplo, navegue até a pasta order-service e execute:
    ```bash
    npx jest --forceExit