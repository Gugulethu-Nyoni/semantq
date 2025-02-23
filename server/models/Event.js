import { supabase } from '../utils/supabaseClient'; // Make sure to import your Supabase client

export default class Event {
  constructor(data) {
    this.data = data;
  }

  // CRUD Operations
  static async createRecord(data) {
    const { data: record, error } = await supabase
      .from('events') // Using plural table name
      .insert([data])
      .single();

    if (error) throw error;
    return record;
  }

  static async getAllRecords() {
    const { data, error } = await supabase
      .from('events')
      .select('*');

    if (error) throw error;
    return data;
  }

  static async updateRecord(id, data) {
    const { data: updatedRecord, error } = await supabase
      .from('events')
      .update(data)
      .eq('id', id)
      .single();

    if (error) throw error;
    return updatedRecord;
  }

  static async deleteRecord(id) {
    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }
}