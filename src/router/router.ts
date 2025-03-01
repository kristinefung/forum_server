import express from 'express';
import { IoCContainer } from '../ioc/ioc_container';

const iocContainer = new IoCContainer();
const userCtlr = iocContainer.getUserController();
const categoryGroupCtlr = iocContainer.getCategoryGroupController();

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
router.post('/users/login', (req, res) => userCtlr.login(req, res));

/*************************************************************
 *                  Category Group Module
 ************************************************************/
router.post('/category-groups', (req, res) => categoryGroupCtlr.createCategoryGroup(req, res));
router.get('/category-groups/:id', (req, res) => categoryGroupCtlr.getCategoryGroupById(req, res));
router.get('/category-groups', (req, res) => categoryGroupCtlr.getAllCategoryGroups(req, res));
router.delete('/category-groups/:id', (req, res) => categoryGroupCtlr.deleteCategoryGroupById(req, res));
router.put('/category-groups/:id', (req, res) => categoryGroupCtlr.updateCategoryGroupById(req, res));

export { router };