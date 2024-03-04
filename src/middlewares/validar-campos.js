import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json(error);
    }

    next();
}

// Middleware para validar categorias
export const validarcategorias = (req, res, next) => {
    const { businessCategory } = req.body;
    const allowedCategories = ["pequeña empresa", "micro empresa", "mediana empresa", "grande empresa"];

    if (!allowedCategories.includes(businessCategory.toLowerCase())) {
        return res.status(400).json({ error: "Categoría de empresa no válida", 
        msg: `Categorias validas ["pequeña empresa", "micro empresa", "mediana empresa", "grande empresa"]`  });
    }

    next();
};