'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import authRoutes from '../src/auth/auth.routes.js';
import companiRoutes from '../src/companies/companies.routes.js';

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/managerSystem/v1/auth';
        this.companiPath = '/managerSystem/v1/compani';
        this.middlewares();
        this.conectarDB();
        this.routes();
        
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.companiPath, companiRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;