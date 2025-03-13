import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.all("/api", async (req, res) => {
    const { method, scope, table, queryParams, body, apiKey } = req.body;

    if (!scope) {
        return res.status(400).json({ message: "Error: Scope is required (e.g., 'supabase')" });
    }

    if (scope === "supabase") {
        if (!table) {
            return res.status(400).json({ message: "Error: Table name is required for Supabase operations" });
        }

        try {
            let response;

            if (method === "POST") {
                // Insert data into the specified Supabase table
                const { data, error } = await supabase.from(table).insert([JSON.parse(body)]);
                if (error) throw error;
                response = { message: `${table} entry added successfully`, data };
            } 
            else if (method === "GET") {
                // Fetch records from the specified Supabase table
                const { data, error } = await supabase.from(table).select("*").match(queryParams);
                if (error) throw error;
                response = { message: `${table} data retrieved successfully`, data };
            } 
            else if (method === "PUT") {
                // Update a record in the specified Supabase table
                const { data, error } = await supabase.from(table).update(JSON.parse(body)).match(queryParams);
                if (error) throw error;
                response = { message: `${table} entry updated successfully`, data };
            } 
            else if (method === "DELETE") {
                // Delete records from the specified Supabase table
                const { data, error } = await supabase.from(table).delete().match(queryParams);
                if (error) throw error;
                response = { message: `${table} entry deleted successfully`, data };
            } 
            else {
                return res.status(400).json({ message: "Error: Invalid HTTP method" });
            }

            res.json(response);
        } catch (error) {
            console.error("Supabase Error:", error);
            res.status(500).json({ message: "Supabase request failed", error: error.message });
        }
    } else {
        // Handle non-Supabase requests (e.g., external API requests)
        const { endPoint } = req.body;

        if (!endPoint) {
            return res.status(400).json({ message: "Error: Endpoint is required for non-Supabase API calls" });
        }

        try {
            const url = `${endPoint}${Object.keys(queryParams).length ? "?" : ""}${new URLSearchParams(queryParams).toString()}`;
            const config = {
                method,
                url,
                headers: {
                    "Content-Type": "application/json",
                    ...(apiKey && { apiKey }),
                },
                ...(method !== "GET" && { data: body }),
            };

            const axiosResponse = await axios(config);
            res.json(axiosResponse.data);
        } catch (error) {
            console.error("API Error:", error);
            res.status(500).json({ message: "API request failed", error: error.message });
        }
    }
});

app.listen(port, () => console.log(`✅ Server running on port ${port}`));
