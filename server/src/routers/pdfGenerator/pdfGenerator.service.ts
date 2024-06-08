//import { UUID } from "crypto";
import { pgDatabase } from "../../Database";
import { PdfGenerateRequest } from "./pdfGenerator.validator";
import { ApiError } from "../../common";
import { StatusCodes } from "http-status-codes";
import { PDFDocument, rgb } from 'pdf-lib';

export type PdfGeneratorResponse = {
    // the pdf Generator was designed to output a byte array
    pdfFileBytes: Uint8Array
}


export class PdfGeneratorService {
    public static land() {
        return "PDF Generator";
    }

    public static async createPDF(req: PdfGenerateRequest): Promise<string> {
        // const { csr_number, job_reference_number, on_site_time, off_site_time, engineer_names, job_description, company_name,
        //     site_contact_name, site_contact_mobile, site_contact_email, address, is_the_job_completed, is_the_project_completed,
        //     equipment_replacement, uploaded_image_source, engineer_sign_datetime, client_sign_datetime, footnote
        // } = req;
        function DateToString(date:Date){
            const dayString = date.toLocaleString('en-us',{weekday:'short'})
            const dateString = [date.getDate(), date.toLocaleString('en-us',{month:'short'}), date.getFullYear()].join('-')
            const timeString = date.toTimeString().slice(0,5);
            const mergedDateString = dayString+" "+dateString+" "+timeString;
            return mergedDateString;
        }
          
        try {
            // TODO: pass the request to PDF generator, format the response as generated base64 string
            // Create a new PDFDocument
            const pdfDoc = await PDFDocument.create()

            // Add a blank page to the document
            const page = pdfDoc.addPage()

            // Get the width and height of the page
            const { width, height } = page.getSize()

            // Draw title
            const titleFontSize = 18
            const headerColor = rgb(0, 0.53, 0.71)
            page.drawText('Client Service Report', 
                {x: 50, y: height - 4 * titleFontSize, size: titleFontSize, color: headerColor})

            // Draw company logo
            const companyLogoPngUrl = 'https://logos-download.com/wp-content/uploads/2021/01/Ntt_Data_Logo.png';
            const pngImageBytes = await fetch(companyLogoPngUrl).then((res) => res.arrayBuffer());
            const companyLogoPngImage = await pdfDoc.embedPng(pngImageBytes);
            const pngDims = companyLogoPngImage.scale(0.5);
            page.drawImage(companyLogoPngImage, {
                x: page.getWidth() - pngDims.width / 15 - 50,
                y: height - 4 * titleFontSize,
                width: pngDims.width/15,
                height: pngDims.height/15,
            })

            // draw subtitle: CSR number
            const subTitleFontSize = 14
            page.drawText('CSR '+ req.csr_number, 
                {x: 50, y: height - 8 * subTitleFontSize, size: subTitleFontSize})

            // draw section 1
            // section 1: headers
            const contentFontSize = 10
            page.drawText('Job Reference No', 
                {x:50, y:height - 12 * subTitleFontSize, size:contentFontSize, color:headerColor})
            page.drawText('On Site Time', 
                {x:50, y:height - 14 * subTitleFontSize, size:contentFontSize, color:headerColor})
            page.drawText('Off Site Time', 
                {x:50, y:height - 16 * subTitleFontSize, size:contentFontSize, color:headerColor})
            page.drawText('Engineer(s) Name', 
                {x:50, y:height - 18 * subTitleFontSize, size:contentFontSize, color:headerColor})
            page.drawText('Job Description', 
                {x:50, y:height - (19+req.engineer_names.length) * subTitleFontSize, size:contentFontSize, color:headerColor})
            
            page.drawText('Company Name', 
                {x:width - 300, y:height - 12 * subTitleFontSize, size:contentFontSize, color:headerColor})
            page.drawText('Site Contact Name', 
                {x:width - 300, y:height - 14 * subTitleFontSize, size:contentFontSize, color:headerColor,})
            page.drawText('Site Contact Mobile', 
                {x:width - 300, y:height - 16 * subTitleFontSize, size:contentFontSize, color:headerColor})
            page.drawText('Site Contact Email', 
                {x:width - 300, y:height - 18 * subTitleFontSize, size:contentFontSize, color:headerColor})
            page.drawText('Address', 
                {x:width - 300, y:height - (19+req.engineer_names.length) * subTitleFontSize, size:contentFontSize, color:headerColor})

            page.drawText('Is the Job Completed?', 
                {x:50, y:height - (24+req.engineer_names.length) * subTitleFontSize, size:contentFontSize, color:headerColor})
            page.drawText('Is the Project Completed?', 
                {x:width - 300, y:height - (24+req.engineer_names.length) * subTitleFontSize, size:contentFontSize, color:headerColor})
                
            // section 1: content
            page.drawText(req.job_reference_number, 
                {x:160, y:height - 12 * subTitleFontSize, size:contentFontSize})
            
            page.drawText(DateToString(req.on_site_time), 
                {x:160, y:height - 14 * subTitleFontSize, size:contentFontSize})
            
            page.drawText(DateToString(req.off_site_time), 
                {x:160, y:height - 16 * subTitleFontSize, size:contentFontSize})
            
            // if have multiple engineers, start in a new line for each name
            for(let i=0; i<req.engineer_names.length; i++){
                page.drawText(req.engineer_names[i], 
                {x:160, y:height - (18+i) * subTitleFontSize, size:contentFontSize});
            }
            
            page.drawText(req.company_name, 
                {x:width - 180, y:height - 12 * subTitleFontSize, size:contentFontSize})
            page.drawText(req.site_contact_name, 
                {x:width - 180, y:height - 14 * subTitleFontSize, size:contentFontSize})
            page.drawText(req.site_contact_mobile, 
                {x:width - 180, y:height - 16 * subTitleFontSize, size:contentFontSize})
            page.drawText(req.site_contact_email, 
                {x:width - 180, y:height - 18 * subTitleFontSize, size:contentFontSize})

            page.drawText(req.job_description, 
                {x:50, y:height - (20+req.engineer_names.length) * subTitleFontSize, size:contentFontSize, maxWidth:200})
            
            page.drawText(req.address, 
                {x:width - 300, y:height - (20+req.engineer_names.length) * subTitleFontSize, size:contentFontSize, maxWidth:200})
            
            page.drawText(req.is_the_job_completed ? 'yes': 'no', 
                {x:160, y:height - (24+req.engineer_names.length) * subTitleFontSize, size:contentFontSize})
            page.drawText(req.is_the_project_completed ? 'yes': 'no', 
                {x:width - 180, y:height - (24+req.engineer_names.length) * subTitleFontSize, size:contentFontSize})

            // draw section 2
            page.drawText('Equipment Replacement', 
                {x:50, y:height - (28+req.engineer_names.length) * subTitleFontSize, size:contentFontSize, color:headerColor})
            page.drawText('Part Number', 
                {x:50, y:height - (30+req.engineer_names.length) * subTitleFontSize, size:contentFontSize})
            page.drawText('Serial Number', 
                {x:width - 300, y:height - (30+req.engineer_names.length) * subTitleFontSize, size:contentFontSize})
            
            page.drawText(req.equipment_replacement.part_number, 
                {x:50, y:height - (31+req.engineer_names.length) * subTitleFontSize, size:contentFontSize});
            page.drawText(req.equipment_replacement.serial_number, 
                {x:width - 300, y:height - (31+req.engineer_names.length) * subTitleFontSize, size:contentFontSize});
            
            page.drawText('Uploaded Image', 
                {x:50, y:height - (34+req.engineer_names.length) * subTitleFontSize, size:contentFontSize, color:headerColor})

            page.drawText(req.uploaded_image_source, 
                {x:50, y:height - (36+req.engineer_names.length) * subTitleFontSize, size:contentFontSize});

            // draw section 3
            page.drawText('Engineer Name', 
                {x:50, y:height - (40+req.engineer_names.length) * subTitleFontSize, size:contentFontSize, color:headerColor})
            // if have multiple engineers, start in a new line for each name
            for(let i=0; i<req.engineer_names.length; i++){
                page.drawText(req.engineer_names[i], 
                {x:50, y:height - (45+i) * subTitleFontSize, size:subTitleFontSize});
            }
            page.drawText(DateToString(req.engineer_sign_datetime), 
                {x:50, y:height - (46+req.engineer_names.length) * subTitleFontSize, size:contentFontSize})
            
            page.drawText('Client Signature', 
                {x:width - 300, y:height - (40+req.engineer_names.length) * subTitleFontSize, size:contentFontSize, color:headerColor})
            
            page.drawText(DateToString(req.client_sign_datetime), 
                {x:width - 300, y:height - (46+req.engineer_names.length) * subTitleFontSize, size:contentFontSize})
            
            // draw footnote
            const footnoteFontSize = 8
            page.drawText(req.footnote, 
                {x:50, y:100, size:footnoteFontSize, maxWidth: width - 100})
            
            
            //Serialize the PDFDocument to base64 string
            const pdfString = await pdfDoc.saveAsBase64();

            return pdfString;

            // at client side, use below to convert returned base64 string to pdf document
            // function savePdfFromByteArray(reportName, base64String) {
            //     var binaryString = window.atob(base64String);
            //     var binaryLen = binaryString.length;
            //     var bytes = new Uint8Array(binaryLen);
            //     for (var i = 0; i < binaryLen; i++) {
            //     var ascii = binaryString.charCodeAt(i);
            //     bytes[i] = ascii;
            //     }
            //     var blob = new Blob([bytes], {type: "application/pdf"});
            //     var link = document.createElement('a');
            //     link.href = window.URL.createObjectURL(blob);
            //     var fileName = reportName;
            //     link.download = fileName;
            //     link.click();
            // };

            // savePdfFromByteArray("Client Service Report", base64String); // base64String is the response from calling pdf/create
        } catch (err) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error generating PDF");
        }
    }
}
