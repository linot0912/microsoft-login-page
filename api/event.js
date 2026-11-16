
import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { participant_id, event_type } = req.body || {};

    if (
      typeof participant_id !== "string" ||
      participant_id.length < 1 ||
      participant_id.length > 100 ||
      !["form_submitted"].includes(event_type)
    ) {
      return res.status(400).json({ error: "Données invalides" });
    }

    const sql = neon(process.env.DATABASE_URL);

    await sql`
      INSERT INTO simulation_events (participant_id, event_type)
      VALUES (${participant_id}, ${event_type})
    `;

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

