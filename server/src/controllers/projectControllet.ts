import {Router, Request, Response} from 'express';

import {getRepository} from 'typeorm';
import Project         from '../models/Project';
import ErrorMessage    from '../libs/error';


export default class ProjectController{

    private static router: Router = Router();

    private static async getProjects(req: Request, res: Response){
        
        interface POST{
            take  : number;
            skip  : number;
            userId: number;
        }

        let 
            POST    : POST           = req.body,
            projects: Array<Project> = [];

        console.log(POST);

        if(POST.take == undefined){
            res.status(400).send({error: ErrorMessage.dataNotSended('take')});
            return;
        }

        if(POST.skip == undefined){
            res.status(400).send({error: ErrorMessage.dataNotSended('skip')});
            return;
        }

        if(POST.userId == undefined){
            res.status(400).send({error: ErrorMessage.dataNotSended('userId')});
            return;
        }

        try{
            projects = await getRepository(Project).createQueryBuilder()
                .where('authorId = :id', {id: POST.userId})
                .skip(POST.skip)
                .take(POST.take)
                .orderBy('Project.id', 'DESC')
                .getMany();
        }catch(err){
            res.status(400).send({error: 'Error with DB'});
            throw new Error(err);
        }

        res.status(200).send({projects: projects});
    }


    public static routes(){
        this.router.all('/get-projects' , this.getProjects);
        return this.router;
    }
}