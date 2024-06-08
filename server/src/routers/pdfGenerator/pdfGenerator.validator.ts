import { RequestValidator } from "../../validator";

export type PdfGenerateRequest = {
    csr_number: string;
    job_reference_number: string;
    on_site_time: Date;
    off_site_time: Date;
    engineer_names: string[];
    job_description: string;
    company_name: string;
    site_contact_name: string;
    site_contact_mobile: string;
    site_contact_email: string;
    address: string;
    is_the_job_completed: boolean;
    is_the_project_completed: boolean;
    equipment_replacement: EquipmentReplacement; // originally drafted as an array, due to limitation in the typescript validation, changed to 1 item only
    uploaded_image_source: string; // place holder string please put : "no uploaded image"
    engineer_sign_datetime: Date;
    client_sign_datetime: Date;
    footnote: string
}

type EquipmentReplacement = {
    part_number: string;
    serial_number: string;
}

export class PdfGeneratorValidator {
    public static validatePdfGenerateRequest(req: unknown): PdfGenerateRequest {
        const reqObj = RequestValidator.asRecord(req);

        // Ensure `csr_number` parameter is correct
        // csr_number is same as project_id ?
        const csr_number = RequestValidator.asString(reqObj.csr_number, "'csr_number' is invalid");

        // Ensure `job_reference_number` parameter is correct
        // job_reference_number is same as project_so ?
        const job_reference_number = RequestValidator.asString(reqObj.job_reference_number, "'job_reference_number' is invalid");

        // Ensure `on_site_time` parameter is correct
        // on_site_time is same as company_name ?
        const on_site_time = RequestValidator.asDate(reqObj.on_site_time, "'on_site_time' is invalid");

        // Ensure `off_site_time` parameter is correct
        // off_site_time is same as site_contact_name?
        const off_site_time = RequestValidator.asDate(reqObj.off_site_time, "'off_site_time' is invalid");

        // Ensure `engineer_names` parameter is correct
        const engineer_names = RequestValidator.asArray(reqObj.engineer_names, "'engineer_names' is invalid") as string[];

        // Ensure `job_description` parameter is correct
        const job_description = RequestValidator.asString(reqObj.job_description, "'job_description' is invalid");

        // Ensure `company_name` parameter is correct
        const company_name = RequestValidator.asString(reqObj.company_name, "'company_name' is invalid");

        // Ensure `site_contact_name` parameter is correct
        const site_contact_name = RequestValidator.asString(reqObj.site_contact_name, "'site_contact_name' is invalid");

        // Ensure `site_contact_mobile` parameter is correct
        const site_contact_mobile = RequestValidator.asString(reqObj.site_contact_mobile, "'site_contact_mobile' is invalid");

        // Ensure `site_contact_email` parameter is correct
        const site_contact_email = RequestValidator.asString(reqObj.site_contact_email, "'site_contact_email' is invalid");

        // Ensure `address` parameter is correct
        const address = RequestValidator.asString(reqObj.address, "'address' is invalid");

        // Ensure `is_the_job_completed` parameter is correct
        const is_the_job_completed = RequestValidator.asBoolean(reqObj.is_the_job_completed, "'is_the_job_completed' is invalid");

        // Ensure `is_the_project_completed` parameter is correct
        const is_the_project_completed = RequestValidator.asBoolean(reqObj.is_the_project_completed, "'is_the_project_completed' is invalid");

        // Ensure `equipment_replacement` parameter is correct
        const equipment_replacement = RequestValidator.asRecord(reqObj.equipment_replacement, "'equipment_replacement' is invalid") as EquipmentReplacement;

        // Ensure `uploaded_image_source` parameter is correct
        const uploaded_image_source = RequestValidator.asString(reqObj.uploaded_image_source, "'uploaded_image_source' is invalid");

        // Ensure `engineer_sign_datetime` parameter is correct
        const engineer_sign_datetime = RequestValidator.asDate(reqObj.engineer_sign_datetime, "'engineer_sign_datetime' is invalid");

        // Ensure `client_sign_datetime` parameter is correct
        const client_sign_datetime = RequestValidator.asDate(reqObj.client_sign_datetime, "'client_sign_datetime' is invalid");

        // Ensure `footnote` parameter is correct
        const footnote = RequestValidator.asString(reqObj.footnote, "'footnote' is invalid");
        
        return {
            csr_number, job_reference_number, on_site_time, off_site_time, engineer_names, job_description, company_name,
            site_contact_name, site_contact_mobile, site_contact_email, address, is_the_job_completed, is_the_project_completed,
            equipment_replacement, uploaded_image_source, engineer_sign_datetime, client_sign_datetime, footnote
        };
    }
}