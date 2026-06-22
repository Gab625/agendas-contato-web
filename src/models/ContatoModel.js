import { supabaseClient } from '../config.js';

export class ContatoModel {
    static async getAll(searchTerm = "") {
        let query = supabaseClient.from("contato").select("*");
        if (searchTerm.trim() !== "") {
            query = query.ilike("nome", `%${searchTerm}%`);
        }
        const { data, error } = await query.order("id", { ascending: true });
        if (error) throw error;
        return data;
    }

    static async create(contato) {
        const { error } = await supabaseClient.from("contato").insert([contato]);
        if (error) throw error;
    }

    static async update(id, contato) {
        const { error } = await supabaseClient.from("contato").update(contato).eq("id", id);
        if (error) throw error;
    }

    static async delete(id) {
        const { error } = await supabaseClient.from("contato").delete().eq("id", id);
        if (error) throw error;
    }
}