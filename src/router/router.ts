import express from 'express';
import { IoCContainer } from '../ioc/ioc_container';

const iocContainer = new IoCContainer();
const userCtlr = iocContainer.getUserController();
const categoryGroupCtlr = iocContainer.getCategoryGroupController();
const categoryCtlr = iocContainer.getCategoryController();
const threadCtlr = iocContainer.getThreadController();
const commentCtlr = iocContainer.getCommentController();

const router = express.Router();

/*************************************************************
 *                        Info
 ************************************************************/
router.get('/health', (req, res) => { res.json({ status: 'health' }) });

/*************************************************************
 *                        User Module
 ************************************************************/
router.post('/user', (req, res) => userCtlr.createUser(req, res));
router.post('/user/verify-user', (req, res) => userCtlr.verifyUser(req, res));
router.post('/user/login', (req, res) => userCtlr.login(req, res));

/*************************************************************
 *                  Category Group Module
 ************************************************************/
router.post('/category-group', (req, res) => categoryGroupCtlr.createCategoryGroup(req, res));
router.get('/category-group/:id', (req, res) => categoryGroupCtlr.getCategoryGroupById(req, res));
router.get('/category-group', (req, res) => categoryGroupCtlr.getAllCategoryGroups(req, res));
router.delete('/category-group/:id', (req, res) => categoryGroupCtlr.deleteCategoryGroupById(req, res));
router.put('/category-group/:id', (req, res) => categoryGroupCtlr.updateCategoryGroupById(req, res));

/*************************************************************
 *                    Category Module
 ************************************************************/
router.post('/category', (req, res) => categoryCtlr.createCategory(req, res));
router.get('/category/:id', (req, res) => categoryCtlr.getCategoryById(req, res));
router.get('/category', (req, res) => categoryCtlr.getAllCategories(req, res));
router.delete('/category/:id', (req, res) => categoryCtlr.deleteCategoryById(req, res));
router.put('/category/:id', (req, res) => categoryCtlr.updateCategoryById(req, res));

/*************************************************************
 *                      Thread Module
 ************************************************************/
router.post('/thread', (req, res) => threadCtlr.createThread(req, res));
router.get('/thread/:id', (req, res) => threadCtlr.getThreadById(req, res));
router.get('/thread', (req, res) => threadCtlr.getAllThreads(req, res));
router.delete('/thread/:id', (req, res) => threadCtlr.deleteThreadById(req, res));
router.put('/thread/:id', (req, res) => threadCtlr.updateThreadById(req, res));

/*************************************************************
 *                      Comment Module
 ************************************************************/
router.post('/comment', (req, res) => commentCtlr.createComment(req, res));
router.get('/comment/:id', (req, res) => commentCtlr.getCommentById(req, res));
router.get('/comment', (req, res) => commentCtlr.getAllComments(req, res));
router.delete('/comment/:id', (req, res) => commentCtlr.deleteCommentById(req, res));
router.put('/comment/:id', (req, res) => commentCtlr.updateCommentById(req, res));


export { router };