import Business from "../companies/companies.model.js";

export const existentCompaniName = async (name = '') => {
    const companiName = await Business.findOne({ name });
    if (companiName) {
        throw new Error(`Companies with name ${name} already exists on DB`);
    }
}

export const existeCompaniById = async ( companyId = '') => {
    const existeCompani = await Business.findOne({companyId});
    if(!existeCompani){
        throw new Error(`La compania con el id: ${ companyId } no existe`);
    }
}