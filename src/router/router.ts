import express from 'express';
import { IoCContainer } from '../ioc/ioc_container';

const iocContainer = new IoCContainer();
const userCtlr = iocContainer.getUserController();

const router = express.Router();

/*************************************************************
 *                        Info
 ************************************************************/
router.get('/health', (req, res) => { res.json({ status: 'health' }) });

/*************************************************************
 *                        User Module
 ************************************************************/
router.post('/users', (req, res) => userCtlr.createUser(req, res));

router.post('/users/verify-user', (req, res) => userCtlr.verifyUser(req, res));

export { router };