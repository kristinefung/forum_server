import express from 'express';
import { IoCContainer } from '../ioc/ioc_container';

const iocContainer = new IoCContainer();
const userCtlr = iocContainer.getUserController();
const categoryGroupCtlr = iocContainer.getCategoryGroupController();
const categoryCtlr = iocContainer.getCategoryController();
const threadCtlr = iocContainer.getThreadController();

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

/*************************************************************
 *                    Category Module
 ************************************************************/
router.post('/categories', (req, res) => categoryCtlr.createCategory(req, res));
router.get('/categories/:id', (req, res) => categoryCtlr.getCategoryById(req, res));
router.get('/categories', (req, res) => categoryCtlr.getAllCategories(req, res));
router.delete('/categories/:id', (req, res) => categoryCtlr.deleteCategoryById(req, res));
router.put('/categories/:id', (req, res) => categoryCtlr.updateCategoryById(req, res));

/*************************************************************
 *                      Thread Module
 ************************************************************/
router.post('/threads', (req, res) => threadCtlr.createThread(req, res));
router.get('/threads/:id', (req, res) => threadCtlr.getThreadById(req, res));
router.get('/threads', (req, res) => threadCtlr.getAllThreads(req, res));
router.delete('/threads/:id', (req, res) => threadCtlr.deleteThreadById(req, res));
router.put('/threads/:id', (req, res) => threadCtlr.updateThreadById(req, res));

export { router };