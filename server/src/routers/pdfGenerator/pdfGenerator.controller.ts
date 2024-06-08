import { Request, Response, Router } from "express";
import { PdfGeneratorResponse, PdfGeneratorService } from "./pdfGenerator.service";
import { PdfGeneratorValidator } from "./pdfGenerator.validator";

export class PdfGeneratorController {
    public router = Router();

    constructor() {
        this.router.get("/", this.land)
        this.router.post("/create", this.createPDF);
    }

    private async land(req: Request, res: Response) {
        try {
            const testmsg = await PdfGeneratorService.land();
            res.send(testmsg);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    private async createPDF(req: Request, res: Response) {
        return res.json(await PdfGeneratorService.createPDF(PdfGeneratorValidator.validatePdfGenerateRequest(req.body)));
    }
}