const request = require('supertest');
const app = require('../server');

describe('Order Service - Domain Validations', () => {
  let createdOrderId;

  it('Deve criar um novo pedido com estado inicial PENDENTE', async () => {
    const res = await request(app)
      .post('/orders')
      .send({
        user_id: 1,
        product_name: 'X-Burguer Gourmet',
        quantity: 2,
        total_price: 57.00
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    
    createdOrderId = res.body.id;
  });

  it('Deve processar a transição de estado da máquina para CONCLUIDO', async () => {
    const res = await request(app)
      .put(`/orders/${createdOrderId}/status`)
      .send({
        new_status: 'CONCLUIDO'
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('CONCLUIDO');
  });
});