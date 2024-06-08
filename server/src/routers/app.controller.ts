import express, { Application } from 'express';
import { ProfileController } from './profile';
import { ProjectsController } from './projects';
import { LoginController } from './login';
import { HistoryController } from './history';
import { TimesheetController } from './timesheet';
import { PdfGeneratorController } from './pdfGenerator';
import { DashboardController } from './dashboard';

export class AppController {
  public app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  public registerControllers(): void {
    this.app.use(express.json());
    const profileController = new ProfileController();
    const projectsController = new ProjectsController();
    const loginController = new LoginController();
    const historyController = new HistoryController();
    const timesheetController = new TimesheetController();
    const pdfGeneratorController = new PdfGeneratorController();
    const dashboardController = new DashboardController();

    this.app.use('/profile', profileController.router);
    this.app.use('/projects', projectsController.router);
    this.app.use('/login', loginController.router);
    this.app.use('/history', historyController.router);
    this.app.use('/timesheet', timesheetController.router);
    this.app.use('/pdf', pdfGeneratorController.router);
    this.app.use("/dashboard", dashboardController.router);
  }
}