import { response, request } from "express";
import Compani from './companies.model.js';
import User from '../users/user.model.js'
import excel from 'excel4node';

export const createCompani = async (req, res) => {
    try {
        const { name,
            businessActivity,
            yearsOfExperience,
            impactLevel,
            businessCategory } = req.body;

        const userId = req.user._id;
        const lowercasedCategory = businessCategory.toLowerCase();
        const compani = new Compani({
            name,
            businessActivity,
            yearsOfExperience,
            impactLevel,
            businessCategory: lowercasedCategory,
            user: userId
        });

        await compani.save();
        res.status(200).json({
            msg: "The companies was created successfully",
            compani,
        });
    } catch (error) {
        console.error("Error creating companies:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateCompani = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...resto } = req.body;
        const { user } = req;

        // Buscar la empresa por ID
        const compani = await Compani.findById(id);

        // Verificar si la empresa existe
        if (!compani) {
            return res.status(404).json({ error: "Company not found" });
        }

        // Verificar permisos del usuario
        if (compani.user.toString() !== user._id.toString() && user.role !== 'administrador') {
            return res.status(403).json({ error: "You do not have permissions to update this company," +
            "only user who created it" });
        }

        // Actualizar la empresa
        const companiActualizado = await Compani.findByIdAndUpdate(id, resto, { new: true });

        res.status(200).json({
            msg: "The company was successfully updated",
            compani: companiActualizado,
        });
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/*
    NOTA: Para evitar problemas de plagio especificamos que con los compañeros:
        Jose David Soto Puac - 2019315
        Brandon Steev Mendoza Peres - 2019349
        Alejandro Benjamin Max López - 2019189

        Nos reunimos en una llamada para trabajar en conjunto para poder realizar 
        las validaciones de filtros de A-Z, Z-A, Años, se puede evidenciar que los 
        tres trabajamos en conjunto y los tres realizamos aportes significativos para
        realizar estas validaciones. 
*/

export const getCompaniAZ = async (req, res) => {
    try {

        // obtener las empresar de forma ascendente por name utilizando valor 1 para indicar que es ascendente
        const companies = await Compani.find().sort({ name: 1 });
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error getting companies in ascending order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getCompaniZA = async (req, res) => {
    try {
        // obtener las empresar de forma ascendente por name utilizando valor 1 para indicar que es ascendente
        const companies = await Compani.find().sort({ name: -1 });
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error getting companies in descending order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getCompaniByCategory = async (req, res) => {
    try {
        let { businessCategory } = req.body;

        // Convert businessCategory to lowercase
        businessCategory = businessCategory.toLowerCase();

        const companies = await Compani.find({ businessCategory });

        res.status(200).json({
            msg: `Companies with businessCategory '${businessCategory}' retrieved successfully`,
            companies,

        });
    } catch (error) {
        console.error("Error fetching companies by businessCategory:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getBusinessByYear = async (req, res) => {
    try {
        let { startYear, endYear } = req.body;

        if (!startYear) {
            startYear = endYear;
        }

        // Validación: Si endYear está vacío, tomar el valor de startYear
        if (!endYear) {
            endYear = startYear;
        }

        const query = {
            yearsOfExperience: {
                $gte: startYear,
                $lte: endYear
            }
        };

        // Ordenar resultados por años de experiencia de forma ascendente
        const compani = await Compani.find(query).sort({ yearsOfExperience: 1 }).exec();

        res.status(200).json({
            compani
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const generateExcelReport = async (req, res) => {
    try {
        const companies = await Compani.find();

        const wb = new excel.Workbook();
        const ws = wb.addWorksheet('Companies Report');

        // Definir estilos
        const headerStyle = wb.createStyle({
            font: {
                color: '#FFFFFF',
                bold: true,
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '#4F81BD',
            },
            alignment: {
                horizontal: 'center',
            },
        });

        const rowStyle = wb.createStyle({
            fill: {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '#D9E1F2',
            },
            alignment: {
                horizontal: 'center',
            },
        });

        const centeredStyle = wb.createStyle({
            alignment: {
                horizontal: 'center',
            },
        });

        // Definir encabezados
        const headers = ['Name', 'Business Activity', 'Years of Experience', 'Impact Level', 'Business Category', 'User'];
        headers.forEach((header, index) => {
            ws.cell(1, index + 1).string(header).style(headerStyle);
        });

        // Llenar datos y aplicar estilos a las filas
        for (let rowIndex = 0; rowIndex < companies.length; rowIndex++) {
            const company = companies[rowIndex];
            const rowStart = rowIndex + 2;

            ws.cell(rowStart, 1).string(company.name || '').style(rowStyle).style(centeredStyle);
            ws.cell(rowStart, 2).string(company.businessActivity || '').style(rowStyle).style(centeredStyle);
            ws.cell(rowStart, 3).number(company.yearsOfExperience || 0).style(rowStyle).style(centeredStyle);
            ws.cell(rowStart, 4).string(company.impactLevel || '').style(rowStyle).style(centeredStyle);
            ws.cell(rowStart, 5).string(company.businessCategory || '').style(rowStyle).style(centeredStyle);

            // Obtener detalles del usuario
            const user = await User.findById(company.user).exec();
            ws.cell(rowStart, 6).string(user ? user.name : '').style(rowStyle).style(centeredStyle);
        }

        // Ajustar automáticamente el ancho de las columnas
        for (let i = 1; i <= headers.length; i++) {
            ws.column(i).setWidth(23);
        }

        // Configurar respuesta HTTP
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Companies_Report.xlsx');

        // Enviar el archivo Excel como respuesta
        res.send(await wb.writeToBuffer());
    } catch (error) {
        console.error("Error generating Excel report:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};