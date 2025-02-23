import companyService from '../services/companyService.js';

class CompanyController {
  async createCompany(req, res) {
    try {
      const company = await companyService.createCompany(req.body);
      res.status(201).json(company);
    } catch (error) {
      console.error(`❌ Failed to create Company:`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }

  async getCompany(req, res) {
    try {
      const company = await companyService.getCompanyById(req.params.id);
      res.status(200).json(company);
    } catch (error) {
      console.error(`❌ Failed to fetch Company:`, error);
      res.status(404).json({ error: 'Company not found', details: error.stack });
    }
  }

  async getAllCompanys(req, res) {
    try {
      const companys = await companyService.getAllCompanys();
      res.status(200).json(companys);
    } catch (error) {
      console.error(`❌ Failed to fetch all Companys:`, error);
      res.status(500).json({ error: 'Failed to fetch all records', details: error.stack });
    }
  }

  async updateCompany(req, res) {
    try {
      const company = await companyService.updateCompany(req.params.id, req.body);
      res.status(200).json(company);
    } catch (error) {
      console.error(`❌ Failed to update Company:`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }

  async deleteCompany(req, res) {
    try {
      await companyService.deleteCompany(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error(`❌ Failed to delete Company:`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }
}

export default new CompanyController();