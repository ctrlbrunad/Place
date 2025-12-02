import request from 'supertest';
import express from 'express';
import { updateMyProfileController } from '../Controllers/userController.js';
import { userService } from '../Services/userService.js';

jest.mock('../Services/userService.js');

const app = express();
app.use(express.json());
app.put('/profile', (req, res, next) => {
    req.user = { uid: '123' };
    next();
}, updateMyProfileController);

describe('updateMyProfileController', () => {
    it('should return 500 if userService throws an error', async () => {
        userService.updateUserProfile.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .put('/profile')
            .send({ nome: 'Test User' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro ao atualizar o perfil.');
        expect(response.body.error).toBe('Database error');
    });
});
