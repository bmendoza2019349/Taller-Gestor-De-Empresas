import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js';

import {
    createCompani,
    getCompaniAZ,
    getCompaniZA,
    getBusinessByYear,
    getCompaniByCategory,
    updateCompani,
    generateExcelReport
} from "./companies.controller.js";

import { validarCampos, validarcategorias } from '../middlewares/validar-campos.js';
import { existeCompaniById, existentCompaniName } from '../helpers/db-validartors.js';

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("name", "The name of Business is required").not().isEmpty(),
        check("name").custom(existentCompaniName),
        check("impactLevel", "Required field").not().isEmpty(),
        check("businessActivity", "Required field").not().isEmpty(),
        check("businessCategory", "Required field").not().isEmpty(),
        check("yearsOfExperience", "You must give the years of your business").not().isEmpty(),
        validarcategorias,
        validarCampos,
    ], createCompani
);

router.get("/companies-az", validarJWT, getCompaniAZ);
router.get("/companies-za", validarJWT, getCompaniZA);
router.get("/years", validarJWT, getBusinessByYear);
router.get('/category', validarJWT, getCompaniByCategory);

router.put(
    '/:id',
    [
        check("companyId", "El id no es un formato valido de MongoDB").isMongoId(),
        check("companyId").custom(existeCompaniById),
        validarcategorias,
        validarJWT,
    ],
    updateCompani
);

router.get('/companies/report', generateExcelReport);

export default router;