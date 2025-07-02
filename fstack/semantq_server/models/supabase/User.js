import supabase from '../adapters/supabase.js';

const User = {
  async findUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
  async createUser(data) {
    const { email, password } = data;
    const { error } = await supabase
      .from('users')
      .insert([{ email, password }]);

    if (error) throw error;
  }
};

export default User;
