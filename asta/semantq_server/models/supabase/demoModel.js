import supabase from '../adapters/supabase.js';

const DemoModel = {
  async findDemoModelById(id) {
    const { data, error } = await supabase
      .from('demomodels')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createDemoModel(data) {
    const { name, description } = data;
    const { error } = await supabase
      .from('demomodels')
      .insert([{ name, description }]);

    if (error) throw error;
  }
};

export default DemoModel;
